setInterval(function () {
  document.querySelector("#timeElement").innerHTML = new Date().toLocaleString();
}, 1000);

var windows = Array.from(document.querySelectorAll(".window"));
var homeWindow = document.querySelector("#home");
var terminalWindow = document.querySelector("#terminal");
var calculatorWindow = document.querySelector("#calculator");
var settingsWindow = document.querySelector("#settings");
var musicWindow = document.querySelector("#music");

for (const i of windows) {
    dragElement(i);
}

function closeWindow(element) {
    element.style.display = "none";
}

function toggleWindow(element) {
    if (!(element.style.display === "none")) {
        element.style.display = "none";
    } else {
        element.style.display = "block";
    }
}

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var terminalOutput = document.getElementById("terminaloutput");
var terminalInput = document.getElementById("terminalinput");

terminalOutput.innerHTML += "Welcome to CamOS. Run <span class='terminalcommand'>-help</span> to see a list of all available commands.<br>"
terminalInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        let prefix = "<span class='terminalprefix'>CamOS:\\></span>"
        let command = terminalInput.value.trim();
        function highlightCommand() {
            terminalOutput.innerHTML += `${prefix} <span class='terminalcommand'>${command.split(" ")[0]}</span> ${command.split(" ").slice(1).join(" ")}<br>`;
        }

        if (command.split(" ")[0] === "-help") {
            if (command.split(" ")[1] === "-time") {
                highlightCommand();
                terminalOutput.innerHTML +=
                "<br><b>Command: <span class='terminalcommand'>-time</span> <span style='color: yellow;'>[timezone]</span></b><br>" +
                "<b>Find the current time in a timezone</b><br><br>" +
                "Enter the timezone abbreviation after '<span class='terminalcommand'>-time</span>' to get the current time there<br>" +
                "If left empty, defaults to UTC<br><br>" +
                "<span style='color: aqua;'>Currently, <span class='terminalcommand'>-time</span> only works for UTC and AEST</span><br><br>";
            } else if (command === "-help") {
                highlightCommand();
                terminalOutput.innerHTML += 
                "<br>For commands highlighted in <span style='color: yellow;'>yellow</span>, run '<span class='terminalcommand'>-help</span> <span style='color: yellow;'>[command]</span>' to find out more about the command.<br><br>" +
                "Available commands:<br>" +
                "<span class='terminalcommand'>-help</span>: View a list of all commands<br>" +
                "<span class='terminalcommand'>-about</span>: About CamOS<br>" +
                "<span class='terminalcommand'><span style='color: yellow;'>-time [timezone]</span></span>: Find the current time in a timezone<br>" +
                "<span class='terminalcommand'>-clear</span>: Clear the terminal<br>" +
                "<span class='terminalcommand'>-quit</span>: Close the terminal<br>" +
                "<span class='terminalcommand'>-refresh</span>: Refresh the page<br>";
            } else {
                terminalOutput.innerHTML += `${prefix} ${command}<br>`;
                terminalOutput.innerHTML += `error: command not found: ${command.split(" ").slice(1).join(" ")}<br>Run <span class='terminalcommand'>-help</span> for a list of commands.<br>`;
            }
        } else if (command === "-about") {
            highlightCommand();
            terminalOutput.innerHTML += "Custom OS made by CamoKid to show off his cool coding knowledge.<br>";
        } else if (command.split(" ")[0] === "-time") {
            highlightCommand();
            let targetTimezone = "UTC"
            if (command.split(" ")[1] !== "") {
                if (command.split(" ")[1] === "UTC") {
                    targetTimezone = "UTC"
                } else if (command.split(" ")[1] === "AEST") {
                    targetTimezone = "+10:00"
                }

                let dOptions = {
                    timeZone: targetTimezone,
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                };
                const currentTime = new Date()
                const dFormat = new Intl.DateTimeFormat('en-AU', dOptions);
                terminalOutput.innerHTML += dFormat.format(currentTime) + "<br>"
            } else {
                terminalOutput.innerHTML += `${prefix} ${command}<br>`;
                terminalOutput.innerHTML += `error: command not found: ${command.split(" ").slice(1).join(" ")}<br>Run <span class='terminalcommand'>-help</span> for a list of commands.<br>`;
            }
        } else if (command === "-clear") {
            terminalOutput.innerHTML = "";
        } else if (command === "-quit") {
            closeWindow(terminalWindow);
            highlightCommand();
            terminalOutput.innerHTML +=
            "<span style='color: red;'>Quitting terminal...</span><br>" +
            "<span style='color: yellow;'>Terminal restored!</span><br>";
        } else if (command === "-refresh") {
            highlightCommand();
            terminalOutput.innerHTML += "<span style='color: yellow;'>Refreshing page...</span><br>";
            window.location.reload();
        } else if (command === "") {
            terminalOutput.innerHTML += `${prefix} <br>`;
        } else {
            terminalOutput.innerHTML += `${prefix} ${command}<br>`;
            terminalOutput.innerHTML += `error: command not found: ${command.split(" ")[0]}<br>Run <span class='terminalcommand'>-help</span> for a list of commands.<br>`;
        }
        const terminalContainer = document.querySelector("#terminal .main-content");
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
        terminalInput.value = "";
    }
})

var display = document.querySelector("#calculator .calcoutput");
var num1
var num2
var operator

function add(x, y) {
    console.log('add', x, y);
    return x + y;
}

function subtract(x, y) {
    console.log('subtract', x, y);
    return x - y;
}

function multiply(x, y) {
    console.log('multiply', x, y);
    return x * y;
}

function divide(x, y) {
    if (y === 0) {
        console.log('error: division by 0');
        return "Error: Division by 0";
    } else {
        console.log('divide', x, y);
        return x / y;
    }
}

function exponent(x, y) {
    console.log('exponent', x, y);
    return Math.pow(x, y);
}

function appendNumber(number) {
    console.log('appendNumber', number);
    display.innerHTML += number;
}

function clearAll() {
    console.log('clearAll');
    display.innerHTML = "";
    num1 = null;
    num2 = null;
    operator = null;
}

function deleteLast() {
    console.log('deleteLast');
    display.innerHTML = display.innerHTML.slice(0, -1);
}

function operation(operatorLocal) {
    console.log('operation', operatorLocal);
    num1 = parseFloat(display.innerHTML);
    operator = String(operatorLocal);
    display.innerHTML = "";
}

function calculate() {
    console.log('calculate');
    var num2 = parseFloat(display.innerHTML);
    let result
    console.log(num1, num2, operator);
    if (operator === "a") {
        result = add(num1, num2);
    } else if (operator === "s") {
        result = subtract(num1, num2);
    } else if (operator === "m") {
        result = multiply(num1, num2);
    } else if (operator === "d") {
        result = divide(num1, num2);
    } else if (operator ==="e") {
        result = exponent(num1, num2);
    } else {
        console.log("error: unknown");
        result = "Error";
    }
    result = String(result)
    let maxLength = 6;
    let displayText = result.length > maxLength ? result.slice(0, maxLength) + "...": result;
    display.innerHTML = displayText;
}

var body = document.querySelector("body");
const coloursLen = Array.from(document.querySelectorAll("#settings .main-content .wallpaper-colour button")).length;
const wallpapers = ["background.jpeg", "background2.png", "background3.png"];

document.getElementById("wallpaper1").classList.add("active");

function changeWallpaperColour(colourNum) {
    let newColour = document.getElementById(`colour${colourNum}`)
    body.style.backgroundColor = newColour.style.backgroundColor;
    body.style.backgroundImage = "none";

    for (i = 0; i < coloursLen; i++) {
        if (document.getElementById(`colour${i+1}`).classList.contains("active")) {
            document.getElementById(`colour${i+1}`).classList.remove("active")
        }
    }
    newColour.classList.add("active");

    for (i = 0; i < wallpapers.length; i++) {
        if (document.getElementById(`wallpaper${i+1}`).classList.contains("active")) {
            document.getElementById(`wallpaper${i+1}`).classList.remove("active")
        }
    }
}

function changeWallpaperImage(wallpaperNum) {
    body.style.backgroundImage = `url(assets/${wallpapers[wallpaperNum-1]})`;
    
    for (i = 0; i < wallpapers.length; i++) {
        if (document.getElementById(`wallpaper${i+1}`).classList.contains("active")) {
            document.getElementById(`wallpaper${i+1}`).classList.remove("active")
        }
    }
    document.getElementById(`wallpaper${wallpaperNum}`).classList.add("active");

    for (i = 0; i < coloursLen; i++) {
        if (document.getElementById(`colour${i+1}`).classList.contains("active")) {
            document.getElementById(`colour${i+1}`).classList.remove("active")
        }
    }
}

var slider = document.getElementById("brightnessslider");
var brightnessOverlay = document.getElementById("brightnessoverlay");
brightnessOverlay.style.opacity = 1.22403 * Math.pow(0.739301, slider.value);

slider.oninput = function() {
  brightnessOverlay.style.opacity = 1.22403 * Math.pow(0.739301, this.value);
}

var audio = document.getElementById("audio");
var playBtn = document.getElementById("play");
var prevBtn = document.getElementById("previoustrack");
var nextBtn = document.getElementById("nexttrack");
var title = document.getElementById("songname");
var artist = document.getElementById("artistname");
var cover = document.getElementById("albumcover");
var progressBar = document.getElementById("progressbar");
var currentTimeEl = document.getElementById("currenttime");
var durationTimeEl = document.getElementById("totalduration");

const songs = [
    { name: "Fairytale", artist: "Alexander Rybak", cover: "fairytales.jpeg", src: "fairytale.mp3" },
    { name: "Faded", artist: "Alan Walker", cover: "faded.jpg", src: "faded.mp3" },
    { name: "Shiawase", artist: "Dion Timmer", cover: "shiawase.jpg", src: "shiawase.mp3" },
    { name: "Beggin'", artist: "Måneskin", cover: "chosen.png", src: "beggin.mp3" },
    { name: "Billie Jean", artist: "Michael Jackson", cover: "thriller.png", src: "billiejean.mp3" },
    { name: "From the Start", artist: "Laufey", cover: "bewitched.webp", src: "fromthestart.mp3" },
    { name: "Golden Brown", artist: "The Stranglers", cover: "lafolie.jpg", src: "goldenbrown.mp3" }
]

let songIndex = 0;
let isPlaying = false;

function loadSong(song) {
    songIndex = song;
    song = songs[song];
    title.innerHTML = song.name;
    artist.innerHTML = song.artist;
    cover.src = "assets/music-tracks/albums/" + song.cover;
    audio.src = "assets/music-tracks/songs/" + song.src;
}

function playSong() {
    isPlaying = true;
    audio.play();
    playBtn.innerHTML = "<img src='assets/icons/pause-icon.png' alt='||'></img>";
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playBtn.innerHTML = "<img src='assets/icons/play-icon.png' alt='>' style='padding-left: 2px;'>";
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1; // Loop back to last song
    }
    loadSong(songIndex);
    if (isPlaying) playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0; // Loop forward to first song
    }
    loadSong(songIndex);
    if (isPlaying) playSong();
}

function formatSongTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        // Update slider value percentage
        const progressPercent = (currentTime / duration) * 1000;
        progressBar.value = progressPercent;
        
        // Update track numerical timestamps
        currentTimeEl.innerText = formatSongTime(currentTime);
        durationTimeEl.innerText = formatSongTime(duration);
    }
});

progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 1000) * audio.duration;
    audio.currentTime = seekTime;
});

for (i = 0; i < songs.length; i++) {
    let songTitle = songs[i].name;
    let songArtist = songs[i].artist;
    let songCover = songs[i].cover;
    let trackDiv = `<div class="playlist-track" onclick="loadSong(${i}); playSong();">
                        <div style="border-radius: 10px; overflow: hidden; height: 50px; width: 50px;">
                            <img src="assets/music-tracks/albums/${songCover}">
                        </div>
                        <div>
                            <b>${songTitle}</b><br>
                            <span style="color: rgba(255, 255, 255, 0.8); font-size: 0.8em;">${songArtist}</span>
                        </div>
                    </div>`
    document.getElementById("playlist").innerHTML += trackDiv;
}

audio.addEventListener('ended', nextSong);

loadSong(songIndex);
