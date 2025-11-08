
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewProject.Server.Data;
using NewProject.Server.DTO;
using NewProject.Server.Models;


namespace NewProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ReviewsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetAll()
        {
            var data = await _context.CustomerReviews
                .Include(r => r.User)
                .OrderByDescending(r => r.createdAt)
                .ProjectTo<ReviewResponseDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(data);
        }
        // Logged-in user creates a review
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateReviewDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var review = _mapper.Map<CustomerReview>(dto);
            review.UserId = userId.Value;


            _context.CustomerReviews.Add(review);
            await _context.SaveChangesAsync();

            // return the created review
            var created = await _context.CustomerReviews
                .Include(r => r.User)
                .Where(r => r.Id == review.Id)
                .ProjectTo<ReviewResponseDto>(_mapper.ConfigurationProvider)
                .FirstAsync();

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);

        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReviewResponseDto>> GetById(int id)
        {
            var review = await _context.CustomerReviews
                .Include(r => r.User)
                .Where(r => r.Id == id)
                .ProjectTo<ReviewResponseDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (review == null) return NotFound();
            return Ok(review);
        }

        // Logged-in user: see own reviews
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetMine()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var data = await _context.CustomerReviews
                .Include(r => r.User)
                .Where(r => r.UserId == userId.Value)
                .OrderByDescending(r => r.createdAt)
                .ProjectTo<ReviewResponseDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(data);
        }

        // Logged-in user: delete own review
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var review = await _context.CustomerReviews.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
            if (review == null) return NotFound();

            _context.CustomerReviews.Remove(review);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        private int? GetUserId()
        {
            // adapt to however you issue the claim ("sub", "nameid", or "userid")
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
                        ?? User.FindFirst("sub")
                        ?? User.FindFirst("userid");
            return int.TryParse(claim?.Value, out var id) ? id : null;
        }
    }

}
