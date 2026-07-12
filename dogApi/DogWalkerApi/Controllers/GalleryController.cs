using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DogWalkerApi.Data;
using DogWalkerApi.Models;
using DogWalkerApi.DTOs;
using DogWalkerApi.Services;
using Microsoft.AspNetCore.Authorization;
namespace DogWalkerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
   private readonly AppDbContext _context;
private readonly ISupabaseStorageService _storage;

public GalleryController(AppDbContext context, ISupabaseStorageService storage)
{
    _context = context;
    _storage = storage;
}

    [HttpPost("{bookingId}/upload")]
    [Authorize]
    public async Task<IActionResult> UploadPhoto(int bookingId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
        if (booking == null) return NotFound();

       var photoUrl = await _storage.UploadAsync(file, "gallery");

var photo = new Gallery
{
    BookingId = bookingId,
    PhotoUrl = photoUrl
};

        _context.Gallery.Add(photo);
        await _context.SaveChangesAsync();

        return Ok(new { photoUrl = photo.PhotoUrl });
    }

    [HttpGet("{bookingId}")]
    [Authorize]
    public async Task<IActionResult> GetPhotos(int bookingId)
    {
        var photos = await _context.Gallery
            .Where(p => p.BookingId == bookingId)
            .Select(p => new
            {
                p.Id,
                p.PhotoUrl,
                p.UploadedAt
            })
            .ToListAsync();

        return Ok(photos);
    }

    [HttpDelete("{photoId}")]
    [Authorize]
    public async Task<IActionResult> DeletePhoto(int photoId)
    {
        var photo = await _context.Gallery.FirstOrDefaultAsync(p => p.Id == photoId);
        if (photo == null) return NotFound();

        _context.Gallery.Remove(photo);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}