using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DogWalkerApi.Data;
using DogWalkerApi.Models;
using DogWalkerApi.DTOs;
using Microsoft.AspNetCore.Authorization;
namespace DogWalkerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
    private readonly AppDbContext _context;

    public GalleryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("{bookingId}/upload")]
    [Authorize]
    public async Task<IActionResult> UploadPhoto(int bookingId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
        if (booking == null) return NotFound();

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var folder = Path.Combine("wwwroot", "uploads", "gallery");
        Directory.CreateDirectory(folder);
        var savePath = Path.Combine(folder, fileName);

        using (var stream = new FileStream(savePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var photo = new Gallery
        {
            BookingId = bookingId,
            PhotoUrl = $"/uploads/gallery/{fileName}"
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