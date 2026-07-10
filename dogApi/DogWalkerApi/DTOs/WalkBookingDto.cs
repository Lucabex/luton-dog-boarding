namespace DogWalkerApi.DTOs
{
    public class WalkBookingDto
{
    public int DogId { get; set; }
    public DateTime WalkDate { get; set; }
    public int WalkSlot { get; set; } // 1=morning, 2=afternoon, 3=evening
}
}