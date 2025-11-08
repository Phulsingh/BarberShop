namespace NewProject.Server.DTO
{
    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public string Review { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Image { get; set; }
        public string? Comment { get; set; }
        public string? Advice { get; set; }
        public DateTime CreatedAt { get; set; }

        // Flat user info for display
        public int UserId { get; set; }
        public string UserFullName { get; set; } = string.Empty;
        public string? UserAvatar { get; set; }
    }
}
