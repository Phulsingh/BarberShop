using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using NewProject.Server.Data;
using NewProject.Server.DTO;
using NewProject.Server.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;


namespace NewProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;

        public UsersController(AppDbContext context, IConfiguration config, IMapper mapper, IWebHostEnvironment env)
        {
            _context = context;
            _config = config;
            _mapper = mapper;
            _env = env;
        }

        // PUT api/users/update-profile/{id}
        [Authorize]
        [HttpPut("update-profile/{id}")]
        [Consumes("multipart/form-data")] // required for file upload
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UserProfileUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            // Map all fields except Avatar and Password
            _mapper.Map(request, user);

            // Handle password update
            if (!string.IsNullOrEmpty(request.Password))
                user.PasswordHash = HashPassword(request.Password);

            // 📸 Handle Avatar Upload
            if (request.Avatar != null && request.Avatar.Length > 0)
            {
                // Allowed file extensions
                var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var ext = Path.GetExtension(request.Avatar.FileName).ToLowerInvariant();
                if (!allowedExts.Contains(ext))
                    return BadRequest("Only .jpg, .jpeg, .png, .gif files are allowed.");

                // Max file size: 2MB
                const long maxFileSize = 2 * 1024 * 1024;
                if (request.Avatar.Length > maxFileSize)
                    return BadRequest("File too large. Max 2MB allowed.");

                // Upload folder
                var uploadsFolder = Path.Combine(
                    _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
                    "avatars"
                );
                Directory.CreateDirectory(uploadsFolder);

                // Save file
                var fileName = $"{Guid.NewGuid()}{ext}";
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.Avatar.CopyToAsync(stream);
                }

                // Save full URL in DB
                user.Avatar = $"/avatars/{fileName}";
            }

            // Set UpdatedAt timestamp
            user.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Map to DTO for response
            var userDto = _mapper.Map<UserProfileUpdateDTO>(user);

            // Convert Avatar to full URL for frontend
            if (!string.IsNullOrEmpty(userDto.Avatar))
                userDto.Avatar = $"{Request.Scheme}://{Request.Host}{userDto.Avatar}";

            return Ok(new
            {
                message = "Profile updated successfully.",
                user = userDto
            });
        }


        // GET api/users/profile/{id}
        [Authorize]
        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            var userDto = _mapper.Map<UserProfileUpdateDTO>(user);

            // Convert Avatar to full URL
            if (!string.IsNullOrEmpty(userDto.Avatar))
                userDto.Avatar = $"{Request.Scheme}://{Request.Host}{userDto.Avatar}";

            return Ok(new
            {
                message = "User profile fetched successfully.",
                user = userDto
            });
        }


        // POST api/users/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "Email already exists." });

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                ContactNumber = request.ContactNumber,
                Avatar = request.Avatar,
                Role = request.Role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully.",
                user = new { 
                    user.Id, 
                    user.FullName, 
                    user.Email, 
                    user.Role ,
                }
            });
        }
        
        // POST api/users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || user.PasswordHash != HashPassword(request.Password))
                return Unauthorized(new { message = "Invalid email or password." });

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Login successful.",
                token,
                user = new { user.Id,
                             user.FullName, 
                             user.Email, 
                             user.Role , 
                             user.ContactNumber,
                             user.CreatedAt
                }
      
            });
        }



        // Utility: Generate JWT token
        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Utility: Hash password with SHA256
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
