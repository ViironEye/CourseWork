using Microsoft.AspNetCore.Mvc;
using backend.Dtos.Client;
using backend.Mappers;

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
            var clients = _context.Client.ToList().Select(s => s.ToClientDto());

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

            return Ok(client.ToClientDto());
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateClientRequestDto clientDto)
        {
            var clientModel = clientDto.ToClientFromCreateDto();

            _context.Client.Add(clientModel);

            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = clientModel.Id }, clientModel.ToClientDto());
        }
    }
}