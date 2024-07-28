using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }
        public DateTime UploadDateTime { get; set; }

        // fully defined relationship for NOT NULL foreign key
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}