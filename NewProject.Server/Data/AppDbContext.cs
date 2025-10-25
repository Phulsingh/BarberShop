
using Microsoft.EntityFrameworkCore;
using NewProject.Server.Models;

namespace NewProject.Server.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<BarbarServices> BarbarServices => Set<BarbarServices>();
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Offer> Offers { get; set; }
    }
}


