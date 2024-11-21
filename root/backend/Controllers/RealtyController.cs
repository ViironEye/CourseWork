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
        public override IActionResult GetAll()
        {
            var realties = _context.Realty.ToList().Select(s => s.ToRealtyDto());

            return Ok(realties);
        }

        [HttpGet("{id}")]
        public override IActionResult GetById([FromRoute] int id)
        {
            var realty = _context.Realty.Find(id);

            if (realty is null)
            {
                return NotFound();
            }

            return Ok(realty.ToRealtyDto());
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateRealtyRequestDto realtyDto)
        {
            var realtyModel = realtyDto.ToRealtyFromCreateDto();

            _context.Realty.Add(realtyModel);

            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = realtyModel.Id }, realtyModel.ToRealtyDto());
        }
    }
}