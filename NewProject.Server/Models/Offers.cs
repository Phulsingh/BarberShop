namespace NewProject.Server.Models
{
    public enum OfferType
    {
        DayOffer,
        FestivalOffer
    }

    public class Offer
    {
        public int Id { get; set; }
        public OfferType Type { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Discount { get; set; }
        public string ValidTillText { get; set; }
        public DateTime ValidTillDate { get; set; }
        public int NumberOfUses { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? FestivalName { get; set; }
        public string? DayName { get; set; }
    }
}
