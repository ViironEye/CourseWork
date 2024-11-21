using backend.Dtos.Realty;

namespace backend.Mappers
{
    public static class RealtyMappers
    {
        public static RealtyDto ToRealtyDto(this Realty realty)
        {
            return new RealtyDto
            {
                Id = realty.Id,

                Id_Owner = realty.Id_Owner,

                FullName = realty.FullName,

                Price = realty.Price,

                Adress = realty.Adress,

                Type = realty.Type
            };
        }

        public static Realty ToRealtyFromCreateDto(this CreateRealtyRequestDto realtyDto)
        {
            return new Realty
            {
<<<<<<< HEAD
                //Id = realtyDto.Id,
=======
                Id = realtyDto.Id,
>>>>>>> 001fcab387aa68954b40424480d945e76c017163

                Id_Owner = realtyDto.Id_Owner,

                FullName = realtyDto.FullName,

                Price = realtyDto.Price,

                Adress = realtyDto.Adress,

                Type = realtyDto.Type
            };
        }
    }
}