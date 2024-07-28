namespace API.DTOs
{
    public class EventDto
    {
        public int Id { get; set; }
        public string EventName { get; set; }
        public string EventMainPhotoUrl { get; set; }
        public List<PhotoEventDto> Photos { get; set; }
    }
}