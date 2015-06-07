using System;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace SignalRChat
{
    public class ChatHub : Hub
    {             
        //static List<string> users = new List<string>(); 

        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();

        public void SendChatMessage(string who, string message)
        {
            string name = Context.User.Identity.Name;

            foreach (var connectionId in _connections.GetConnections(who))
            {
                Clients.Client(connectionId).addChatMessage(name + ": " + message);
            }
        }

        public override Task OnConnected()
        {
            string name = Context.User.Identity.Name;

            //name = "Alex";

            _connections.Add(name, Context.ConnectionId);

            ShowUsersOnLine();

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string name = Context.User.Identity.Name;

            _connections.Remove(name, Context.ConnectionId);

            ShowUsersOnLine();

            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            string name = Context.User.Identity.Name;

            if (!_connections.GetConnections(name).Contains(Context.ConnectionId))
            {
                _connections.Add(name, Context.ConnectionId);
            }

            ShowUsersOnLine();

            return base.OnReconnected();
        }

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
        
        //public override System.Threading.Tasks.Task OnConnected()
        //{
        //    string clientId = GetClientId();

        //    if (users.IndexOf(clientId) == -1)
        //    {
        //        users.Add(clientId);
        //    }

        //    ShowUsersOnLine();

        //    return base.OnConnected(); 
        //}

        //public override System.Threading.Tasks.Task OnReconnected() 
        //{ 
        //    string clientId = GetClientId(); 
        //    if (users.IndexOf(clientId) == -1) 
        //    { 
        //        users.Add(clientId); 
        //    } 
 
        //    ShowUsersOnLine(); 
         
        //    return base.OnReconnected(); 
        //}

        //public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled) 
        //{ 
        //    string clientId = GetClientId(); 
             
        //    if (users.IndexOf(clientId) > -1) 
        //    { 
        //        users.Remove(clientId); 
        //    } 
 
        //    ShowUsersOnLine();

        //    return base.OnDisconnected(stopCalled); 
        //} 
 
 
        //private string GetClientId() { 
        //    string clientId = ""; 
        //    if (!(Context.QueryString["clientId"] == null)) 
        //    { 
        //        //clientId passed from application 
        //        clientId = Context.QueryString["clientId"].ToString(); 
        //    } 
 
        //    if (clientId.Trim() == "") 
        //    { 
        //        //default clientId: connectionId 
        //        clientId = Context.ConnectionId; 
        //    } 
        //    return clientId; 
         
        //} 
        //public void Log(string message)
        //{
        //    Clients.All.log(message);
        //} 
        public void ShowUsersOnLine()
        {
            //_connections.
            Clients.All.showUsersOnLine(_connections.Keys);            
        } 
    }

    public class ConnectionMapping<T>
    {
        private readonly Dictionary<T, HashSet<string>> _connections =
            new Dictionary<T, HashSet<string>>();

        public int Count
        {
            get
            {
                return _connections.Count;
            }
        }

        public List<T> Keys
        {
            get
            {
                return _connections.Keys.ToList();
            }
        }

        public void Add(T key, string connectionId)
        {
            lock (_connections)
            {
                HashSet<string> connections;
                if (!_connections.TryGetValue(key, out connections))
                {
                    connections = new HashSet<string>();
                    _connections.Add(key, connections);
                }

                lock (connections)
                {
                    connections.Add(connectionId);
                }
            }
        }

        public IEnumerable<string> GetConnections(T key)
        {
            HashSet<string> connections;
            if (_connections.TryGetValue(key, out connections))
            {
                return connections;
            }

            return Enumerable.Empty<string>();
        }

        //public List<string> GetNames()
        //{
        //    return _connections.Keys.ToList();
        //}

        public void Remove(T key, string connectionId)
        {
            lock (_connections)
            {
                HashSet<string> connections;
                if (!_connections.TryGetValue(key, out connections))
                {
                    return;
                }

                lock (connections)
                {
                    connections.Remove(connectionId);

                    if (connections.Count == 0)
                    {
                        _connections.Remove(key);
                    }
                }
            }
        }
    }
}