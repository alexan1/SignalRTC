using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace SignalRChat
{
    public class ChatHub : Hub
    {
        static readonly List<User> ConnectedUsers = new();

        public override async Task OnConnectedAsync()
        {
            string name = GetClientName();
            string browser = GetBrowser();

            if (!ConnectedUsers.Any(c => c.Name == name || c.ConnectionId == Context.ConnectionId))
                ConnectedUsers.Add(new User { Name = name, ConnectionId = Context.ConnectionId, Browser = browser, BroMedia = Media.None });

            ShowUsersOnLine();
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
                ConnectedUsers.Remove(item);

            ShowUsersOnLine();
            await base.OnDisconnectedAsync(exception);
        }

        public void Send(string name, string message) =>
            Clients.All.SendAsync("broadcastMessage", false, name, message);

        public void SendToUser(string toname, string connId, string name, string message)
        {
            Clients.Client(connId).SendAsync("broadcastMessage", toname, name, message);
            Clients.Client(Context.ConnectionId).SendAsync("broadcastMessage", toname, name, message);
        }

        public void HangUp() =>
            Clients.All.SendAsync("hangUpVideo");

        public void Offer(string connId, string sdp) =>
            Clients.Client(connId).SendAsync("sendOffer", sdp);

        public void Answer(string sdp) =>
            Clients.Others.SendAsync("sendAnswer", sdp);

        public void IceCandidate(string ice) =>
            Clients.Others.SendAsync("sendIce", ice);

        public void ActivateMedia(int media)
        {
            var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                item.BroMedia = media switch
                {
                    1 => Media.WebCam,
                    2 => Media.Mic,
                    _ => Media.None
                };
            }
            ShowUsersOnLine();
        }

        public void ShowUsersOnLine()
        {
            var users = JsonSerializer.Serialize(ConnectedUsers);
            Clients.All.SendAsync("showUsersOnLine", users);
        }

        private string GetClientName()
        {
            var name = Context.GetHttpContext()?.Request.Query["userName"].ToString() ?? "";
            return name.Trim() == "" ? Context.ConnectionId : name;
        }

        private string GetBrowser() =>
            Context.GetHttpContext()?.Request.Query["browser"].ToString() ?? "no WebRTC";
    }
}
