using System.ComponentModel.DataAnnotations;

namespace NewProject.Server.DTO
{
    public class UserProfileUpdateRequest
    {
        [Required]
        public string FullName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;

        [MinLength(6)]
        public string? Password { get; set; }

        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string? ConfirmPassword { get; set; }

        [Range(1, 120)]
        public int? Age { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        [Phone]
        public string? MobileNumber { get; set; }

        [MaxLength(250)]
        public string? Bio { get; set; }

        public string? Location { get; set; }

        public string? State { get; set; }

        public string? PinCode { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [RegularExpression("Male|Female|Other", ErrorMessage = "Gender must be Male, Female or Other")]
        public string? Gender { get; set; }

        public IFormFile? Avatar { get; set; }
    }
}
