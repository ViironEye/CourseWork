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
        : base(context) 
        {

        }

        [HttpGet]
        public override async Task<IActionResult> GetAll()
        {
            var clients = await _context.Client.ToListAsync();
            
            var clientsDto = clients.Select(s => s.ToClientDto());

            return Ok(clientsDto);
        }

        [HttpGet("{id}")]
        public override async Task<IActionResult> GetById([FromRoute] int id)
        {
            var client = await _context.Client.FindAsync(id);

            if (client is null)
            {
                return NotFound();
            }

            return Ok(client.ToClientDto());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClientRequestDto clientDto)
        {
            var clientModel = clientDto.ToClientFromCreateDto();

            await _context.Client.AddAsync(clientModel);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = clientModel.Id }, clientModel.ToClientDto());
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateClientRequestDto clientDto)
        {
            var clientModel = await _context.Client.FirstOrDefaultAsync(x => x.Id == id);

            if (clientModel is null)
            {
                return NotFound("Client not found(((");
            }

            clientModel.Name = clientDto.Name;

            clientModel.Lastname = clientDto.Lastname;

            clientModel.PhoneNumber = clientDto.PhoneNumber;

            clientModel.Email = clientDto.Email;

            clientModel.Login = clientDto.Login;

            clientModel.PasswordHash = clientDto.PasswordHash;

            await _context.SaveChangesAsync();

            return Ok(clientModel.ToClientDto());

            //hhh
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var clientModel = await _context.Client.FirstOrDefaultAsync(x => x.Id == id);

            if (clientModel is null)
            {
                return NotFound("Object not exist or already deleted");
            }

            _context.Client.Remove(clientModel);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}