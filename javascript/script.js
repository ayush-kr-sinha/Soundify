console.log("Hello Ayush")

const SUPABASE_BASE_URL =
    "https://auhgcpldpwcjldwiuocg.supabase.co/storage/v1/object/public/SoundEro";

const PLAYLISTS = [
    "All Songs",
    "Bassline Breakthrough",
    "Bedroom Melancholy",
    "Classic Plus",
    "Echoes of Silence",
    "Golden Hour Horizon",
    "Heavy Metal Engine",
    "Indie Renaissance",
    "Midnight Drift",
    "Neon Pulse",
    "Oasis Acoustic",
    "Pop Fuel",
    "Retro Rewind 80s",
    "Sunrise Beats",
    "Synaptic Spark",
    "Urban Wanderer",
    "Velvet Grooves",
    "Vinyl Revival",
    "Windows Down",
    "Y2K Nostalgia"
];

let currentPlaylistFolder = "All Songs";
let globalTrackList = [];
let currentSong = new Audio();

async function getSongs(folderName) {
   const songsUrl =
    `${SUPABASE_BASE_URL}/${encodeURIComponent(folderName)}/songs.json?t=${Date.now()}`;

    const response = await fetch(songsUrl);

    if (!response.ok) {
        throw new Error(`Could not load songs.json for ${folderName}`);
    }

    const songNames = await response.json();

    return songNames.map(songName => {
        return `${SUPABASE_BASE_URL}/${encodeURIComponent(folderName)}/${encodeURIComponent(songName)}`;
    });
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = async (trackRelativePath) => {
    currentSong.src = trackRelativePath;
    currentSong.play();
    if (typeof play !== 'undefined') {
        play.src = "assets/Control Buttons/pause-button.svg";
    }
    let cleanPath = trackRelativePath.replaceAll("%5C", "/").replaceAll("%20", " ").replaceAll("%5B", "[").replaceAll("%5D", "]");
    let songFileName = cleanPath.split('/').pop().replaceAll(".mp3", "").trim();
    let artist = "Unknown Artist";
    let songTitle = songFileName;
    if (songFileName.includes("-")) {
        let parts = songFileName.split("-");
        artist = parts[0].trim();
        songTitle = parts[1].trim();
    }
    document.querySelector(".trackDetailForPlayer").innerHTML = artist;
    document.querySelector(".trackNameForPlayer").innerHTML = songTitle;

    console.log("Playing:", trackRelativePath);
    document.querySelector(".duration").innerHTML = "00:00/00:00";
}

async function loadPlaylistTracks(folderName) {
    currentPlaylistFolder = folderName;

    const rawSongPaths = await getSongs(folderName);

    // Songs are already complete Supabase URLs
    globalTrackList = rawSongPaths;

    console.log("SONGS RECEIVED:", globalTrackList);
    console.log("NUMBER OF SONGS:", globalTrackList.length);

    const SidebarSongsContainer = document.querySelector(".sidebar-songs");
    SidebarSongsContainer.innerHTML = "";

    globalTrackList.forEach(songPath => {

        // Get filename from the cloud URL
        const fileName = decodeURIComponent(songPath.split("/").pop());
        const cleanName = fileName.replace(".mp3", "");

        let artist = "Unknown Artist";
        let songTitle = cleanName;

        // Split only at the first "-"
        const dashIndex = cleanName.indexOf("-");

        if (dashIndex !== -1) {
            artist = cleanName.slice(0, dashIndex).trim();
            songTitle = cleanName.slice(dashIndex + 1).trim();
        }

        SidebarSongsContainer.innerHTML += `
        <div class="sidebar-song">
            <div class="songs-card" data-path="${songPath}">
                <div class="music-svg">
                    <svg class="music-svg-icon"
                        xmlns="http://www.w3.org"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor">
                        <path d="M19 2v12.55A3.5 3.5 0 1 1 17 11.4V6.1l-8 2v8.45A3.5 3.5 0 1 1 7 13.4V5.5L19 2z" />
                    </svg>

                    <div class="song-name">
                        <div class="music-title">${songTitle}</div>
                        <div class="singer">${artist}</div>
                    </div>
                </div>

                <div class="play-svg">
                    <img
                        width="24px"
                        height="24px"
                        src="assets/playButton.svg"
                        alt="Play">
                </div>
            </div>
        </div>`;
    });

    Array.from(document.querySelectorAll(".sidebar-song")).forEach(elementItem => {
        elementItem.addEventListener("click", () => {
            const songCard = elementItem.querySelector(".songs-card");
            const songPath = songCard.getAttribute("data-path");

            playMusic(songPath);
        });
    });
}

async function displayAlbum() {
    const playlistContainer = document.querySelector(".playlist-cards");

    playlistContainer.innerHTML = "";

    for (const folder of PLAYLISTS) {
        try {
            // Get playlist information
            const infoUrl =
                `${SUPABASE_BASE_URL}/${encodeURIComponent(folder)}/info.json`;

            const response = await fetch(infoUrl);

            if (!response.ok) {
                throw new Error(`Could not load info.json for ${folder}`);
            }

            const info = await response.json();

            // Cover image URL
            const coverUrl =
                `${SUPABASE_BASE_URL}/${encodeURIComponent(folder)}/cover.jfif`;

            playlistContainer.innerHTML += `
                <div class="cards" data-folder="${folder}">
                    <div class="card-image">
                        <img src="${coverUrl}" alt="${info.title}">
                    </div>

                    <div class="information">
                        <div class="playlist-name">
                            ${info.title}
                        </div>

                        <div class="playlist-info">
                            ${info.information}
                        </div>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error(`Error loading playlist ${folder}:`, error);
        }
    }

    // Add click events AFTER all cards have been created
    document.querySelectorAll(".cards").forEach(playlistCard => {
        playlistCard.addEventListener("click", async () => {

            const folder = playlistCard.dataset.folder;

            console.log("Loading playlist:", folder);

            await loadPlaylistTracks(folder);

            // Show sidebar if it is hidden
            const sidebarDrawer = document.querySelector(".sidebar");

            if (sidebarDrawer && !sidebarDrawer.classList.contains("show")) {
                sidebarDrawer.classList.add("show");
            }
            // Load first song but DON'T automatically play it
            if (globalTrackList.length > 0) {
                const firstSong = globalTrackList[0];

                currentSong.src = firstSong;

                const fileName =
                    decodeURIComponent(firstSong.split("/").pop());

                const cleanName =
                    fileName.replace(".mp3", "");

                const dashIndex = cleanName.indexOf("-");

                let artist = "Unknown Artist";
                let songTitle = cleanName;

                if (dashIndex !== -1) {
                    artist = cleanName.slice(0, dashIndex).trim();
                    songTitle = cleanName.slice(dashIndex + 1).trim();
                }

                document.querySelector(".trackDetailForPlayer").innerHTML =
                    artist;

                document.querySelector(".trackNameForPlayer").innerHTML =
                    songTitle;

                document.querySelector(".duration").innerHTML =
                    "00:00/00:00";

                if (typeof play !== "undefined") {
                    play.src =
                        "assets/Control Buttons/play-button.svg";
                }
            }
        });
    });
}
async function main() {
    await loadPlaylistTracks(currentPlaylistFolder);
    await displayAlbum();

    if (globalTrackList.length > 0) {
        const firstSongPath = globalTrackList[0];

        currentSong.src = firstSongPath;

        const fileName =
            decodeURIComponent(firstSongPath.split("/").pop());

        const cleanName =
            fileName.replace(".mp3", "");

        const dashIndex = cleanName.indexOf("-");

        let artist = "Unknown Artist";
        let songTitle = cleanName;

        if (dashIndex !== -1) {
            artist = cleanName.slice(0, dashIndex).trim();
            songTitle = cleanName.slice(dashIndex + 1).trim();
        }

        document.querySelector(".trackDetailForPlayer").innerHTML =
            artist;

        document.querySelector(".trackNameForPlayer").innerHTML =
            songTitle;

        document.querySelector(".duration").innerHTML =
            "00:00/00:00";

        if (typeof play !== "undefined") {
            play.src = "assets/Control Buttons/play-button.svg";
        }
    }

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assets/Control Buttons/pause-button.svg";
        } else {
            currentSong.pause();
            play.src = "assets/Control Buttons/play-button.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        const currentStr =
            secondsToMinutesSeconds(currentSong.currentTime);

        const durationStr =
            isNaN(currentSong.duration) || currentSong.duration === 0
                ? "00:00"
                : secondsToMinutesSeconds(currentSong.duration);

        document.querySelector(".duration").innerHTML =
            `${currentStr}/${durationStr}`;

        if (!isNaN(currentSong.duration) && currentSong.duration > 0) {
            const progressPercent =
                (currentSong.currentTime / currentSong.duration) * 100;

            document.querySelector(".progress-bar").style.width =
                progressPercent + "%";
        } else {
            document.querySelector(".progress-bar").style.width = "0%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        let clickX = e.clientX - rect.left;
        let percent = (clickX / rect.width) * 100;

        percent = Math.max(0, Math.min(100, percent));

        if (!isNaN(currentSong.duration) && currentSong.duration > 0) {
            document.querySelector(".progress-bar").style.width =
                percent + "%";

            currentSong.currentTime =
                (currentSong.duration * percent) / 100;
        }
    });

    const hamburgerBtn = document.querySelector(".hamburger");
    const sidebarDrawer = document.querySelector(".sidebar");

    if (hamburgerBtn && sidebarDrawer) {
        hamburgerBtn.addEventListener("click", () => {
            sidebarDrawer.classList.toggle("show");
        });
    }

    document.addEventListener("click", (e) => {
        const sidebar = document.querySelector(".sidebar");
        const hamburger = document.querySelector(".hamburger");

        if (!sidebar) return;

        const clickedInsideSidebar = sidebar.contains(e.target);
        const clickedHamburger = hamburger && hamburger.contains(e.target);

        if (
            sidebar.classList.contains("show") &&
            !clickedInsideSidebar &&
            !clickedHamburger
        ) {
            sidebar.classList.remove("show");
        }
    });

    back.addEventListener("click", () => {
        const index = globalTrackList.indexOf(currentSong.src);

        if (index > 0) {
            playMusic(globalTrackList[index - 1]);
        }
    });

    forward.addEventListener("click", () => {
        const index = globalTrackList.indexOf(currentSong.src);

        if (index !== -1 && index + 1 < globalTrackList.length) {
            playMusic(globalTrackList[index + 1]);
        }
    });

    currentSong.addEventListener("ended", () => {
        const index = globalTrackList.indexOf(currentSong.src);

        if (index !== -1 && index + 1 < globalTrackList.length) {
            playMusic(globalTrackList[index + 1]);
        } else {
            console.log("Playlist finished!");

            if (typeof play !== "undefined") {
                play.src = "assets/Control Buttons/play-button.svg";
            }
        }
    });

    const range =
        document.querySelector(".range").getElementsByTagName("input")[0];

    range.addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    document.querySelector(".volume > img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src =
                e.target.src.replace("volume.svg", "mute.svg");

            currentSong.volume = 0;
            range.value = 0;
        } else {
            e.target.src =
                e.target.src.replace("mute.svg", "volume.svg");

            currentSong.volume = 0.1;
            range.value = 10;
        }
    });
}

main();
