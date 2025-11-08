using System.ComponentModel.DataAnnotations;

namespace NewProject.Server.DTO
{
    public class CreateReviewDTO
    {
        public int UserId { get; set; }

        // Do NOT send UserId from client if you have auth; take from JWT.
        [Required, MaxLength(500)]
        public string Reviews { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        public string? Image { get; set; }
        public string? Comment { get; set; }
        public string? Advice { get; set; }
    }
}
