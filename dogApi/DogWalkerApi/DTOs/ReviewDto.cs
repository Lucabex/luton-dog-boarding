namespace DogWalkerApi.DTOs
{
    public class ReviewDto
    {
         public int ReviewId {get; set;}
          public DateTime CreatedAt {get;set;}
    }

  public class ReviewResponse
{
    public int ReviewId { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public string UserFirstName { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public string? ServiceType { get; set; }
    public string? DogName { get; set; }

    // service-specific dates
    public DateTime? WalkDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? DaycareDate { get; set; }
}

    }
