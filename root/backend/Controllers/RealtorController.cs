using Microsoft.AspNetCore.Mvc;
using backend.Dtos.Realtor;
using backend.Mappers;

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
            var realtors = _context.Realtor.ToList().Select(s => s.ToRealtorDto());

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

            return Ok(realtor.ToRealtorDto());        
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateRealtorRequestDto realtorDto)
        {
            var RealtorModel = realtorDto.ToRealtorFromCreateDto();

            _context.Realtor.Add(RealtorModel);

            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = RealtorModel.Id }, RealtorModel.ToRealtorDto());
        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult Update([FromRoute] int id, [FromBody] UpdateRealtorRequestDto realtorDto)
        {
            var realtorModel = _context.Realtor.FirstOrDefault(x => x.Id == id);

            if (realtorModel is null)
            {
                return NotFound("Client not found(((");
            }

            realtorModel.Name = realtorDto.Name;

            realtorModel.Lastname = realtorDto.Lastname;

            realtorModel.PhoneNumber = realtorDto.PhoneNumber;

            realtorModel.Email = realtorDto.Email;

            realtorModel.Login = realtorDto.Login;

            realtorModel.PasswordHash = realtorDto.PasswordHash;

            _context.SaveChanges();

            return Ok(realtorModel.ToRealtorDto());
        }
    }
}