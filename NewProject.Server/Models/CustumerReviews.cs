using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewProject.Server.Models
{
    public class CustomerReview
    {
        public int Id { get; set; }

        [Required]
        public DateTime createdAt { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(500)]
        public string Reviews{ get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        public string? Image { get; set; }
        public string? Comment { get; set; }
        public string? Advice { get; set; }

        // 🔗 Foreign Key
        [ForeignKey("User")]
        public int UserId { get; set; }

        // 🌐 Navigation Property
        public User User { get; set; } = null!;
    }
}
