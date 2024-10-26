namespace backend.Models
{
    public class Conversation
    {
        public int Id { get; set; }

        public int ClientId { get; set; }

        public List<Client>? Clients = new List<Client>();

        public int RealtyId { get; set; }

        public Realty? Realty { get; set; }

        public int RealtorId { get; set; }

        public Realtor? Realtor { get; set; }
    }
}