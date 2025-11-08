using System.ComponentModel.DataAnnotations;

namespace NewProject.Server.DTO
{
    public class ReviewUpdateDTO
    {
        [Required, MaxLength(500)]
        public string Review { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        public string? Image { get; set; }
        public string? Comment { get; set; }
        public string? Advice { get; set; }
    }

}
