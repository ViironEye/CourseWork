namespace backend.Dtos.Client
{
    public class CreateClientRequestDto
    {

        //public int Id { get; set; }

        //public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Lastname { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Login { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;
    }
}