using Microsoft.AspNetCore.Mvc;

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
            var realties = _context.Realty.ToList();

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

            return Ok(realty);
        }
    }
}