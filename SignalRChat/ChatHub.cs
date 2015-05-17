using System;
using System.Web;
using Microsoft.AspNet.SignalR;
namespace SignalRChat
{
    public class ChatHub : Hub
    {
        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, message);            
        }

        public void Offer(string sdp)
        {            
            Clients.Others.sendOffer(sdp);
        }

        public void IceCandidate(string ice)
        {
            Clients.Others.sendIce(ice);
        }

        //public override System.Threading.Tasks.Task OnConnected()
        //{
        //    Clients.Others.connect();
        //    return base.OnConnected();
        //}
    }
}