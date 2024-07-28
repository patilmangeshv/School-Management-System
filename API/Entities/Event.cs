namespace API.Entities
{
    public class Event
    {
        public int Id { get; set; }
        public string EventName { get; set; }
        public string EventMainPhotoUrl { get; set; }
        public List<PhotoEvent> Photos { get; set; } = new();
    }
}