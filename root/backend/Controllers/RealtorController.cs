using Microsoft.AspNetCore.Mvc;
using backend.Dtos.Realtor;
using backend.Mappers;

namespace backend.Controllers
{
    [Route("backend/realtor")]
    [ApiController]
    public class RealtorController : EntityController
    {
        public RealtorController(ApplicationDBContext context)
        : base(context) { }

        [HttpGet]
        public override async Task<IActionResult> GetAll()
        {
            var realtors = await _context.Realtor.ToListAsync();
            
            var realtorsDto = realtors.Select(s => s.ToRealtorDto());

            return Ok(realtorsDto);
        }

        [HttpGet("{id}")]
        public override async Task<IActionResult> GetById([FromRoute] int id)
        {
            var realtor = await _context.Realtor.FindAsync(id);

            if (realtor is null)
            {
                return NotFound();
            }

            return Ok(realtor.ToRealtorDto());        
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRealtorRequestDto realtorDto)
        {
            var RealtorModel = realtorDto.ToRealtorFromCreateDto();

            await _context.Realtor.AddAsync(RealtorModel);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = RealtorModel.Id }, RealtorModel.ToRealtorDto());
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateRealtorRequestDto realtorDto)
        {
            var realtorModel = await _context.Realtor.FirstOrDefaultAsync(x => x.Id == id);

            if (realtorModel is null)
            {
                return NotFound("Client not found(((");
            }

            realtorModel.Name = realtorDto.Name;

            realtorModel.Lastname = realtorDto.Lastname;

            realtorModel.PhoneNumber = realtorDto.PhoneNumber;

            realtorModel.Email = realtorDto.Email;

            realtorModel.Login = realtorDto.Login;

            realtorModel.PasswordHash = realtorDto.PasswordHash;

            await _context.SaveChangesAsync();

            return Ok(realtorModel.ToRealtorDto());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var realtorModel = await _context.Realtor.FirstOrDefaultAsync(x => x.Id == id);

            if (realtorModel is null)
            {
                return NotFound("Object not exist or already deleted");
            }

            _context.Realtor.Remove(realtorModel);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}