using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class EventRepository : IEventRepository
    {
        const int MaxEvent = 4;
        const int MaxPhotoEvent = 25;
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        public readonly IPhotoService _photoService;

        public EventRepository(DataContext dataContext, IMapper mapper, IPhotoService photoService)
        {
            this._mapper = mapper;
            this._dataContext = dataContext;
            this._photoService = photoService;
        }
        public async Task<EventDto> AddEventAsync(EventDto addEventDto)
        {
            if (await this._dataContext.Events.CountAsync() > MaxEvent) throw new Exception("Cannot add more than " + MaxEvent.ToString() + " events!");

            var duplidateEvent = await this._dataContext.Events
                .FirstOrDefaultAsync(e => e.EventName.ToLower() == addEventDto.EventName.ToLower());

            if (duplidateEvent != null) throw new Exception("Event with name '" + addEventDto.EventName + "' is already present. Please different name!");

            var newEvent = new Event();
            this._mapper.Map<EventDto, Event>(addEventDto, newEvent);

            var entity = await this._dataContext.Events.AddAsync(newEvent);
            if (await this.SaveAllAsync())
            {
                var newEntity = new EventDto();
                this._mapper.Map<Event, EventDto>(entity.Entity, newEntity);

                return newEntity;
            }
            return null;
        }

        public async Task<EventDto> GetEventAsync(int id)
        {
            var eventFound = await this._dataContext.Events
                .Include(pe => pe.Photos)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (eventFound != null)
            {
                return this._mapper.Map<Event, EventDto>(eventFound);
            }
            return null;
        }

        public async Task<IEnumerable<EventDto>> GetEventsAsync()
        {
            var events = await this._dataContext.Events
                .Include(pe => pe.Photos)
                .ToListAsync();
            // var eventsDto = new List<EventDto>();
            //this._mapper.Map<IEnumerable<Event>, IEnumerable<EventDto>>(events, eventsDto);

            return this._mapper.Map<IEnumerable<Event>, IEnumerable<EventDto>>(events);
        }
        public async Task<EventDto> GetMainEventAsync()
        {
            var mainEvent = await this._dataContext.Events
                .Include(pe => pe.Photos)
                .Where(e => (e.EventName == "Main"))
                .FirstOrDefaultAsync();

            return this._mapper.Map<Event, EventDto>(mainEvent);
        }
        public async Task<EventDto> AddPhotoEventAsync(int EventId, IFormFile file)
        {
            var eventFound = await this._dataContext.Events
                            .Include(pe => pe.Photos)
                            .FirstOrDefaultAsync(e => e.Id == EventId);
            if (eventFound == null) throw new Exception("Event id not found!");

            if (eventFound.Photos.Count > MaxPhotoEvent) throw new Exception("Cannot add more than " + MaxPhotoEvent.ToString() + " photos!");

            if (file == null) throw new Exception("File not specified!");

            var result = await this._photoService.AddPhotoAsync(file);
            if (result.Error != null) throw new Exception(result.Error.Message);

            var photoEvent = new PhotoEvent
            {
                EventId = EventId,
                Url = result.SecureUrl.AbsoluteUri,
                IsMain = false,
                PublicId = result.PublicId,
                Title = "",
                Description = "",
                UploadDateTime = DateTime.UtcNow,
            };

            if (eventFound.Photos.Count == 0) photoEvent.IsMain = true;
            if (photoEvent.IsMain) eventFound.EventMainPhotoUrl = photoEvent.Url;

            eventFound.Photos.Add(photoEvent);

            if (await this.SaveAllAsync())
            {
                return this._mapper.Map<Event, EventDto>(eventFound);
            };

            throw new Exception("Problem adding photo event!");
        }

        public async Task<EventDto> EditPhotoEventAsync(PhotoEventDto photoEventDto)
        {
            var eventFound = await this._dataContext.Events
                .Include(pe => pe.Photos)
                .FirstOrDefaultAsync(e => e.Id == photoEventDto.EventId);

            if (eventFound == null) throw new Exception("Event id not found!");

            var photoEventFound = eventFound.Photos.Find(pe => pe.Id == photoEventDto.Id);
            if (photoEventFound == null) throw new Exception("Photo event id not found!");

            //if set main photo then reset others to not main
            if (photoEventDto.IsMain)
            {
                foreach (var photoEvent in eventFound.Photos)
                {
                    photoEvent.IsMain = false;
                }
                eventFound.EventMainPhotoUrl = photoEventDto.Url;
            }
            photoEventFound.IsMain = photoEventDto.IsMain;
            photoEventFound.Title = photoEventDto.Title;
            photoEventFound.Description = photoEventDto.Description;

            return this._mapper.Map<Event, EventDto>(eventFound);
        }

        public async Task<EventDto> DeletePhotoEventAsync(PhotoEventDto photoEventDto)
        {
            var eventFound = await this._dataContext.Events
                .Include(pe => pe.Photos)
                .FirstOrDefaultAsync(e => e.Id == photoEventDto.EventId);

            if (eventFound == null) throw new Exception("Event id not found!");

            var photoEventFound = eventFound.Photos.Find(pe => pe.Id == photoEventDto.Id);
            if (photoEventFound == null) throw new Exception("Photo event id not found!");

            // delete photo from Cloudinary
            if (photoEventFound.PublicId != null)
            {
                var result = await this._photoService.DeletePhotoAsync(photoEventFound.PublicId);
                if (result.Error != null) throw new Exception(result.Error.Message);
            }

            //set other photo as main if the current one is isMain
            if (photoEventFound.IsMain && eventFound.Photos.Count > 1)
            {
                var photoEventNewMain = eventFound.Photos.Find(pe => pe.Id != photoEventDto.Id);
                if (photoEventNewMain != null)
                {
                    photoEventNewMain.IsMain = true;
                    eventFound.EventMainPhotoUrl = photoEventNewMain.Url;
                }
            }

            eventFound.Photos.Remove(photoEventFound);

            return this._mapper.Map<Event, EventDto>(eventFound);
        }

        public async Task<EventDto> DeleteAllPhotoEventsAsync(int eventId)
        {
            var eventFound = await this._dataContext.Events
                .Include(pe => pe.Photos)
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventFound == null) throw new Exception("Event id not found!");
            var deleteEventDto = this._mapper.Map<Event, EventDto>(eventFound);

            foreach (var photoEventDto in deleteEventDto.Photos)
            {
                // delete photo from Cloudinary
                if (photoEventDto.PublicId != null)
                {
                    var result = await this._photoService.DeletePhotoAsync(photoEventDto.PublicId);
                    if (result.Error != null) throw new Exception(result.Error.Message);
                }
                var deletePhotoEvent = eventFound.Photos.Find(pe => pe.Id == photoEventDto.Id);
                eventFound.Photos.Remove(deletePhotoEvent);
            }
            eventFound.EventMainPhotoUrl = null;
            //update changes back to deleteEventDto
            deleteEventDto = this._mapper.Map<Event, EventDto>(eventFound);

            return deleteEventDto;
        }

        public async Task<bool> DeleteEvent(int eventId)
        {
            var eventFound = await this._dataContext.Events.FindAsync(eventId);

            if (eventFound == null) throw new Exception("Event id not found!");
            if (eventFound.EventName == "Main") throw new Exception("Main event cannot be deleted!");

            await this.DeleteAllPhotoEventsAsync(eventId);
            this._dataContext.Events.Remove(eventFound);

            return true;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await this._dataContext.SaveChangesAsync() > 0;
        }
    }
}