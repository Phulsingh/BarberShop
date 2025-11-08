using Microsoft.EntityFrameworkCore;
using NewProject.Server.Models;

namespace NewProject.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<BarbarServices> BarbarServices => Set<BarbarServices>();
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Offer> Offers { get; set; }

        // 👇 Correct name matches model
        public DbSet<CustomerReview> CustomerReviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CustomerReview>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
