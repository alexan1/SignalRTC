namespace SignalRChat
{
    public enum Media { None, WebCam, Mic }

    public class User
    {
        public string Name { get; set; } = "";
        public string ConnectionId { get; set; } = "";
        public string Browser { get; set; } = "";
        public Media BroMedia { get; set; }
    }
}
