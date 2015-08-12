using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SignalRChat
{

    enum Media
    {
        None, WebCam, Mic
    };

    class User
    {
        public string Name { get; set; }
        public string ConnectionId { get; set; }
        public string Browser { get; set; }
        public Media BroMedia{ get; set; }
    }
}
