using System.ComponentModel.DataAnnotations;

namespace NewProject.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? ContactNumber { get; set; }
        public string? Avatar { get; set; }
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
        public int? Age { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }
        public string? Bio { get; set; }
        public string? Location { get; set; }
        public string? State { get; set; }
        public string? PinCode { get; set; }
        public string? Gender { get; set; }

        // 👇 Add this line
        public ICollection<CustomerReview>? Reviews { get; set; }
    }
}