namespace NewProject.Server.DTO
{
    public class UserProfileUpdateDTO
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? MobileNumber { get; set; }

        public int? Age { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string? Bio { get; set; }

        public string? Location { get; set; }

        public string? State { get; set; }

        public string? PinCode { get; set; }

        public string? Gender { get; set; }

        public string? Avatar { get; set; }

        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
