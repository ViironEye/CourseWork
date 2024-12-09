using Microsoft.AspNetCore.Mvc;
using backend.Dtos.Conversation;
using backend.Mappers;

namespace backend.Controllers
{
    [Route("backend/conversation")]
    [ApiController]
    public class ConversationController : EntityController
    {
        public ConversationController(ApplicationDBContext context)
        : base(context) { }

        [HttpGet]
        public override async Task<IActionResult> GetAll()
        {
            var conversations = await _context.Conversation.ToListAsync();
            
            var conversationsDto = conversations.Select(s => s.ToConversationDto());

            return Ok(conversationsDto);
        }

        [HttpGet("{id}")]
        public override async Task<IActionResult> GetById([FromRoute] int id)
        {
            var conversation = await _context.Conversation.FindAsync(id);

            if (conversation is null)
            {
                return NotFound();
            }

            return Ok(conversation.ToConversationDto());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateConversationRequestDto conversationDto)
        {
            var conversationModel = conversationDto.ToConversationFromCreateDto();

            await _context.Conversation.AddAsync(conversationModel);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = conversationModel.Id }, conversationModel.ToConversationDto());

        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateConversationRequestDto conversationDto)
        {
            var conversationModel = await _context.Conversation.FirstOrDefaultAsync(x => x.Id == id);

            if (conversationModel is null)
            {
                return NotFound("Conversation not found ;(");
            }

            conversationModel.ClientId = conversationDto.ClientId;

            conversationModel.RealtyId = conversationDto.RealtyId;

            conversationModel.RealtorId = conversationDto.RealtorId;

            return Ok(conversationModel.ToConversationDto());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var conversationModelModel = await _context.Conversation.FirstOrDefaultAsync(x => x.Id == id);

            if (conversationModelModel is null)
            {
                return NotFound("Object not exist or already deleted");
            }

            _context.Conversation.Remove(conversationModelModel);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}