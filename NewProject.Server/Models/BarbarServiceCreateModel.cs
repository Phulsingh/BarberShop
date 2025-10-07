
using Microsoft.AspNetCore.Http;

namespace NewProject.Server.Models
{
    public class BarbarServiceCreateModel
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
        public string Category { get; set; } = string.Empty;
        public int Offer { get; set; } = 0;
        public string Description { get; set; } = string.Empty;
        // file from form-data
        public IFormFile? Image { get; set; }
    }
}
