
using Microsoft.EntityFrameworkCore;
using NewProject.Server.Models;

namespace NewProject.Server.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();
    }
}


