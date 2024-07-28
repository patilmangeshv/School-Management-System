using API.DTOs;

namespace API.Interfaces
{
    public interface IEventRepository
    {
        Task<EventDto> AddEventAsync(EventDto addEventDto);
        Task<EventDto> GetEventAsync(int id);
        Task<IEnumerable<EventDto>> GetEventsAsync();
        Task<EventDto> GetMainEventAsync();
        Task<EventDto> AddPhotoEventAsync(int EventId, IFormFile file);
        Task<EventDto> EditPhotoEventAsync(PhotoEventDto photoEventDto);
        Task<EventDto> DeletePhotoEventAsync(PhotoEventDto photoEventDto);
        Task<EventDto> DeleteAllPhotoEventsAsync(int eventId);
        Task<bool> DeleteEvent(int eventId);
        Task<bool> SaveAllAsync();
    }
}