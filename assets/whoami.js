function appendInfo(message) {
    const container = document.getElementById('info-container');
    const paragraph = document.getElementById('combined-info') || document.createElement('p');
    paragraph.id = 'combined-info';
    paragraph.style.fontSize = `${fontSize}px`;
    paragraph.style.fontFamily = 'monospace';
    paragraph.innerText = paragraph.innerText ? paragraph.innerText + ", " + message : message;
    container.appendChild(paragraph);
}

function appendNewLineInfo(message) {
    if (message) {
        const container = document.getElementById('info-container');
        const paragraph = document.createElement('p');
        paragraph.style.fontSize = `${fontSize}px`;
        paragraph.style.fontFamily = 'monospace';
        paragraph.innerText = message;
        container.appendChild(paragraph);
    }
}

// Fetch and display IP address and geolocation using ipapi.co
fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
        if (data.ip) {
            appendNewLineInfo(`Your Public IP Address is ${data.ip}`);
        }
        if (data.city && data.region && data.country_name) {
            appendNewLineInfo(`You are located somewhere near ${data.city}, ${data.region}, ${data.country_name}`);
        }
        if (data.org) {
            appendNewLineInfo(`Your Internet Provider is ${data.org}`);
        }
    })
    .catch(error => {
        console.error('hmm, there seems to be an error with ipapi.co');
    });

// WebRTC Local IP Detection
function getLocalIPs() {
    try {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');
        pc.createOffer().then(offer => pc.setLocalDescription(offer));
        pc.onicecandidate = event => {
            if (event && event.candidate && event.candidate.candidate) {
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                const ip = event.candidate.candidate.match(ipRegex);
                if (ip) {
                    appendNewLineInfo(`Your Local IP Address is ${ip[1]}`);
                }
            }
        };
    } catch (e) {
        console.error('hmm, there seems to be an error with WebRTC');
    }
}
getLocalIPs();

// Display client resolution
if (window.screen.width && window.screen.height) {
    appendNewLineInfo(`Your browser resolution is ${window.screen.width} x ${window.screen.height}`);
}

// Extract and display browser name and operating system from user agent
const userAgent = navigator.userAgent;
let browserName = "Unknown";
let osName = "Unknown";

// Browser detection
if (userAgent.includes("Chrome")) {
    browserName = "Chrome";
} else if (userAgent.includes("Firefox")) {
    browserName = "Firefox";
} else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browserName = "Safari";
} else if (userAgent.includes("Edge")) {
    browserName = "Edge";
} else if (userAgent.includes("Trident")) {
    browserName = "Internet Explorer";
}

// OS detection, with specific check for Android before Linux
if (userAgent.includes("Android")) {
    osName = "Android";
} else if (userAgent.includes("Windows NT")) {
    osName = "Windows";
} else if (userAgent.includes("Mac OS")) {
    osName = "MacOS";
} else if (userAgent.includes("X11")) {
    osName = "Unix";
} else if (userAgent.includes("Linux")) {
    osName = "Linux";
}

if (browserName !== "Unknown") {
    appendInfo(`You're using ${browserName}`);
}
if (osName !== "Unknown") {
    appendNewLineInfo(`Your operating system is ${osName}`);
}


// Display cookies status
if (navigator.cookieEnabled) {
    appendInfo("Cookies are enabled");
} else {
    appendInfo("Cookies are disabled");
}

// Display Java status
if (navigator.javaEnabled()) {
    appendInfo("Java is enabled");
} else {
    appendInfo("Java is disabled");
}

// Display touch support and device type
const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (touchSupport) {
    appendNewLineInfo("You are most likely browsing on a mobile phone");
} else {
    appendNewLineInfo("You are most likely browsing on a PC");
}

// Display network information
if (navigator.connection && navigator.connection.effectiveType) {
    const connectionType = navigator.connection.effectiveType;
    appendNewLineInfo(`Your connection type is ${connectionType}`);
}

// Display referrer
if (document.referrer) {
    appendNewLineInfo(`You came from ${document.referrer}`);
}

// Display history length
if (window.history.length) {
    appendNewLineInfo(`You have ${window.history.length} pages in your browsing history in this session`);
}

if (navigator.doNotTrack) {
    appendNewLineInfo(`Do Not Track is ${navigator.doNotTrack === "1" ? "enabled" : "disabled"}`);
}

function trackDeviceOrientation() {
    // Check if permissions are required and request them
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    addOrientationListener();
                } else {
                    console.log('Permission to access device orientation was denied.');
                }
            })
            .catch(console.error);
    } else {
        // Add listener directly if no explicit permission request is required
        addOrientationListener();
    }

    function addOrientationListener() {
        function handleDeviceOrientation(event) {
            if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
                updateOrientationInfo(event.alpha, event.beta, event.gamma);
            }
        }
        window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
}

// Update the orientation info in a specific <p> element
function updateOrientationInfo(alpha, beta, gamma) {
    let orientationMessage = "Orientation: ";
    
    // Alpha is the device "facing direction"
    if (alpha >= 0 && alpha <= 45 || alpha >= 315 && alpha <= 360) {
        orientationMessage += "Facing North";
    } else if (alpha > 45 && alpha <= 135) {
        orientationMessage += "Facing East";
    } else if (alpha > 135 && alpha <= 225) {
        orientationMessage += "Facing South";
    } else if (alpha > 225 && alpha <= 315) {
        orientationMessage += "Facing West";
    }

    // Beta indicates forward/backward tilt
    if (beta > 45) {
        orientationMessage += ", Tilted Forward";
    } else if (beta < -45) {
        orientationMessage += ", Tilted Backward";
    }

    // Gamma indicates left/right tilt
    if (gamma > 30) {
        orientationMessage += ", Tilted Right";
    } else if (gamma < -30) {
        orientationMessage += ", Tilted Left";
    }

    // Update or create the <p> element with the orientation info
    let orientationElement = document.getElementById('device-orientation-info');
    if (!orientationElement) {
        orientationElement = document.createElement('p');
        orientationElement.id = 'device-orientation-info';
        orientationElement.style.fontSize = `${fontSize}px`;
        orientationElement.style.fontFamily = 'monospace';
        document.getElementById('info-container').appendChild(orientationElement);
    }
    orientationElement.innerText = orientationMessage;
}

trackDeviceOrientation();

// Battery Status
function getBatteryStatus() {
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            const batteryLevel = battery.level * 100;
            if (batteryLevel !== 100 || battery.charging) {  // Avoid misleading 100% issue
                appendNewLineInfo(`Battery level: ${batteryLevel.toFixed(0)}%, Charging: ${battery.charging ? 'Yes' : 'No'}`);
            }
        }).catch(error => {
            console.error('hmm, there seems to be an error with battery stuff', error);
        });
    }
}
getBatteryStatus();
