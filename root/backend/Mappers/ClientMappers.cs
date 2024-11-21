using backend.Dtos.Client;

namespace backend.Mappers
{
    public static class ClientMappers
    {
        public static ClientDto ToClientDto(this Client clientModel)
        {
            return new ClientDto
            {
                Id = clientModel.Id,

                Name = clientModel.Name,

                Lastname = clientModel.Lastname,

                PhoneNumber = clientModel.PhoneNumber,

                Email = clientModel.Email,

                Login = clientModel.Login,

                PasswordHash = clientModel.PasswordHash
            }; 
        }

        public static Client ToClientFromCreateDto(this CreateClientRequestDto clientDto)
        {
            return new Client
            {
<<<<<<< HEAD
                //Id = clientDto.Id,
=======
                Id = clientDto.Id,
>>>>>>> 001fcab387aa68954b40424480d945e76c017163

                Name = clientDto.Name,

                Lastname = clientDto.Lastname,

                PhoneNumber = clientDto.PhoneNumber,

                Email = clientDto.Email,

                Login = clientDto.Login,

                PasswordHash = clientDto.PasswordHash
            };
        }
    }
}