namespace DogWalkerApi.Models
{
    public class User
    {
        public int Id { get; set; }
  
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
      
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;
        public bool MeetingDone { get; set; } = false;
        public bool IsApproved { get; set; } = false;
        public bool IsAdmin { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ResetCodeHash { get; set; }
         public string? PhotoUrl { get; set; } = string.Empty;
public DateTime? ResetCodeExpiry { get; set; }

        public ICollection<Dog> Dogs { get; set; } = new List<Dog>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
      
    }
}