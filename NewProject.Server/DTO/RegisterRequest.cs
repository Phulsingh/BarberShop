using System.ComponentModel.DataAnnotations;

namespace NewProject.Server.DTO
{
    public class RegisterRequest
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Phone] 
        public string? ContactNumber { get; set; }


        public string? Avatar { get; set; }


        [Required]
        [RegularExpression("Admin|User", ErrorMessage = "Role must be either Admin or User")]
        public string Role { get; set; } = "User";  // default is "User"
    }
}
