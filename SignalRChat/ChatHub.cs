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

        static List<User> ConnectedUsers = new List<User>();

        public override Task OnConnected()
        {
            string name = Context.User.Identity.Name;

            name = GetClientName();
            var browser = GetBrowser();            

            if (!ConnectedUsers.Any(c => c.Name == name || c.ConnectionId == Context.ConnectionId))
            {
                ConnectedUsers.Add(new User() { Name = name, ConnectionId = Context.ConnectionId, Browser = browser, BroMedia = Media.None });
            };

            ShowUsersOnLine();

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string name = Context.User.Identity.Name;
            name = GetClientName();
            
            var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);

            ConnectedUsers.Remove(item);

            ShowUsersOnLine();

            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            string name = Context.User.Identity.Name;
            name = GetClientName();
            var browser = GetBrowser();
            
            if (!ConnectedUsers.Any(c => c.Name == name || c.ConnectionId == Context.ConnectionId))
            {
                ConnectedUsers.Add(new User() { Name = name, ConnectionId = Context.ConnectionId, Browser = browser, BroMedia = Media.None });
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

        private string GetBrowser()
        {
            string browser = "no WebRTC";
            if (!(Context.QueryString["browser"] == null))
            {
                //clientId passed from application 
                browser = Context.QueryString["browser"].ToString();
            }
            
            return browser;
        }

        public void ActivateMedia()
        {
            var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            item.BroMedia = Media.WebCam;
            ShowUsersOnLine();
        }

        public void ShowUsersOnLine()
        {            
            var names = ConnectedUsers.Select(C => C.Name).ToList();
            var connections = ConnectedUsers.Select(C => C.ConnectionId).ToList();
            var browsers = ConnectedUsers.Select(C => C.Browser).ToList();
            var medias = ConnectedUsers.Select(C => C.BroMedia).ToList();
            Clients.All.showUsersOnLine(names, connections, browsers, medias);

        }
    }
}