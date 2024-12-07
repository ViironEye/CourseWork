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
        public override IActionResult GetAll()
        {
            var conversations = _context.Conversation.ToList().Select(s => s.ToConversationDto());

            return Ok(conversations);
        }

        [HttpGet("{id}")]
        public override IActionResult GetById([FromRoute] int id)
        {
            var conversation = _context.Conversation.Find(id);

            if (conversation is null)
            {
                return NotFound();
            }

            return Ok(conversation.ToConversationDto());
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateConversationRequestDto conversationDto)
        {
            var conversationModel = conversationDto.ToConversationFromCreateDto();

            _context.Conversation.Add(conversationModel);

            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = conversationModel.Id }, conversationModel.ToConversationDto());

        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult Update([FromRoute] int id, [FromBody] UpdateConversationRequestDto conversationDto)
        {
            var conversationModel = _context.Conversation.FirstOrDefault(x => x.Id == id);

            if (conversationModel is null)
            {
                return NotFound("Conversation not found ;(");
            }

            conversationModel.ClientId = conversationDto.ClientId;

            conversationModel.RealtyId = conversationDto.RealtyId;

            conversationModel.RealtorId = conversationDto.RealtorId;

            return Ok(conversationModel.ToConversationDto());

        }
    }
}