namespace API.Entities
{
    public class PhotoEvent
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime UploadDateTime { get; set; } = DateTime.UtcNow;
        // fully defined relationship for NOT NULL foreign key
        public int EventId { get; set; }
        public Event Event { get; set; }
    }
}