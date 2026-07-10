namespace DogWalkerApi.DTOs{
public class AllOwners
{
    public int OwnerId {get;set;}
     public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
      
        public string Username { get; set; } = string.Empty;
         public string Email { get; set; } = string.Empty;
      
        public string Phone { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;
        public bool MeetingDone { get; set; } = false;
        public bool IsApproved { get; set; } = false;
        public bool IsAdmin { get; set; } = false;
        public int TotalBookings { get; set; }
public decimal TotalSpent { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
      
    public List<OwnerDogDto> Dogs { get; set; } = new();
    public List<OwnerRewDto> Review { get; set; } = new();
}

public class OwnerDogDto
{
     public int DogId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Size { get; set; } = string.Empty;
    public string Sex { get; set; } = string.Empty;
    public bool Neutered { get; set; }
    public string? PhotoUrl { get; set; }
}

public class OwnerRewDto
    {
         public int Rating { get; set; }
    public string? Comment { get; set; }
    }
}