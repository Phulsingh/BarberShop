using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewProject.Server.Data;
using NewProject.Server.Models;
using NewProject.Server.DTO;
using Microsoft.AspNetCore.Authorization;

namespace NewProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class OffersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public OffersController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Offers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OffersDTO>>> GetOffers()
        {
            var offers = await _context.Offers.ToListAsync();
            var OfferDto = _mapper.Map<List<OffersDTO>>(offers);
            return Ok(OfferDto);
        }

        // GET: api/Offers/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<OffersDTO>> GetOffer(int id)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null) return NotFound();
            var dto = _mapper.Map<OffersDTO>(offer);
            return Ok(dto);
        }

        // POST: api/Offers
        [HttpPost]
        [Authorize] // <- Require authentication
        public async Task<ActionResult<OffersDTO>> CreateOffer(OffersDTO offersDto)
        {
            if (offersDto == null) return BadRequest();

            try
            {
                var offer = _mapper.Map<Offer>(offersDto);

                // Set audit fields
                var now = DateTime.UtcNow;
                offer.CreatedAt = now;
                offer.UpdatedAt = now;

                _context.Offers.Add(offer);
                await _context.SaveChangesAsync();

                var createdDto = _mapper.Map<OffersDTO>(offer);
                return Ok(new
                {
                    message = "Offer created successfully!",
                    offer = createdDto
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = "Invalid offer type", detail = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<OffersDTO>> UpdateOffer(int id, OffersDTO offerDto)
        {
            if (id != offerDto.Id)
                return BadRequest(new { message = "Offer Id Mismatch." });

            var existingOffer = await _context.Offers.FindAsync(id);
            if (existingOffer == null)
                return NotFound(new { message = "Offer Does not found" });

            try
            {
                _mapper.Map(offerDto, existingOffer);
                existingOffer.UpdatedAt = DateTime.UtcNow;

                _context.Entry(existingOffer).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Offer updated successfully!",
                    offer = _mapper.Map<OffersDTO>(existingOffer)
                });

            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = "Invalid offer type", detail = ex.Message });
            }


        }


        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult> DeleteOffer(int id)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null)
                return NotFound(new { message = "Offer not found. " });

            _context.Offers.Remove(offer);
            await _context.SaveChangesAsync();
            return Ok(new { message = " Offer Deleted Successsfully" });
        }


        [HttpPatch("{id:int}/toggle-active")]
        [Authorize]
        public async Task<ActionResult> ToggleOfferActive(int id)
        {
            var offer = await _context.Offers.FindAsync(id);
            if (offer == null)
                return NotFound(new { message=  "Offer not found" });

            // Toggle the boolean
            offer.IsActive = !offer.IsActive;
            offer.UpdatedAt = DateTime.UtcNow;

            _context.Entry(offer).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Offer is now {(offer.IsActive ? "Active" : "InActive")}",
                offer = _mapper.Map<OffersDTO>(offer)
            });


        }


    }
}
