# SignalRTC Repository Comparison

> Retrieved from session on 2026-03-24

## Overview

These two solutions are **complementary parts of the same WebRTC video chat ecosystem**, not competing implementations.

---

## Solution 1: SignalRTC (695 files)

### Project Type
Full-stack WebRTC video chat application with 3 components:
- Backend signaling server (C#/ASP.NET with SignalR)
- Web client (JavaScript/HTML)
- Mobile app (Apache Cordova for Android/iOS/Windows)

### Directory Structure
```
SignalRTC/
├── SignalRChat/                    [Backend server]
│   ├── ChatHub.cs                 [Core SignalR Hub]
│   ├── ConnectionMapping.cs
│   ├── Startup.cs                 [OWIN Startup config]
│   ├── User.cs
│   ├── Default.html
│   ├── packages.config
│   ├── SignalRTC_server.csproj
│   └── Web.config
├── Hosted/                        [Mobile app - Cordova-based]
│   ├── platforms/                 [Android, iOS, Windows]
│   ├── plugins/
│   ├── www/
│   │   ├── css/
│   │   ├── scripts/
│   │   └── index.html
│   ├── config.xml
│   ├── package.json
│   └── SignalRTC_mobile.jsproj
├── SignalRTC.sln
├── README.md
└── LICENSE.md
```

### Key Details
- **Framework:** ASP.NET 4.5, OWIN pipeline
- **Packages:** 14 NuGet packages (SignalR, OWIN, OAuth, Identity)
- **Mobile:** Cordova app ID `com.signalrtc`, v1.0.0, Android/iOS/Windows
- **Deployed to:** `chatroomone.azurewebsites.net`
- **Copyright:** 2017

---

## Solution 2: signalrtc.com (101 files)

### Project Type
Web client only — polished HTML/JS frontend, no backend code.

### Key Files
- **Pages:** `index.html`, `videochat.html`, `mobile.html`
- **JavaScript:** `signalr.js`, `video.js`, `dom.js`, `facebook.js`

### Key Details
- **Framework:** Bootstrap 4, jQuery 3, Popper.js
- **Packages:** 7 NuGet packages
- **Auth:** Google Sign-In + Facebook integration
- **Analytics:** Google Analytics
- **Server:** Connects to SignalRChat Azure URL (hardcoded in `signalr.js`)
- **Copyright:** 2020

---

## Relationship Summary

| | SignalRTC | signalrtc.com |
|---|---|---|
| **Role** | Backend + Mobile | Web frontend |
| **C# code** | Yes (Hub, Startup, User) | No |
| **Mobile** | Cordova (Android/iOS/Windows) | Responsive web only |
| **Auth** | OAuth framework | Google/Facebook login |
| **Maturity** | Reference/dev implementation | Production deployment |
| **Year** | 2017 | 2020 |

**In short:** SignalRTC provides the server and mobile app; signalrtc.com is the production website that connects to that server. SignalRTC was built first (2017), and signalrtc.com is the evolved web frontend (2020).
