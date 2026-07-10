namespace DogWalkerApi.Models
{
    public class Logs
    {
        public int Id { get; set; }
        public int BookId { get; set; }
     
        public string Day { get; set; } = string.Empty;
        public string ActivityType { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
         public DateTime CreatedAt { get; set; }
    }
}