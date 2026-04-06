# SignalRTC

A WebRTC video and text chat application consisting of 2 parts:

1. **Server** — ASP.NET Core (.NET 10) with SignalR for signaling (`SignalRChat/`)
2. **Web client** — HTML/JavaScript frontend at https://signalrtc.com/ (repo: [alexan1/signalrtc.com](https://github.com/alexan1/signalrtc.com))

## Features

- Real-time video chat via WebRTC (peer-to-peer)
- Text chat — public broadcast or direct messages to a specific user
- Webcam and microphone toggle
- Live online users list with media status indicators
- No registration required; messages are not stored

## Getting Started

### Web Client

See [alexan1/signalrtc.com](https://github.com/alexan1/signalrtc.com) and follow that repository's configuration instructions to point the client at your SignalR server URL.

## Project Structure

```
SignalRTC/
├── SignalRChat/          # ASP.NET Core server
│   ├── ChatHub.cs        # SignalR hub (signaling, messaging)
│   ├── User.cs           # User model
│   ├── Program.cs        # App configuration and startup
│   └── SignalRTC_server.csproj
└── SignalRTC.sln
```

## License
[MIT](LICENSE.md)
