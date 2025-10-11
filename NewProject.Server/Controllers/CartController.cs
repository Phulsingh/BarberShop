using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewProject.Server.Data;
using NewProject.Server.DTO;
using NewProject.Server.Models;
using System.Security.Claims;

namespace NewProject.Server.Controllers
{
    [Authorize] // Require authentication for all cart operations
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/cart
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDTO>>> GetCartItems()
        {
            var userId = GetCurrentUserId();
            var cartItems = await _context.CartItems
                .Include(c => c.Service)
                .Where(c => c.UserId == userId)
                .Select(c => new CartItemDTO
                {
                    Id = c.Id,
                    ServiceId = c.ServiceId,
                    ServiceName = c.Service.Name,
                    ServicePrice = c.Service.Price,
                    ServiceImageUrl = c.Service.ImageUrl,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(cartItems);
        }

        // POST: api/cart
        [HttpPost]
        public async Task<ActionResult<CartItemDTO>> AddToCart(int serviceId)
        {
            var userId = GetCurrentUserId();

            // Check if service exists
            var service = await _context.BarbarServices.FindAsync(serviceId);
            if (service == null)
                return NotFound(new { message = "Service not found." });

            // Check if item already in cart
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ServiceId == serviceId);

            if (existingItem != null)
                return BadRequest(new { message = "Service already in cart." });

            var cartItem = new CartItem
            {
                UserId = userId,
                ServiceId = serviceId,
                CreatedAt = DateTime.UtcNow
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            // Return the DTO
            var cartItemDto = new CartItemDTO
            {
                Id = cartItem.Id,
                ServiceId = service.Id,
                ServiceName = service.Name,
                ServicePrice = service.Price,
                ServiceImageUrl = service.ImageUrl,
                CreatedAt = cartItem.CreatedAt
            };

            return CreatedAtAction(nameof(GetCartItem), new { id = cartItem.Id }, cartItemDto);
        }

        // GET: api/cart/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CartItemDTO>> GetCartItem(int id)
        {
            var userId = GetCurrentUserId();
            var cartItem = await _context.CartItems
                .Include(c => c.Service)
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (cartItem == null)
                return NotFound();

            var cartItemDto = new CartItemDTO
            {
                Id = cartItem.Id,
                ServiceId = cartItem.Service.Id,
                ServiceName = cartItem.Service.Name,
                ServicePrice = cartItem.Service.Price,
                ServiceImageUrl = cartItem.Service.ImageUrl,
                CreatedAt = cartItem.CreatedAt
            };

            return Ok(cartItemDto);
        }

        // DELETE: api/cart/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCartItem(int id)
        {
            var userId = GetCurrentUserId();
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (cartItem == null)
                return NotFound();

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/cart/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetCurrentUserId();
            var cartItems = await _context.CartItems
                .Where(c => c.UserId == userId)
                .ToListAsync();

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("User not authenticated");
            }
            return userId;
        }
    }
}