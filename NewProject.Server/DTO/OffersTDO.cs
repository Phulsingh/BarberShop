namespace NewProject.Server.DTO
{
    public class OffersDTO
    {
        public int Id { get; set; }
        public string Type { get; set; } // "DayOffer" or "FestivalOffer"
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Discount { get; set; }
        public string ValidTillText { get; set; }
        public DateTime ValidTillDate { get; set; }
        public int NumberOfUses { get; set; }
        public string? FestivalName { get; set; }
        public string? DayName { get; set; }

        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
