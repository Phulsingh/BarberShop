using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewProject.Server.Data;
using NewProject.Server.DTO;
using NewProject.Server.Models;
using System.Security.Claims;

namespace NewProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]  // Only Admins can modify services
    public class BarberServicesAPI : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public BarberServicesAPI(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ GET: api/BarberServices
        [HttpGet]
        [AllowAnonymous] // Anyone can view
        public async Task<ActionResult<IEnumerable<BarbarServiceDTO>>> GetServices()
        {
            var services = await _context.BarbarServices
                .Select(s => new BarbarServiceDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Price = s.Price,
                    DurationInMinutes = s.DurationInMinutes,
                    Category = s.Category,
                    Offer = s.Offer,
                    Description = s.Description,
                    ImageUrl = s.ImageUrl
                })
                .ToListAsync();

            return Ok(services);
        }

        // ✅ GET: api/BarberServices/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BarbarServiceDTO>> GetService(int id)
        {
            var service = await _context.BarbarServices.FindAsync(id);
            if (service == null) return NotFound();

            var serviceDTO = new BarbarServiceDTO
            {
                Id = service.Id,
                Name = service.Name,
                Price = service.Price,
                DurationInMinutes = service.DurationInMinutes,
                Category = service.Category,
                Offer = service.Offer,
                Description = service.Description,
                ImageUrl = service.ImageUrl
            };

            return Ok(serviceDTO);
        }

        // ✅ POST: api/BarberServices (With Image Upload)
        [HttpPost]
        public async Task<ActionResult<BarbarServiceDTO>> CreateService([FromForm] BarbarServiceCreateModel model)
        {
            string imageUrl = string.Empty;

            // 📸 Handle Image Upload
            if (model.Image != null && model.Image.Length > 0)
            {
                var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var ext = Path.GetExtension(model.Image.FileName).ToLowerInvariant();
                if (!allowedExts.Contains(ext))
                    return BadRequest("Only .jpg, .jpeg, .png, .gif files are allowed.");

                const long maxFileSize = 2 * 1024 * 1024; // 2MB
                if (model.Image.Length > maxFileSize)
                    return BadRequest("File too large. Max 2MB allowed.");

                var uploadsFolder = Path.Combine(
                    _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
                    "uploads", "services"
                );
                Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}{ext}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

                imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/services/{fileName}";
            }

            var service = new BarbarServices
            {
                Name = model.Name,
                Price = model.Price,
                DurationInMinutes = model.DurationInMinutes,
                Category = model.Category,
                Offer = model.Offer,
                Description = model.Description,
                ImageUrl = imageUrl,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = User.FindFirst(ClaimTypes.Email)?.Value ?? "system"
            };

            _context.BarbarServices.Add(service);
            await _context.SaveChangesAsync();

            var dto = new BarbarServiceDTO
            {
                Id = service.Id,
                Name = service.Name,
                Price = service.Price,
                DurationInMinutes = service.DurationInMinutes,
                Category = service.Category,
                Offer = service.Offer,
                Description = service.Description,
                ImageUrl = service.ImageUrl
            };

            return CreatedAtAction(nameof(GetService), new { id = service.Id }, dto);
        }

        // ✅ PUT: api/BarberServices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromForm] BarbarServiceCreateModel model)
        {
            var service = await _context.BarbarServices.FindAsync(id);
            if (service == null) return NotFound();

            service.Name = model.Name;
            service.Price = model.Price;
            service.DurationInMinutes = model.DurationInMinutes;
            service.Category = model.Category;
            service.Offer = model.Offer;
            service.Description = model.Description;
            service.UpdatedAt = DateTime.UtcNow;
            service.UpdatedBy = User.FindFirst(ClaimTypes.Email)?.Value ?? "system";

            // 📸 Optional: Replace Image if new one uploaded
            if (model.Image != null && model.Image.Length > 0)
            {
                // delete old image if exists
                if (!string.IsNullOrEmpty(service.ImageUrl))
                {
                    var oldFileName = Path.GetFileName(new Uri(service.ImageUrl).AbsolutePath);
                    var oldPath = Path.Combine(_env.WebRootPath, "uploads", "services", oldFileName);
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                var ext = Path.GetExtension(model.Image.FileName).ToLowerInvariant();
                var fileName = $"{Guid.NewGuid()}{ext}";
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "services");
                Directory.CreateDirectory(uploadsFolder);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Image.CopyToAsync(stream);
                }

                service.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/services/{fileName}";
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // ✅ DELETE: api/BarberServices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.BarbarServices.FindAsync(id);
            if (service == null) return NotFound();

            // Delete image file if exists
            if (!string.IsNullOrEmpty(service.ImageUrl))
            {
                var fileName = Path.GetFileName(new Uri(service.ImageUrl).AbsolutePath);
                var filePath = Path.Combine(_env.WebRootPath, "uploads", "services", fileName);
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            _context.BarbarServices.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceExists(int id) =>
            _context.BarbarServices.Any(e => e.Id == id);
    }
}
