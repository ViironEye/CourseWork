using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
        : base(dbContextOptions)
        {
            
        }

        public DbSet<Client> Client { get; set; }

        public DbSet<Realtor> Realtor { get; set; }

        public DbSet<Realty> Realty { get; set; }

        public DbSet<Conversation> Conversation { get; set; }


    }
}