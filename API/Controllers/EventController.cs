using Microsoft.AspNetCore.Mvc;
using API.Interfaces;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class EventController : BaseApiController
    {
        private IEventRepository _eventRepository;

        public EventController(IEventRepository eventRepository)
        {
            this._eventRepository = eventRepository;
        }

        [Authorize(Policy = "RequiredSuperAdminRole")]
        [HttpPost("add-event")]
        public async Task<ActionResult<EventDto>> AddEventAsync(EventDto addEventDto)
        {
            var newEventDto = await this._eventRepository.AddEventAsync(addEventDto);

            if (newEventDto == null)
                return BadRequest("Some exception has occured!");
            else
                // return CreatedAtAction(nameof(GetEventAsync), new { id = newEventDto.Id }, newEventDto);
                return Ok(newEventDto);
        }

        [Authorize(Policy = "RequiredModeratorRole")]
        [HttpGet("event/{id}")]
        public async Task<ActionResult<EventDto>> GetEventAsync(int id)
        {
            var eventDto = await this._eventRepository.GetEventAsync(id);

            if (eventDto == null) return NotFound("Event does not exists!");
            return Ok(eventDto);
        }

        [Authorize(Policy = "RequiredModeratorRole")]
        [HttpGet("events")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEventsAsync()
        {
            return Ok(await this._eventRepository.GetEventsAsync());
        }

        [AllowAnonymous]
        [HttpGet("main-event")]
        public async Task<ActionResult<EventDto>> GetMainEventAsync()
        {
            return Ok(await this._eventRepository.GetMainEventAsync());
        }

        [Authorize(Policy = "RequiredSuperAdminRole")]
        [HttpDelete("delete-event")]
        public async Task<ActionResult<bool>> DeleteEventAsync(int eventId)
        {
            try
            {
                if (await this._eventRepository.DeleteEvent(eventId))
                {
                    if (await this._eventRepository.SaveAllAsync()) return Ok(true);
                }
                return BadRequest("Some exception has occured while deleting event!");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "RequiredModeratorRole")]
        [HttpPost("add-photo-event")]
        public async Task<ActionResult<PhotoEventDto>> AddPhotoEventAsync([FromQuery] int EventId, IFormFile file)
        {
            try
            {
                var photoEventDto = await this._eventRepository.AddPhotoEventAsync(EventId, file);

                return Ok(photoEventDto);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "RequiredModeratorRole")]
        [HttpPut("edit-photo-event")]
        public async Task<ActionResult<PhotoEventDto>> EditPhotoEventAsync(PhotoEventDto photoEventDto)
        {
            try
            {
                var editPhotoEventDto = await this._eventRepository.EditPhotoEventAsync(photoEventDto);

                if (editPhotoEventDto != null)
                {
                    if (await this._eventRepository.SaveAllAsync()) return Ok(editPhotoEventDto);
                }

                return BadRequest("Some exception has occured while saving the event!");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "RequiredModeratorRole")]
        [HttpDelete("delete-photo-event")]
        public async Task<ActionResult<EventDto>> DeletePhotoEventAsync(PhotoEventDto photoEventDto)
        {
            try
            {
                var eventDto = await this._eventRepository.DeletePhotoEventAsync(photoEventDto);
                if (eventDto != null)
                {
                    if (await this._eventRepository.SaveAllAsync()) return Ok(eventDto);
                }

                return BadRequest("Some exception has occured while deleting the photo event!");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "RequiredModeratorRole")]
        [HttpDelete("delete-all-photo-event")]
        public async Task<ActionResult<EventDto>> DeleteAllPhotoEventsAsync(int eventId)
        {
            try
            {
                var editEventDto = await this._eventRepository.DeleteAllPhotoEventsAsync(eventId);
                if (editEventDto != null)
                {
                    await this._eventRepository.SaveAllAsync();
                    return Ok(editEventDto);
                }
                return BadRequest("Some exception has occured while deleting the photo events!");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}