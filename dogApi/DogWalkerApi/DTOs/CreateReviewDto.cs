namespace DogWalkerApi.DTOs
{
    public class CreateReviewDto
    {
        public int BookingId { get; set; }
        public int Rating { get; set; }        // 1–5
        public string? Comment { get; set; }
    }
}