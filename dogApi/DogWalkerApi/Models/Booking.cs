using DogWalkerApi.Models;

namespace DogWalkerApi.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public int DogId { get; set; }
        public Dog? Dog { get; set; }
        public decimal? AmountPaid { get; set; }
        public bool IsPaid { get; set; } = false;

        public string? ServiceType { get; set; } 
        public string? Status { get; set; } = "pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // walk-specific
        public DateTime? WalkDate { get; set; }
        public int? WalkSlot { get; set; }        // 1=morning, 2=afternoon, 3=evening

        // boarding-specific
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? NumberOfNights { get; set; }
        public Review? Review { get; set; }

        // daycare-specific
        public DateTime? DaycareDate { get; set; }
        public ICollection<Gallery> Photos { get; set; } = new List<Gallery>();
    }
}