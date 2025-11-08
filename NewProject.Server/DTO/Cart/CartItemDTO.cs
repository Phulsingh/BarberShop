namespace NewProject.Server.DTO
{
    public class CartItemDTO
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal ServicePrice { get; set; }
        public string ServiceImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}