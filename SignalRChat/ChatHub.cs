using System;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
namespace SignalRChat
{
    public class ChatHub : Hub
    {

        static List<string> users = new List<string>(); 

        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, message);            
        }

        public void Offer(string sdp)
        {            
            Clients.Others.sendOffer(sdp);
        }

        public void Answer(string sdp)
        {
            Clients.Others.sendAnswer(sdp);
        }

        public void IceCandidate(string ice)
        {
            Clients.Others.sendIce(ice);
        }

        //public void AllUsers(string user)
        //{
        //    Clients.All.showUsers(user);
        //}

        public override System.Threading.Tasks.Task OnConnected()
        {
            string clientId = GetClientId();

            if (users.IndexOf(clientId) == -1)
            {
                users.Add(clientId);
            }

            ShowUsersOnLine();

            return base.OnConnected(); 
        }

        public override System.Threading.Tasks.Task OnReconnected() 
        { 
            string clientId = GetClientId(); 
            if (users.IndexOf(clientId) == -1) 
            { 
                users.Add(clientId); 
            } 
 
            ShowUsersOnLine(); 
         
            return base.OnReconnected(); 
        } 
 
        public override System.Threading.Tasks.Task OnDisconnected() 
        { 
            string clientId = GetClientId(); 
             
            if (users.IndexOf(clientId) > -1) 
            { 
                users.Remove(clientId); 
            } 
 
            ShowUsersOnLine(); 
 
            return base.OnDisconnected(true); 
        } 
 
 
        private string GetClientId() { 
            string clientId = ""; 
            if (!(Context.QueryString["clientId"] == null)) 
            { 
                //clientId passed from application 
                clientId = Context.QueryString["clientId"].ToString(); 
            } 
 
            if (clientId.Trim() == "") 
            { 
                //default clientId: connectionId 
                clientId = Context.ConnectionId; 
            } 
            return clientId; 
         
        } 
        public void Log(string message) { 
            Clients.All.log(message); 
        } 
        public void ShowUsersOnLine() 
        { 
            Clients.All.showUsersOnLine(users.Count); 
        } 
    }
    }
}