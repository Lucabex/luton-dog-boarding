namespace DogWalkerApi.Models
{
    public class Dog
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Breed { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Size { get; set; } = string.Empty;
        public string Sex { get; set; } = string.Empty;
        public bool Neutered { get; set; }
        public bool Vaccinated { get; set; }
        public string Allergies { get; set; } = string.Empty;
        public string BehaviourNotes { get; set; } = string.Empty;
        public string PhotoUrl { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;

        public User Owner { get; set; } = null!;
    }
}