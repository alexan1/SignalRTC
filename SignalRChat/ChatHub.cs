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
            //Clients.Others.broadcastMessage(name, message);
        }
        public void Offer()
        {
            Clients.All.sendOffer();
        }
    }
}