namespace API.Entities
{
    public class ContactRequest
    {
        // public string ToEmail { get; set; }
        public int Id { get; set; }
        public string Subject { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string TelephoneNumber { get; set; }
        public string FromEmail { get; set; }
        public DateTime MessageSentDateTime { get; set; }
        public bool IsMessageRead { get; set; }
        public string Body { get; set; }
    }
}