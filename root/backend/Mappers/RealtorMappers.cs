using backend.Dtos.Realtor;

namespace backend.Mappers
{
    public static class RealtorMappers
    {
        public static RealtorDto ToRealtorDto(this Realtor realtorModel)
        {
            return new RealtorDto
            {
                Id = realtorModel.Id,

                Name = realtorModel.Name,

                Lastname = realtorModel.Lastname,

                PhoneNumber = realtorModel.PhoneNumber,

                Email = realtorModel.Email,

                Login = realtorModel.Login,

                PasswordHash = realtorModel.PasswordHash
            }; 
        }

        public static Realtor ToRealtorFromCreateDto(this CreateRealtorRequestDto realtorDto)
        {
            return new Realtor
            {
                Name = realtorDto.Name,

                Lastname = realtorDto.Lastname,

                PhoneNumber = realtorDto.PhoneNumber,

                Email = realtorDto.Email,

                Login = realtorDto.Login,

                PasswordHash = realtorDto.PasswordHash
            };
        }
    }
}