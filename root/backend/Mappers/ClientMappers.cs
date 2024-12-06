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