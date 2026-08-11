# 🎧 Soundify - Web Music Player Project

Hello! This is my web development project. It is a clean, dark-mode music player website inspired by Spotify. I built it using simple HTML, CSS, and JavaScript.

---

## 🌟 Features
* **Dynamic Playlist Cards:** Automatically builds beautiful album cards with images and descriptions.
* **Full Audio Controls:** Features working Play, Pause, Next, and Previous track buttons.
* **Clean & Organized Code:** Separates design (`/css`), logic (`/javascript`), and music tracks (`/songs`).
* **Fast Local Memory:** Uses `songs-data.js` to load music files instantly inside your local workspace.

---

## 📁 Project Folder Structure
This is how all the project files are organized:

```text
🎵 Music-Player/
├── assets/               # Website icons and default backup images
├── css/                  # Layout styling folder
│   └── style.css         # Makes the player look beautiful and dark
├── javascript/           # Programming logic folder
│   ├── script.js         # Controls the play buttons and music logic
│   └── songs-data.js     # Automatically tracks all song names and details
├── songs/                # The main directory for music playlists
│   ├── Bangers!!/        # Playlist folder 1
│   ├── Durandhar/        # Playlist folder 2
│   └── Honey Singh/      # Playlist folder 3
├── favicon.ico           # Small icon shown on the browser tab
└── index.html            # The main homepage HTML file
```

---

## 🛠️ Languages Used
* **HTML5:** Built the basic structure of the audio player.
* **CSS3:** Added custom styles, grids, flexbox, and dark theme colors.
* **JavaScript:** Managed click events and handled `.mp3` audio playback loops.

---

## ➕ How to Create a New Playlist

Follow these four simple steps to add a new playlist to your workspace:

1. **Create a Folder:** 
   Go inside the main `songs/` directory. Make a new folder and name it after your playlist (e.g., `Bollywood-Hits`). Do not use spaces.
   
2. **Add Your Text Details (`info.json`):** 
   Inside your new playlist folder, create a file named exactly `info.json`. Paste this simple template and change the text:
   ```json
   {
       "title": "My Favorite Songs",
       "description": "A collection of my favorite tracks to listen to daily."
   }
   ```
   
3. **Add a Cover Picture (`cover.jfif`):** 
   Find a cool square image for your playlist. Move it into your new folder and rename it exactly to `cover.jfif` (all lowercase).
   
4. **Drop Your Favorite Songs:** 
   Copy and paste your favorite `.mp3` song files straight into this folder. For a clean look, name them like `Artist - Song.mp3`.

---

---

## ✍️ Author
Built with 💻 by **Ayush Kr. Sinha** 
*   GitHub: [@ayush-kr-sinha](https://github.com)
