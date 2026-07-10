using Microsoft.EntityFrameworkCore;
using DogWalkerApi.Models;

namespace DogWalkerApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Dog> Dogs { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Gallery> Gallery => Set<Gallery>();
        public DbSet<Logs> Logs { get; set; }
    }
}