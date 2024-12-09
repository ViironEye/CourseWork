using Microsoft.AspNetCore.Mvc;
using backend.Dtos.Realty;
using backend.Mappers;

namespace backend.Controllers
{
    [Route("backend/realty")]
    [ApiController]
    public class RealtyController : EntityController
    {
        public RealtyController(ApplicationDBContext context)
        : base(context) { }

        [HttpGet]
        public override async Task<IActionResult> GetAll()
        {
            var realties = await _context.Realty.ToListAsync();
            
            var realtiesDto = realties.Select(s => s.ToRealtyDto());

            return Ok(realties);
        }

        [HttpGet("{id}")]
        public override async Task<IActionResult> GetById([FromRoute] int id)
        {
            var realty = await _context.Realty.FindAsync(id);

            if (realty is null)
            {
                return NotFound();
            }

            return Ok(realty.ToRealtyDto());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRealtyRequestDto realtyDto)
        {
            var realtyModel = realtyDto.ToRealtyFromCreateDto();

            await _context.Realty.AddAsync(realtyModel);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = realtyModel.Id }, realtyModel.ToRealtyDto());
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateRealtyRequestDto realtyDto)
        {
            var realtyModel = await _context.Realty.FirstOrDefaultAsync(x => x.Id == id);

            if (realtyModel is null)
            {
                return NotFound("Realty not found >:(");
            }

            realtyModel.Id_Owner = realtyDto.Id_Owner;

            realtyModel.FullName = realtyDto.FullName;

            realtyModel.Price = realtyDto.Price;

            realtyModel.Adress = realtyDto.Adress;

            realtyModel.Type = realtyDto.Type;

            await _context.SaveChangesAsync();

            return Ok(realtyModel.ToRealtyDto());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var realtyModel = await _context.Realty.FirstOrDefaultAsync(x => x.Id == id);

            if (realtyModel is null)
            {
                return NotFound("Object not exist or already deleted");
            }

            _context.Realty.Remove(realtyModel);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}