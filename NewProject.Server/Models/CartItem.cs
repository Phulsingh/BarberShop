namespace NewProject.Server.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int ServiceId { get; set; }
        public BarbarServices Service { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}