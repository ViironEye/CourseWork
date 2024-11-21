using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public abstract class EntityController : ControllerBase
    {
        protected readonly ApplicationDBContext _context;

        public EntityController(ApplicationDBContext context)
        {
            _context = context;
        }

        public abstract IActionResult GetAll();

        public abstract IActionResult GetById(int id);

        //public abstract IActionResult Create();
    }
}