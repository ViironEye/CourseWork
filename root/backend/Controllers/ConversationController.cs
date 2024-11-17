using Microsoft.AspNetCore.Mvc;

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
            var conversations = _context.Conversation.ToList();

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

            return Ok(conversation);
        }
    }
}