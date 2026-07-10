using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using DogWalkerApi.Data;
using DogWalkerApi.Models;
using DogWalkerApi.DTOs;
using Microsoft.AspNetCore.Authorization.Infrastructure;

[ApiController]
[Route("api/[controller]")]
public class DogController : ControllerBase
{
    private readonly AppDbContext _context;

    public DogController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    //[Authorize]
    public async Task<IActionResult> GetAllDogs()
    {
        var dogs = await _context.Dogs
            .Include(d => d.Owner)
            .Select(d => new
            {
                d.Id,
                d.Name,
                d.Breed,
                d.Age,
                d.Size,
                d.Sex,
                d.Neutered,
                d.Vaccinated,
                d.Allergies,
                d.BehaviourNotes,
                d.PhotoUrl,
                d.EmergencyContactName,
                d.EmergencyContactPhone,
                owner = new
                {
                    d.Owner.Id,
                    d.Owner.FirstName,
                    d.Owner.LastName,
                    d.Owner.Email,
                    d.Owner.Phone,
                    d.Owner.StreetAddress,
                    d.Owner.City,
                    d.Owner.Postcode
                }
            })
            .ToListAsync();

        return Ok(dogs);
    }

    [HttpGet("mine")]
[Authorize]
public async Task<IActionResult> GetMyDogs()
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
    var dogs = await _context.Dogs
        .Where(d => d.OwnerId == userId)
        .Select(d => new
        {
            d.Id,
            d.Name,
            d.Breed,
            d.Age,
            d.Size,
            d.Sex,
            d.Neutered,
            d.Vaccinated,
            d.Allergies,
            d.BehaviourNotes,
            d.PhotoUrl,
            d.EmergencyContactName,
            d.EmergencyContactPhone
        })
        .ToListAsync();

    return Ok(dogs);
}

    [HttpPost]
    [Authorize]
public async Task<IActionResult> AddDog(AddDogDto dto)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

    var dog = new Dog
    {
        OwnerId = userId,
        Name = dto.Name,
        Breed = dto.Breed,
        Age = dto.Age,
        Size = dto.Size,
        Sex = dto.Sex,
        Neutered = dto.Neutered,
        Vaccinated = dto.Vaccinated,
        Allergies = dto.Allergies,
        BehaviourNotes = dto.BehaviourNotes,
        PhotoUrl = dto.PhotoUrl,
        EmergencyContactName = dto.EmergencyContactName,
        EmergencyContactPhone = dto.EmergencyContactPhone
    };

    _context.Dogs.Add(dog);
    await _context.SaveChangesAsync();

    return Ok(new { dogId = dog.Id });
}
[HttpPost("addpet")]
[Authorize]
public async Task<IActionResult> AddPet(AddDogDto dto)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
    var dog = new Dog
    {
        OwnerId = userId,
        Name = dto.Name,
        Breed = dto.Breed,
        Age = dto.Age,
        Size = dto.Size,
        Sex = dto.Sex,
        Neutered = dto.Neutered,
        Vaccinated = dto.Vaccinated,
        Allergies = dto.Allergies,
        BehaviourNotes = dto.BehaviourNotes,
        EmergencyContactName = dto.EmergencyContactName,
        EmergencyContactPhone = dto.EmergencyContactPhone
    };

    _context.Dogs.Add(dog);
    await _context.SaveChangesAsync();

    return Ok(new { dogId = dog.Id });
}

    [HttpPost("{dogId}/photo")]
[Authorize]
public async Task<IActionResult> UploadPhoto(int dogId, IFormFile file)
{
    if (file == null || file.Length == 0)
        return BadRequest("No file uploaded");

    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

    var dog = await _context.Dogs.FirstOrDefaultAsync(d => d.Id == dogId);
    if (dog == null) return NotFound();
    if (dog.OwnerId != userId) return Forbid();

    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var folder = Path.Combine("wwwroot", "uploads", "dogs");
    Directory.CreateDirectory(folder);
    var savePath = Path.Combine(folder, fileName);

    using (var stream = new FileStream(savePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }

    dog.PhotoUrl = $"/uploads/dogs/{fileName}";
    await _context.SaveChangesAsync();

    return Ok(new { photoUrl = dog.PhotoUrl });
}
[HttpDelete("{id}/removedog")]
[Authorize]
public async Task<IActionResult> DeleteDog(int id)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
    var dog = await _context.Dogs.FirstOrDefaultAsync(d => d.Id == id);
    if (dog == null) return NotFound();
    if (dog.OwnerId != userId) return Forbid();

    _context.Dogs.Remove(dog);
    await _context.SaveChangesAsync();
    return NoContent();
}

[HttpPut("{id}/editdog")]
[Authorize]
public async Task<IActionResult> EditDog(int id,[FromBody] DogeditDto dto)
    {
        var dog = await _context.Dogs.Where(d=>d.Id ==id).FirstOrDefaultAsync();
        if(dog == null)
        {
            return NotFound();
        }
        dog.Name = dto.Name;
        dog.Breed = dto.Breed;
        dog.Age = dto.Age;
        dog.Size = dto.Size;
        dog.Sex = dto.Sex;
        dog.Neutered = dto.Neutered;
        dog.Vaccinated = dto.Vaccinated; 
        dog.Allergies = dto.Allergies; 
        dog.BehaviourNotes = dto.BehaviourNotes;
       
        dog.EmergencyContactName = dto.EmergencyContactName;
        dog.EmergencyContactPhone = dto.EmergencyContactPhone;

        await _context.SaveChangesAsync();
        return NoContent();

    }

}