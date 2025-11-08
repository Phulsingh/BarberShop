
using Microsoft.AspNetCore.Http;

namespace NewProject.Server.DTO
{
    public class BarbarServiceDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
        public string Category { get; set; } = string.Empty;
        public int Offer { get; set; } = 0;
        public string Description { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;
    }
}
