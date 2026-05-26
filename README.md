# Multi Chat Overlay

A static browser overlay for Twitch, YouTube, TikTok, and donation/service alerts. It includes a settings page for building shareable overlay URLs.

## Pages

- `index.html` is the overlay page for OBS/browser sources.
- `settings/` is the settings/config page.
- `index-scroll.html` is kept as the original settings page entry point.

When hosted under `/multichat`, the intended URLs are:

```text
https://your-site.example/multichat/
https://your-site.example/multichat/settings/
```

## Local Connections

The overlay connects to local WebSocket servers by default:

```text
Streamer.bot: 127.0.0.1:8080
TikFinity:    127.0.0.1:21213
```

Open the settings page and use the **Connections** section if your host, port, or reconnect timing is different. The generated overlay URL will include those connection overrides.

## Using Settings

1. Open `settings/`.
2. Change sources, styles, sizing, type styles, and connection details.
3. Copy the generated overlay URL.
4. Use that URL as a browser source in OBS or share it with another user.

Settings are encoded into URL parameters. Full config paths and friendly aliases are both supported, so older links should keep working.

## Publishing

This is a static site, so it can be hosted on GitHub Pages, Netlify, Cloudflare Pages, or any regular static host.

Do not publish local backup folders. They are ignored by `.gitignore`.
