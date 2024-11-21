using backend.Dtos.Conversation;

namespace backend.Mappers
{
    public static class ConversationMappers
    {
        public static ConversationDto ToConversationDto(this Conversation conversation)
        {
            return new ConversationDto
            {
                Id = conversation.Id,

                ClientId = conversation.ClientId,

                RealtyId = conversation.RealtyId,

                RealtorId = conversation.RealtorId
            };
        }

        public static Conversation ToConversationFromCreateDto(this CreateConversationRequestDto conversationDto)
        {
            return new Conversation
            {
<<<<<<< HEAD
                //Id = conversationDto.Id,
=======
                Id = conversationDto.Id,
>>>>>>> 001fcab387aa68954b40424480d945e76c017163

                ClientId = conversationDto.ClientId,

                RealtyId = conversationDto.RealtyId,

                RealtorId = conversationDto.RealtorId
            };
        }
    }
}