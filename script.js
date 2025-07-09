// List of valid QR codes
const validCodes = Array.from({ length: 14 }, (_, i) => `dragonball-${i + 1}`);
const scannedCodes = new Set();

const statusEl = document.getElementById("status");
const listEl = document.getElementById("scanned-list");

function updateStatus() {
  statusEl.textContent = `Scanned ${scannedCodes.size} of ${validCodes.length}`;

  // Show milestone at 5 scans (only once)
  if (scannedCodes.size === 5 && !updateStatus.milestoneShown) {
    showMilestoneGif();
    alert("🎉 You've scanned 5 QR codes! Keep going!");
    updateStatus.milestoneShown = true;
  }

  // Final completion
  if (scannedCodes.size === validCodes.length) {
    alert("✅ All QR codes scanned!");
  }
}
updateStatus.milestoneShown = false; // custom flag to show milestone only once

function showScanAnimation() {
  const anim = document.getElementById("scan-animation");
  anim.style.display = "block";
  setTimeout(() => {
    anim.style.display = "none";
  }, 2000); // Hide after 2 seconds
}

function showScanAnimationTemporarily(readerInstance) {
  const readerEl = document.getElementById("reader");
  const animEl = document.getElementById("scan-animation");

  // Pause scanner
  readerInstance.pause();

  // Hide scanner, show GIF
  readerEl.style.display = "none";
  animEl.style.display = "block";

  // After delay, return to scanning
  setTimeout(() => {
    animEl.style.display = "none";
    readerEl.style.display = "block";
    readerInstance.resume();
  }, 2000);
}

function showFullscreenGif(readerInstance) {
  const overlay = document.getElementById("fullscreen-gif-overlay");

  // Pause scanning
  readerInstance.pause();

  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.display = "none";
    readerInstance.resume();
  }, 2500);
}

function showMilestoneGif() {
  const overlay = document.getElementById("milestone-gif-overlay");

  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.display = "none";
  }, 3000);
}

function onScanSuccess(decodedText) {
  if (!validCodes.includes(decodedText)) {
    alert(`❌ Invalid QR code: "${decodedText}"`);
    return;
  }

  if (scannedCodes.has(decodedText)) {
    alert("⚠️ This QR code has already been scanned.");
    return;
  }

  scannedCodes.add(decodedText);
  showFullscreenGif(html5QrCode);

  const li = document.createElement("li");
  li.textContent = `✅ Scanned: ${decodedText}`;
  listEl.appendChild(li);

  updateStatus();
}

// Start the QR code scanner
const html5QrCode = new Html5Qrcode("reader");
html5QrCode.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  onScanSuccess,
  errorMessage => {
    // Optionally log errors or ignore
  }
);
