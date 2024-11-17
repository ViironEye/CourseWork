using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("backend/client")]
    [ApiController]
    public class ClientController : EntityController
    {
        public ClientController(ApplicationDBContext context)
        : base(context) { }

        [HttpGet]
        public override IActionResult GetAll()
        {
            var clients = _context.Client.ToList();

            return Ok(clients);
        }

        [HttpGet("{id}")]
        public override IActionResult GetById([FromRoute] int id)
        {
            var client = _context.Client.Find(id);

            if (client is null)
            {
                return NotFound();
            }

            return Ok(client);
        }
    }
}