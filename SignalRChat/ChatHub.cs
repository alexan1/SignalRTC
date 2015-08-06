using System;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Security;
namespace SignalRChat
{
    public class ChatHub : Hub
    {         
        //private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();

        static List<User> ConnectedUsers = new List<User>();

        public override Task OnConnected()
        {
            string name = Context.User.Identity.Name;

            name = GetClientName();

            //_connections.Add(name, Context.ConnectionId);

            if (!ConnectedUsers.Any(c => c.Name == name || c.ConnectionId == Context.ConnectionId))
            {
                ConnectedUsers.Add(new User() { Name = name, ConnectionId = Context.ConnectionId });
            };

            ShowUsersOnLine();

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string name = Context.User.Identity.Name;
            name = GetClientName();

            //_connections.Remove(name, Context.ConnectionId);

            var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);

            ConnectedUsers.Remove(item);

            ShowUsersOnLine();

            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            string name = Context.User.Identity.Name;
            name = GetClientName();
            
            //if (!_connections.GetConnections(name).Contains(Context.ConnectionId))           
            //{
            //    _connections.Add(name, Context.ConnectionId);                
            //};

            if (!ConnectedUsers.Any(c => c.Name == name || c.ConnectionId == Context.ConnectionId))
            {
                ConnectedUsers.Add(new User() { Name = name, ConnectionId = Context.ConnectionId});
            };


            ShowUsersOnLine();

            return base.OnReconnected();
        }

        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.            
            Clients.All.broadcastMessage(false, name, message);            
        }

        public void SendToUser(string toname, string connId, string name, string message)
        {           
            Clients.Client(connId).broadcastMessage(toname, name, message);
            Clients.Client(Context.ConnectionId).broadcastMessage(toname, name, message);

        }

        public void HangUp()
        {            
            Clients.All.hangUpVideo();
        }

        public void Offer(string connId, string sdp)
        {
            Clients.Client(connId).sendOffer(sdp);            
        }

        public void Answer(string sdp)
        {
            Clients.Others.sendAnswer(sdp);
        }

        public void IceCandidate(string ice)
        {
            Clients.Others.sendIce(ice);           
        }       

        private string GetClientName()
        {
            string clientName = "";
            if (!(Context.QueryString["userName"] == null))
            {
                //clientId passed from application 
                clientName = Context.QueryString["userName"].ToString();
            }

            if (clientName.Trim() == "")
            {
                //default clientId: connectionId 
                clientName = Context.ConnectionId;
            }
            return clientName;
        }

        public void ShowUsersOnLine()
        {
            //Clients.All.showUsersOnLine(_connections.Keys, _connections.Values);
            var names = ConnectedUsers.Select(C => C.Name).ToList();
            var connections = ConnectedUsers.Select(C => C.ConnectionId).ToList();
            Clients.All.showUsersOnLine(names, connections);

        }
    }
}