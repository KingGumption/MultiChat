Widget Builder (vanilla JS)

This is a minimal widget builder that creates a single-file HTML widget suitable for OBS Browser Source.

How to use (developer):

1. Open `widget-builder/index.html` in your browser to use the editor.
2. Configure the animation settings, then click `Export Widget` to download `widget.html`.
3. Load `widget.html` into OBS via Browser Source using either a `file:///` URL or by serving the file using a tiny static server.

Serve locally (recommended for best compatibility):

Python:

```bash
python -m http.server 5174
```

Node (serve):

```bash
npx serve . -l 5174
```

Then point OBS Browser Source at `http://localhost:5174/widget-builder/widget.html` (or the downloaded file path).

Notes:
- The exported widget is a standalone single HTML file with an embedded demo feed.
- This is a starting point; we can expand the builder to include presets, theme export, and an embeddable JS SDK later.
