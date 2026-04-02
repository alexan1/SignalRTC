using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Text.Json;

namespace SignalRChat
{
    static class JsonOptions
    {
        public static readonly JsonSerializerOptions CamelCase = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    }

    public class ChatHub : Hub
    {
        static readonly ConcurrentDictionary<string, User> ConnectedUsers = new();

        public override async Task OnConnectedAsync()
        {
            string name = GetClientName();
            string browser = GetBrowser();

            ConnectedUsers.TryAdd(Context.ConnectionId,
                new User { Name = name, ConnectionId = Context.ConnectionId, Browser = browser, BroMedia = Media.None });

            await ShowUsersOnLine();
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            ConnectedUsers.TryRemove(Context.ConnectionId, out _);

            await ShowUsersOnLine();
            await base.OnDisconnectedAsync(exception);
        }

        public Task Send(string name, string message) =>
            Clients.All.SendAsync("broadcastMessage", false, name, message);

        public async Task SendToUser(string toname, string connId, string name, string message)
        {
            await Clients.Client(connId).SendAsync("broadcastMessage", toname, name, message);
            await Clients.Client(Context.ConnectionId).SendAsync("broadcastMessage", toname, name, message);
        }

        public Task HangUp() =>
            Clients.All.SendAsync("hangUpVideo");

        public Task Offer(string connId, string sdp) =>
            Clients.Client(connId).SendAsync("sendOffer", sdp);

        public Task Answer(string sdp) =>
            Clients.Others.SendAsync("sendAnswer", sdp);

        public Task IceCandidate(string ice) =>
            Clients.Others.SendAsync("sendIce", ice);

        public async Task ActivateMedia(int media)
        {
            if (ConnectedUsers.TryGetValue(Context.ConnectionId, out var item))
            {
                item.BroMedia = media switch
                {
                    1 => Media.WebCam,
                    2 => Media.Mic,
                    _ => Media.None
                };
            }
            await ShowUsersOnLine();
        }

        public Task ShowUsersOnLine()
        {
            var snapshot = ConnectedUsers.Values.ToList();
            var users = JsonSerializer.Serialize(snapshot, JsonOptions.CamelCase);
            return Clients.All.SendAsync("showUsersOnLine", users);
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
