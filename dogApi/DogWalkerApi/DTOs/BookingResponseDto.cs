public class BookingResponseDto
{
    public int Id { get; set; }
    public string? ServiceType { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; }

    // walk
    public DateTime? WalkDate { get; set; }
    public int? WalkSlot { get; set; }

    // boarding
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? NumberOfNights { get; set; }

    // daycare
    public DateTime? DaycareDate { get; set; }

    // dog
    public string? DogName { get; set; }

    // owner
    public string? OwnerFirstName { get; set; }
    public string? OwnerLastName { get; set; }
    public string? OwnerEmail { get; set; }
    public string? OwnerPhone { get; set; }
    public string? OwnerAddress { get; set; }
    public string? OwnerUserName { get; set; }

    // payment
    public bool IsPaid { get; set; }
    public decimal? AmountPaid { get; set; }

    // review
    public bool HasReview { get; set; }
}