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
        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();       

        public override Task OnConnected()
        {
            string name = Context.User.Identity.Name;

            name = GetClientName();// "Alex";

            _connections.Add(name, Context.ConnectionId);

            ShowUsersOnLine();

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string name = Context.User.Identity.Name;
            name = GetClientName();

            _connections.Remove(name, Context.ConnectionId);

            ShowUsersOnLine();

            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            string name = Context.User.Identity.Name;
            name = GetClientName();

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

        public void HangUp()
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.hangUpVideo();
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
            Clients.All.showUsersOnLine(_connections.Keys, _connections.Values);            
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

        public List<HashSet<string>> Values
        {
            get
            {
                return _connections.Values.ToList();
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