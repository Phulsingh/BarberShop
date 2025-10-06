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
    [Authorize(Roles = "Admin")]  // Only allows Admin role
    public class BarberServicesAPI : ControllerBase
    {
        private readonly AppDbContext _context;

        public BarberServicesAPI(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/BarberServices
        [HttpGet]
        [AllowAnonymous] // Allow all users to view services
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
                    Offer = s.Offer
                })
                .ToListAsync();

            return Ok(services);
        }

        // GET: api/BarberServices/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BarbarServiceDTO>> GetService(int id)
        {
            var service = await _context.BarbarServices.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            var serviceDTO = new BarbarServiceDTO
            {
                Id = service.Id,
                Name = service.Name,
                Price = service.Price,
                DurationInMinutes = service.DurationInMinutes,
                Category = service.Category,
                Offer = service.Offer
            };

            return Ok(serviceDTO);
        }

        // POST: api/BarberServices
        [HttpPost]
        public async Task<ActionResult<BarbarServiceDTO>> CreateService(BarbarServiceDTO serviceDTO)
        {
            var service = new BarbarServices
            {
                Name = serviceDTO.Name,
                Price = serviceDTO.Price,
                DurationInMinutes = serviceDTO.DurationInMinutes,
                Category = serviceDTO.Category,
                Offer = serviceDTO.Offer,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = User.FindFirst(ClaimTypes.Email)?.Value ?? "system"
            };

            _context.BarbarServices.Add(service);
            await _context.SaveChangesAsync();

            serviceDTO.Id = service.Id;
            return CreatedAtAction(nameof(GetService), new { id = service.Id }, serviceDTO);
        }

        // PUT: api/BarberServices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, BarbarServiceDTO serviceDTO)
        {
            if (id != serviceDTO.Id)
            {
                return BadRequest();
            }

            var service = await _context.BarbarServices.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            service.Name = serviceDTO.Name;
            service.Price = serviceDTO.Price;
            service.DurationInMinutes = serviceDTO.DurationInMinutes;
            service.Category = serviceDTO.Category;
            service.Offer = serviceDTO.Offer;
            service.UpdatedAt = DateTime.UtcNow;
            service.UpdatedBy = User.FindFirst(ClaimTypes.Email)?.Value ?? "system";

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/BarberServices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.BarbarServices.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            _context.BarbarServices.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceExists(int id)
        {
            return _context.BarbarServices.Any(e => e.Id == id);
        }
    }
}
