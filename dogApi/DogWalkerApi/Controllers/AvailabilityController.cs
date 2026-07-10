using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DogWalkerApi.Data;
using DogWalkerApi.DTOs;

[ApiController]
[Route("api/[controller]")]
public class AvailabilityController : ControllerBase
{
    private readonly AppDbContext _context;

    public AvailabilityController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/availability/month?year=2026&month=6
    [HttpGet("month")]
    public async Task<IActionResult> GetMonthAvailability(int year, int month)
    {
        //estabilish a range
        var firstDay = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var lastDay = firstDay.AddMonths(1);

        // fetch all bookings in this month that are not rejected/cancelled
        var bookings = await _context.Bookings
            .Where(b =>
                b.Status != "rejected" &&
                b.Status != "cancelled" &&
                (
                    (b.WalkDate >= firstDay && b.WalkDate < lastDay) ||
                    (b.DaycareDate >= firstDay && b.DaycareDate < lastDay) ||
                    (b.StartDate < lastDay && b.EndDate >= firstDay)
                ))
            .ToListAsync();

        var result = new List<object>();

        for (var date = firstDay; date < lastDay; date = date.AddDays(1))
        {
            var slotsBooked = new HashSet<string>();

            foreach (var b in bookings)
            {
                // walk slots
                if (b.WalkDate.HasValue && b.WalkDate.Value.Date == date.Date)
                    slotsBooked.Add($"walk_{b.WalkSlot}");

                // daycare
                if (b.DaycareDate.HasValue && b.DaycareDate.Value.Date == date.Date)
                    slotsBooked.Add("daycare");

                // boarding - covers the whole range
                if (b.StartDate.HasValue && b.EndDate.HasValue &&
                    date >= b.StartDate.Value.Date && date < b.EndDate.Value.Date)
                    slotsBooked.Add("boarding");
            }

            var totalSlots = 5; // walk_1, walk_2, walk_3, boarding, daycare
            string status;

            if (slotsBooked.Count == 0)
                status = "green";
            else if (slotsBooked.Count == totalSlots)
                status = "red";
            else
                status = "yellow";

            result.Add(new
            {
                date = date.ToString("yyyy-MM-dd"),
                status,
                slots = new
                {
                    walk1 = slotsBooked.Contains("walk_1") ? "booked" : "available",
                    walk2 = slotsBooked.Contains("walk_2") ? "booked" : "available",
                    walk3 = slotsBooked.Contains("walk_3") ? "booked" : "available",
                    boarding = slotsBooked.Contains("boarding") ? "booked" : "available",
                    daycare = slotsBooked.Contains("daycare") ? "booked" : "available"
                }
            });
        }

        return Ok(result);
    }

    // POST /api/availability/boarding
    [HttpPost("boarding")]
    public async Task<IActionResult> CheckBoardingAvailability(BoardingAvailabilityDto dto)
    {
        var startDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);
        var endDate = DateTime.SpecifyKind(dto.EndDate, DateTimeKind.Utc);

        var conflicts = await _context.Bookings
            .Where(b =>
                b.Status != "rejected" &&
                b.Status != "cancelled" &&
                b.StartDate < endDate &&
                b.EndDate > startDate)
            .ToListAsync();

        if (!conflicts.Any())
            return Ok(new { available = true, conflictingDates = new List<string>() });

        // find the exact overlapping days
        var conflictingDates = new List<string>();

        for (var date = startDate; date < endDate; date = date.AddDays(1))
        {
            bool isConflict = conflicts.Any(b =>
                b.StartDate.HasValue && b.EndDate.HasValue &&
                date >= b.StartDate.Value && date < b.EndDate.Value);

            if (isConflict)
                conflictingDates.Add(date.ToString("yyyy-MM-dd"));
        }

        return Ok(new
        {
            available = false,
            conflictingDates
        });
    }
}