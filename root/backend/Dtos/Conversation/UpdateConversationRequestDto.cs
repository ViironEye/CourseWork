namespace backend.Dtos.Conversation
{
    public class UpdateConversationRequestDto
    {
        public int ClientId { get; set; }

        public int RealtyId { get; set; }

        public int RealtorId { get; set; }
    }
}