namespace backend.Models
{
    public class Realty
    {
        public int Id { get; set; }

        public int Id_Owner { get; set; }

        public Client? Clients { get; set; }

        public string FullName { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        public string Adress { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;
        
        public List<string> Features = new List<string>();
    }
}