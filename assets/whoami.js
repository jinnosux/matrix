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
            appendNewLineInfo(`Your IP Address is ${data.ip}`);
        }
        if (data.city && data.region && data.country_name) {
            appendNewLineInfo(`You are located somewhere near ${data.city}, ${data.region}, ${data.country_name}`);
        }
        if (data.org) {
            appendNewLineInfo(`Your Internet Provider is ${data.org}`);
        }
    })
    .catch(error => {
        console.error('Error fetching IP data:', error);
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
                    appendNewLineInfo(`Local IP Address: ${ip[1]}`);
                }
            }
        };
    } catch (e) {
        console.error('Error detecting local IPs:', e);
    }
}
getLocalIPs();

// Display client resolution
if (window.screen.width && window.screen.height) {
    appendNewLineInfo(`Your browser resolution is ${window.screen.width} x ${window.screen.height}`);
}

// Extract and display browser name from user agent
const userAgent = navigator.userAgent;
let browserName = "Unknown";
let osName = "Unknown";
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
if (userAgent.includes("Windows NT")) {
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

// Device Motion and Orientation
function trackDeviceMotion() {
    window.addEventListener('deviceorientation', event => {
        if (event && event.alpha !== null && event.beta !== null && event.gamma !== null && (event.alpha !== 0.0 || event.beta !== 0.0 || event.gamma !== 0.0)) {
            appendNewLineInfo(`Device orientation - alpha: ${event.alpha}, beta: ${event.beta}, gamma: ${event.gamma}`);
            if (event.beta > 0) {
                appendNewLineInfo(`Orientation: horizontal/landscape`);
            }
        }
    });

    window.addEventListener('devicemotion', event => {
        if (event && event.acceleration && event.acceleration.x !== null && event.acceleration.y !== null && event.acceleration.z !== null && (event.acceleration.x !== 0.0 || event.acceleration.y !== 0.0 || event.acceleration.z !== 0.0)) {
            appendNewLineInfo(`Device motion - X: ${event.acceleration.x}, Y: ${event.acceleration.y}, Z: ${event.acceleration.z}`);
        }
    });
}
trackDeviceMotion();

// Battery Status
function getBatteryStatus() {
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            const batteryLevel = battery.level * 100;
            if (batteryLevel !== 100 || battery.charging) {  // Avoid misleading 100% issue
                appendNewLineInfo(`Battery level: ${batteryLevel.toFixed(0)}%, Charging: ${battery.charging ? 'Yes' : 'No'}`);
            }
        }).catch(error => {
            console.error('Error getting battery status:', error);
        });
    }
}
getBatteryStatus();