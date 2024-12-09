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

        public abstract Task<IActionResult> GetAll();

        public abstract Task<IActionResult> GetById(int id);

        //public abstract IActionResult Create();
    }
}