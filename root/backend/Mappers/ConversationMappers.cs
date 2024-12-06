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
                ClientId = conversationDto.ClientId,

                RealtyId = conversationDto.RealtyId,

                RealtorId = conversationDto.RealtorId
            };
        }
    }
}