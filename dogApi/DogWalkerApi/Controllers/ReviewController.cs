using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using DogWalkerApi.Data;
using DogWalkerApi.Models;
using DogWalkerApi.DTOs;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddReview(CreateReviewDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var review = new Review
        {
            BookingId = dto.BookingId,
            UserId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(review);
    }

    [HttpGet("myreview")]
    public async Task<IActionResult> Myrev()
    {
         var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var review = await _context.Reviews
    .Where(r => r.UserId == userId)
    .Include(r => r.Booking)
    .Select(r => new
    {
        r.Id,
        r.Rating,
        r.Comment,
        r.CreatedAt,
        serviceType = r.Booking.ServiceType,
        bookingDate = r.Booking.StartDate ?? r.Booking.WalkDate ?? r.Booking.DaycareDate,
        userName = r.Booking.User.Username
    })
    .ToListAsync();

return Ok(review);
    }
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var reviews = await _context.Reviews.Select(r => new ReviewResponse
{
            ReviewId = r.Id,
            CreatedAt = r.CreatedAt,
            Rating = r.Rating,
            Comment = r.Comment,
            UserFirstName = r.User.FirstName,
            UserLastName = r.User.LastName,
            ServiceType = r.Booking.ServiceType,
            WalkDate = r.Booking.WalkDate,
            StartDate = r.Booking.StartDate,
            EndDate = r.Booking.EndDate,
            DogName = r.Booking.Dog.Name,
            DaycareDate = r.Booking.DaycareDate
}).ToListAsync();
        if(reviews == null)
        {
            return NotFound();
        }
        return Ok(reviews);
    }
}