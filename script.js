setInterval(function () {
  document.querySelector("#timeElement").innerHTML = new Date().toLocaleString();
}, 1000);

var windows = Array.from(document.querySelectorAll(".window"));
var homeWindow = document.querySelector("#home");
var terminalWindow = document.querySelector("#terminal");

for (const i of windows) {
    dragElement(i);
}

function closeWindow(element) {
    element.style.display = "none";
}

function toggleWindow(element) {
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
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

terminalInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        let prefix = "<span class='terminalprefix'>CamOs:\\></span>"
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
        } else {
            terminalOutput.innerHTML += `${prefix} ${command}<br>`;
            terminalOutput.innerHTML += `error: command not found: ${command.split(" ")[0]}<br>Run <span class='terminalcommand'>-help</span> for a list of commands.<br>`;
        }

        terminalInput.value = "";
    }
})