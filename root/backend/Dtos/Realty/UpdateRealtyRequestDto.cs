namespace backend.Dtos.Realty
{
    public class UpdateRealtyRequestDto
    {
        public int Id_Owner { get; set; }

        public string FullName { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Adress { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;
    }
}