# Copilot Instructions — SignalRTC Server

## Project
ASP.NET Core 10 SignalR server for WebRTC signaling and text chat.
Deployed to Azure App Service (Linux, B1 plan) via GitHub Actions on push to `master`.

## Stack
- .NET 10 / ASP.NET Core minimal hosting (`Program.cs`)
- Microsoft.AspNetCore.SignalR (`ChatHub.cs`)
- `System.Text.Json` for serialization
- `ConcurrentDictionary` for thread-safe connected user tracking

## Key Files
- `ChatHub.cs` — SignalR hub: chat, WebRTC offer/answer/ICE signaling, user list
- `Program.cs` — app setup: CORS (signalrtc.com only), SignalR, static files
- `User.cs` — user model with `Media` enum (None, WebCam, Mic)
- `ConnectionMapping.cs` — generic thread-safe connection tracker (not currently used by hub)

## Conventions
- All hub methods must return `Task` and `await` all `SendAsync` calls
- CORS is restricted to `https://signalrtc.com` and `https://www.signalrtc.com`
- WebSockets are enabled by default on Linux App Service — no extra config needed
- Detailed SignalR errors are enabled only in Development environment

## Branch Strategy
- `dev` → active development
- `master` → triggers Azure deployment via GitHub Actions
- PRs are merged using rebase; sync `dev` with `master` after each merge
