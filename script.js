// ============================================================
//  🔗 PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW
// ============================================================
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxaeMAwxWKXmYN0bnjnCGGRyd400aDKQ7IDzEpywVkyWUWm7GBSzRJC87aMEorVX-wdpg/exec'
// ============================================================

const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "Pookie please... 🥺",
    "If you say no, I will be really sad...",
    "I will be very sad... 😢",
    "Please??? 💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

// ── Tracking ────────────────────────────────────────────────
const sessionStartTime = Date.now()
let responseSent = false   // prevent duplicate submissions

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function ensureMusicPlaying() {
    if (music.paused || music.muted) {
        music.muted = false;
        music.play().catch(() => {});
        musicPlaying = true;
        const toggleBtn = document.getElementById('music-toggle');
        if(toggleBtn) toggleBtn.textContent = '🔊';
    }
}

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    ensureMusicPlaying();
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }

    // Change button text briefly
    yesBtn.textContent = "..."
    yesBtn.style.pointerEvents = "none"

    // ── Send response (runs in background) ──
    sendResponse('Yes')
    
    // Instead of navigating away (which restarts music), we seamlessly morph the page!
    showYesPage()
}

function showYesPage() {
    const container = document.querySelector('.container');
    container.classList.add('yes-container');
    container.innerHTML = `
        <h1 class="yes-title">Knew you would say yes! 🎉</h1>
        <div class="gif-container">
            <img id="cat-gif" src="https://media.tenor.com/eNHbizSfVb0AAAAj/lovemode-cute.gif" alt="celebrating">
        </div>
        <p class="yes-message">You just made me the happiest person! 💕</p>
    `;

    // Load and trigger confetti seamlessly
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js";
    script.onload = () => {
        const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00'];
        const duration = 6000;
        const end = Date.now() + duration;

        confetti({
            particleCount: 150,
            spread: 100,
            origin: { x: 0.5, y: 0.3 },
            colors
        });

        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }
            confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
            confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
        }, 300);
    };
    document.body.appendChild(script);
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++
    ensureMusicPlaying();

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time
    const isMobile = window.innerWidth <= 480;
    const multiplier = isMobile ? 1.25 : 1.35;
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * multiplier}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, isMobile ? 60 : 120)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    // Clamp to keep button visible on all screen sizes
    const randomX = Math.max(margin, Math.random() * maxX)
    const randomY = Math.max(margin, Math.min(Math.random() * maxY, maxY))

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}

// ============================================================
//  📊 Response Tracking — Google Sheets
// ============================================================

function getDeviceInfo() {
    const ua = navigator.userAgent

    // ── Device type ──
    let device = 'Unknown'
    if (/iPhone/i.test(ua))           device = 'iPhone'
    else if (/iPad/i.test(ua))        device = 'iPad'
    else if (/Android.*Mobile/i.test(ua)) device = 'Android Phone'
    else if (/Android/i.test(ua))     device = 'Android Tablet'
    else if (/Macintosh/i.test(ua))   device = 'Mac'
    else if (/Windows/i.test(ua))     device = 'Windows PC'
    else if (/Linux/i.test(ua))       device = 'Linux PC'

    // ── Browser name ──
    let browser = 'Unknown'
    if (/Edg\//i.test(ua))            browser = 'Edge'
    else if (/OPR|Opera/i.test(ua))   browser = 'Opera'
    else if (/Chrome/i.test(ua))      browser = 'Chrome'
    else if (/Safari/i.test(ua))      browser = 'Safari'
    else if (/Firefox/i.test(ua))     browser = 'Firefox'

    // ── Screen size ──
    const screenSize = `${screen.width}x${screen.height}`

    return { device, browser, screenSize }
}

function sendResponse(finalAnswer) {
    // Prevent duplicate sends
    if (responseSent) return
    responseSent = true

    // Don't send if URL hasn't been set yet
    if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        console.warn('⚠️ Google Sheet URL not set! Open script.js and paste your URL.')
        return
    }

    const { device, browser, screenSize } = getDeviceInfo()
    const timeOnPage = Math.round((Date.now() - sessionStartTime) / 1000)
    const payload = {
        timestamp:     new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        finalAnswer:   finalAnswer,
        noClickCount:  noClickCount,
        yesTeaseCount: yesTeasedCount,
        timeOnPage:    `${timeOnPage} sec`,
        device:        device,
        browser:       browser,
        screenSize:    screenSize,
        referrer:      document.referrer || 'Direct'
    }

    // sendBeacon is specifically designed for sending analytics right before page unload.
    // It runs in the background and is guaranteed not to be cancelled by the redirect.
    // We use a text/plain Blob to bypass CORS preflight issues with Google Apps Script.
    const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' })
    navigator.sendBeacon(GOOGLE_SHEET_URL, blob)

    console.log('📊 Background response sent via Beacon:', payload)
}
