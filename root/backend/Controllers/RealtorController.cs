using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("backend/realtor")]
    [ApiController]
    public class RealtorController : EntityController
    {
        public RealtorController(ApplicationDBContext context)
        : base(context) { }

        [HttpGet]
        public override IActionResult GetAll()
        {
            var realtors = _context.Realtor.ToList();

            return Ok(realtors);
        }

        [HttpGet("{id}")]
        public override IActionResult GetById([FromRoute] int id)
        {
            var realtor = _context.Realtor.Find(id);

            if (realtor is null)
            {
                return NotFound();
            }

            return Ok(realtor);        
        }
    }
}