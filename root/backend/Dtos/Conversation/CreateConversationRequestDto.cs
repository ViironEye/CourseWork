namespace backend.Dtos.Conversation
{
    public class CreateConversationRequestDto
    {
        public int ClientId { get; set; }

        public int RealtyId { get; set; }

        public int RealtorId { get; set; }
    }
}