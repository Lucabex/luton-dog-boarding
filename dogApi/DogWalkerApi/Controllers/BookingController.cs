using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using DogWalkerApi.Data;
using DogWalkerApi.Models;
using DogWalkerApi.DTOs;
using Resend;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IResend _resend;

    public BookingController(AppDbContext context, IResend resend)
    {
        _context = context;
        _resend = resend;
    }

    private async Task SendConfirmationEmail(string toEmail, string firstName, string serviceType, string dateInfo, int bookingId, decimal price)
    {
        var customerEmail = new EmailMessage();
        customerEmail.From = "bookings@lutondogboarding.co.uk";
        customerEmail.To.Add(toEmail);
        customerEmail.Subject = "Booking Received — Luton Dog Boarding";
        customerEmail.HtmlBody = $@"
            <h2>Hi {firstName},</h2>
            <p>Your <strong>{serviceType}</strong> booking has been received.</p>
            <p><strong>Date:</strong> {dateInfo}</p>
            <p><strong>Price:</strong> £{price}</p>
            <p>If you prefer the card payment, please transfer the amount to:</p>
            <p>
                <strong>Account name:</strong> Luca Bercioux<br/>
                <strong>Sort code:</strong> 20-74-63<br/>
                <strong>Account number:</strong> 53186814
            </p>
            <p>Important : Use your dog name as reference</p>
            <p>Payment must be completed before the booking start date.</p>
            <br/>
            <p>Thanks,<br/>Luton Dog Boarding</p>
        ";
        await _resend.EmailSendAsync(customerEmail);

        var notificationEmail = new EmailMessage();
        notificationEmail.From = "bookings@lutondogboarding.co.uk";
        notificationEmail.To.Add("lucabex@gmail.com");
        notificationEmail.Subject = $"New Booking — {serviceType} #{bookingId}";
        notificationEmail.HtmlBody = $@"
            <h2>New booking received</h2>
            <p><strong>Booking ID:</strong> #{bookingId}</p>
            <p><strong>Customer:</strong> {firstName}</p>
            <p><strong>Email:</strong> {toEmail}</p>
            <p><strong>Service:</strong> {serviceType}</p>
            <p><strong>Date:</strong> {dateInfo}</p>
            <p><strong>Price:</strong> £{price}</p>
        ";
        await _resend.EmailSendAsync(notificationEmail);
    }

    [HttpPost("walk")]
public async Task<IActionResult> BookWalk(WalkBookingDto dto)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
    var walkDate = DateTime.SpecifyKind(dto.WalkDate, DateTimeKind.Utc);

    var conflict = await _context.Bookings.AnyAsync(b =>
        b.WalkDate == walkDate &&
        b.WalkSlot == dto.WalkSlot &&
        b.Status != "rejected" &&
        b.Status != "cancelled");

    if (conflict)
        return BadRequest("That slot is already booked");

    var booking = new Booking
    {
        UserId = userId,
        DogId = dto.DogId,
        ServiceType = "walk",
        WalkDate = walkDate,
        WalkSlot = dto.WalkSlot,
        Status = "pending"
    };

    _context.Bookings.Add(booking);
    await _context.SaveChangesAsync();

    try
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user != null)
            await SendConfirmationEmail(user.Email, user.FirstName, "walk", $"{walkDate:dd/MM/yyyy}", booking.Id, 15);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Email failed: {ex.Message}");
    }

    return Ok(new BookingResponseDto
    {
        Id = booking.Id,
        ServiceType = booking.ServiceType,
        Status = booking.Status,
        CreatedAt = booking.CreatedAt,
        WalkDate = booking.WalkDate,
        WalkSlot = booking.WalkSlot
    });
}

    [HttpPost("boarding")]
    public async Task<IActionResult> BookBoarding(BoardingBookingDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var startDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);
        var endDate = DateTime.SpecifyKind(dto.EndDate, DateTimeKind.Utc);

        var overlapping = await _context.Bookings.CountAsync(b =>
    b.ServiceType == "boarding" &&
    b.Status != "rejected" &&
    b.Status != "Canceled" &&
    b.StartDate < endDate &&
    b.EndDate > startDate);

if (overlapping >= 2)
    return BadRequest("Both boarding spots are taken for the selected period");

        var booking = new Booking
        {
            UserId = userId,
            DogId = dto.DogId,
            ServiceType = "boarding",
            StartDate = startDate,
            EndDate = endDate,
            NumberOfNights = dto.NumberOfNights,
            Status = "pending"
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                var nights = (int)(endDate - startDate).TotalDays;
                await SendConfirmationEmail(user.Email, user.FirstName, "boarding", $"{startDate:dd/MM/yyyy} → {endDate:dd/MM/yyyy}", booking.Id, nights * 40);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email failed: {ex.Message}");
        }

        return Ok(new BookingResponseDto
        {
            Id = booking.Id,
            ServiceType = booking.ServiceType,
            Status = booking.Status,
            CreatedAt = booking.CreatedAt,
            StartDate = booking.StartDate,
            EndDate = booking.EndDate,
            NumberOfNights = booking.NumberOfNights
        });
    }

    [HttpPost("daycare")]
public async Task<IActionResult> BookDaycare(DaycareBookingDto dto)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
    var dayCareDay = DateTime.SpecifyKind(dto.DaycareDate, DateTimeKind.Utc);

    var conflict = await _context.Bookings.AnyAsync(b =>
        b.DaycareDate == dayCareDay &&
        b.Status != "rejected" &&
        b.Status != "cancelled");

    if (conflict)
        return BadRequest("The date selected is not available");

    var booking = new Booking
    {
        UserId = userId,
        DogId = dto.DogId,
        ServiceType = "daycare",
        DaycareDate = dayCareDay,
        Status = "pending"
    };

    _context.Bookings.Add(booking);
    await _context.SaveChangesAsync();

    try
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user != null)
            await SendConfirmationEmail(user.Email, user.FirstName, "daycare", $"{dayCareDay:dd/MM/yyyy}", booking.Id, 35);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Email failed: {ex.Message}");
    }

    return Ok(new BookingResponseDto
    {
        Id = booking.Id,
        ServiceType = booking.ServiceType,
        Status = booking.Status,
        CreatedAt = booking.CreatedAt,
        DaycareDate = booking.DaycareDate
    });
}
    [HttpGet("mine")]
    public async Task<IActionResult> MyActiveService()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var now = DateTime.UtcNow;
        var today = now.Date;

        var booking = await _context.Bookings
            .Where(b => b.UserId == userId &&
                b.Status != "rejected" && b.Status != "cancelled" &&
                (
                    (b.ServiceType == "boarding" && b.StartDate <= now && b.EndDate.Value.Date.AddDays(1) >= today) ||
                    (b.ServiceType == "walk" && b.WalkDate.Value.Date == today) ||
                    (b.ServiceType == "daycare" && b.DaycareDate.Value.Date == today)
                ))
            .ToListAsync();

        return Ok(booking);
    }

    [HttpGet("next")]
    public async Task<IActionResult> MyNext()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var now = DateTime.UtcNow;
        var today = now.Date;

        var booking = await _context.Bookings
            .Where(b => b.UserId == userId &&
                b.Status != "rejected" && b.Status != "cancelled" &&
                (
                    (b.ServiceType == "boarding" && b.StartDate > today) ||
                    (b.ServiceType == "walk" && b.WalkDate.Value.Date > today) ||
                    (b.ServiceType == "daycare" && b.DaycareDate.Value.Date > today)
                ))
            .OrderBy(b => b.WalkDate ?? b.StartDate ?? b.DaycareDate)
            .ToListAsync();

        return Ok(booking);
    }

    [HttpGet("past")]
    public async Task<IActionResult> PastBooking()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var now = DateTime.UtcNow;
        var today = now.Date;

        var booking = await _context.Bookings
            .Where(b => b.UserId == userId &&
                b.Status != "rejected" && b.Status != "cancelled" &&
                (
                    (b.ServiceType == "boarding" && b.EndDate < today) ||
                    (b.ServiceType == "walk" && b.WalkDate.Value.Date < today) ||
                    (b.ServiceType == "daycare" && b.DaycareDate.Value.Date < today)
                ))
            .OrderBy(b => b.WalkDate ?? b.StartDate ?? b.DaycareDate)
            .Select(b => new
            {
                b.Id,
                b.ServiceType,
                b.WalkDate,
                b.WalkSlot,
                b.StartDate,
                b.EndDate,
                b.DaycareDate,
                b.NumberOfNights,
                b.AmountPaid,
                dogName = b.Dog.Name,
                hasReview = b.Review != null,
                rating = b.Review != null ? b.Review.Rating : (int?)null
            })
            .ToListAsync();

        return Ok(booking);
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var bookings = await _context.Bookings.Select(b => new BookingResponseDto
        {
            Id = b.Id,
            ServiceType = b.ServiceType,
            Status = b.Status,
            CreatedAt = b.CreatedAt,
            WalkDate = b.WalkDate,
            WalkSlot = b.WalkSlot,
            StartDate = b.StartDate,
            EndDate = b.EndDate,
            NumberOfNights = b.NumberOfNights,
            DaycareDate = b.DaycareDate,
            DogName = b.Dog.Name,
            OwnerFirstName = b.User.FirstName,
            OwnerLastName = b.User.LastName,
            OwnerEmail = b.User.Email,
            OwnerPhone = b.User.Phone,
            OwnerAddress = b.User.StreetAddress,
            OwnerUserName = b.User.Username,
            IsPaid = b.IsPaid,
            AmountPaid = b.AmountPaid,
            HasReview = b.Review != null
        }).ToListAsync();

        if (bookings == null) return NotFound();

        return Ok(bookings);
    }

    [HttpPatch("{id}/pay")]
    public async Task<IActionResult> MarkAsPaid(int id, [FromBody] PaymentDto dto)
    {
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        if (booking == null) return NotFound();

        booking.IsPaid = true;
        booking.AmountPaid = dto.Amount;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/unpay")]
    public async Task<IActionResult> MarkAsUnPaid(int id)
    {
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        if (booking == null) return NotFound();

        booking.IsPaid = false;
        booking.AmountPaid = 0;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        var book = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        if (book == null) return NotFound();

        book.Status = "Completed";
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/pend")]
    public async Task<IActionResult> PendIt(int id)
    {
        var book = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        if (book == null) return NotFound();

        book.Status = "Pending";
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}/deletebooking")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        if (booking == null) return NotFound();

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return Ok("Booking deleted");
    }

    [HttpPost("{bookId}/addlog")]
    public async Task<IActionResult> AddLog(int bookId, [FromBody] AddLogDto dto)
    {
        var log = new Logs
        {
            BookId = bookId,
            Day = dto.Day,
            ActivityType = dto.ActivityType,
            Time = dto.Time,
            Duration = dto.Duration,
            CreatedAt = DateTime.UtcNow
        };

        _context.Logs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(log);
    }

    [HttpGet("{bookId}/logs")]
    public async Task<IActionResult> GetLogs(int bookId)
    {
        var logs = await _context.Logs
            .Where(l => l.BookId == bookId)
            .OrderBy(l => l.Id)
            .ToListAsync();

        return Ok(logs);
    }
}