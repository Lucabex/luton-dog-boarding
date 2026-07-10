namespace DogWalkerApi.DTOs
{
    public class RegisterDto
    {
        // user fields
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;

        // dog fields
        public string DogName { get; set; } = string.Empty;
        public string Breed { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Size { get; set; } = string.Empty;
        public string Sex { get; set; } = string.Empty;
        public bool Neutered { get; set; }
        public bool Vaccinated { get; set; }
        public string Allergies { get; set; } = string.Empty;
        public string BehaviourNotes { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
    }
}