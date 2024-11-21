namespace backend.Dtos.Realty
{
    public class CreateRealtyRequestDto
    {
<<<<<<< HEAD
        //public int Id { get; set; }
=======
        public int Id { get; set; }
>>>>>>> 001fcab387aa68954b40424480d945e76c017163

        public int Id_Owner { get; set; }

        public string FullName { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Adress { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;
    }
}