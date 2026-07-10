using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DogWalkerApi.Data;
using DogWalkerApi.Models;
using DogWalkerApi.DTOs;
using Resend;
using Microsoft.AspNetCore.Authorization;

namespace DogWalkerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
   private readonly AppDbContext _context;
private readonly IConfiguration _config;
private readonly IResend _resend;

public AuthController(AppDbContext context, IConfiguration config, IResend resend)
{
    _context = context;
    _config = config;
    _resend = resend;
}

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
       if (await _context.Users.AnyAsync(u => u.Username.ToLower() == dto.Username.ToLower()))
    return BadRequest("Username already taken");

if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
    return BadRequest("Email already registered");

var user = new User
{
    FirstName = dto.FirstName,
    LastName = dto.LastName,
    Email = dto.Email.ToLower(),
    Username = dto.Username.ToLower(),
    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
    Phone = dto.Phone,
    StreetAddress = dto.StreetAddress,
    City = dto.City,
    Postcode = dto.Postcode
};

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dog = new Dog
        {
            OwnerId = user.Id,
            Name = dto.DogName,
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
try
{
    var welcomeEmail = new EmailMessage();
    welcomeEmail.From = "bookings@lutondogboarding.co.uk";
    welcomeEmail.To.Add(user.Email);
    welcomeEmail.Subject = "Welcome to Luton Dog Boarding";
    welcomeEmail.HtmlBody = $@"
        <h2>Hi {user.FirstName},</h2>
        <p>Thank you for registering with Luton Dog Boarding.</p>
        <p>Before your first booking we need to arrange a short meet and greet. Someone will be in touch within a few hours.</p>
        <br/>
        <p>Looking forward to meeting you,<br/>Luton Dog Boarding</p>
    ";
    await _resend.EmailSendAsync(welcomeEmail);

    var notifyEmail = new EmailMessage();
    notifyEmail.From = "bookings@lutondogboarding.co.uk";
    notifyEmail.To.Add("lucabex@gmail.com");
    notifyEmail.Subject = $"New Registration — {user.FirstName} {user.LastName}";
    notifyEmail.HtmlBody = $@"
        <h2>New user registered</h2>
        <p><strong>Name:</strong> {user.FirstName} {user.LastName}</p>
        <p><strong>Email:</strong> {user.Email}</p>
        <p><strong>Phone:</strong> {user.Phone}</p>
        <p><strong>Dog:</strong> {dto.DogName}, {dto.Breed}</p>
       
    ";
    await _resend.EmailSendAsync(notifyEmail);
}
catch (Exception ex)
{
    Console.WriteLine($"Welcome email failed: {ex.Message}");
}
        return Ok(new { dogId = dog.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
       var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Username.ToLower() == dto.Username.ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid username or password");

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Phone,
            user.StreetAddress,
            user.Username,
            user.IsApproved,
            user.MeetingDone,
            user.IsAdmin,
            user.PhotoUrl,
            token
        });
    }

    [HttpGet("owners")]
    [Authorize]
    public async Task<IActionResult> AllOwner()
    {
        var owners = await _context.Users
            .Include(u => u.Dogs)
            .Include(u => u.Bookings)
            .Include(u => u.Reviews)
            .Select(u => new AllOwners
            {
                OwnerId = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Username = u.Username,
                Email = u.Email,
                Phone = u.Phone,
                StreetAddress = u.StreetAddress,
                City = u.City,
                Postcode = u.Postcode,
                MeetingDone = u.MeetingDone,
                IsApproved = u.IsApproved,
                IsAdmin = u.IsAdmin,
                CreatedAt = u.CreatedAt,
                TotalBookings = u.Bookings.Count(),
                TotalSpent = u.Bookings.Sum(b => b.AmountPaid ?? 0),
                Dogs = u.Dogs.Select(d => new OwnerDogDto
                {
                    DogId = d.Id,
                    Name = d.Name,
                    Breed = d.Breed,
                    Age = d.Age,
                    Size = d.Size,
                    Sex = d.Sex,
                    Neutered = d.Neutered,
                    PhotoUrl = d.PhotoUrl
                }).ToList(),
                Review = u.Reviews.Select(r => new OwnerRewDto
                {
                    Rating = r.Rating,
                    Comment = r.Comment
                }).ToList()
            })
            .ToListAsync();

        return Ok(owners);
    }

    [HttpPatch("{id}/meeting")]
    [Authorize]
    public async Task<IActionResult> ChangeMeeting(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return NotFound();

        user.MeetingDone = !user.MeetingDone;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/approve")]
    [Authorize]
    public async Task<IActionResult> Approve(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return NotFound();

        user.IsApproved = !user.IsApproved;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/isapproved")]
    [Authorize]
    public async Task<IActionResult> IsApproved(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return NotFound();
        return Ok(user.IsApproved);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMe()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound();
        return Ok(user.IsApproved);
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.Id.ToString()),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, user.Username),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, user.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    [HttpPost("forgot-password")]
public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
{
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

    // Always return OK
    if (user == null)
        return Ok(new { message = "If that email exists, a code has been sent." });

    var code = Random.Shared.Next(100000, 999999).ToString();
    user.ResetCodeHash = BCrypt.Net.BCrypt.HashPassword(code);
    user.ResetCodeExpiry = DateTime.UtcNow.AddMinutes(15);
    await _context.SaveChangesAsync();

    // send `code` via Resend, same pattern as your booking emails
    await SendResetEmail(user.Email, code);

    return Ok(new { message = "If that email exists, a code has been sent." });
}
[HttpPost("reset-password")]
public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
{
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

    if (user == null || user.ResetCodeHash == null || user.ResetCodeExpiry == null)
        return BadRequest(new { message = "Invalid or expired code." });

    if (user.ResetCodeExpiry < DateTime.UtcNow)
        return BadRequest(new { message = "Code has expired." });

    if (!BCrypt.Net.BCrypt.Verify(dto.Code, user.ResetCodeHash))
        return BadRequest(new { message = "Invalid code." });

    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
    user.ResetCodeHash = null;        // single-use: clear it
    user.ResetCodeExpiry = null;
    await _context.SaveChangesAsync();

    return Ok(new { message = "Password updated. You can now log in." });
}
private async Task SendResetEmail(string toEmail, string code)
{
    var resend = ResendClient.Create(_config["Resend:ApiKey"]);

    var message = new EmailMessage
    {
        From = "bookings@lutondogboarding.co.uk",
        To = toEmail,
        Subject = "Your password reset code",
        HtmlBody = $@"
            <p>You requested a password reset for Luton Dog Boarding.</p>
            <p>Your reset code is: <strong>{code}</strong></p>
            <p>This code expires in 15 minutes. If you didn't request this, you can ignore this email.</p>"
    };

    await resend.EmailSendAsync(message);
}
}