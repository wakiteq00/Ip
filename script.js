document.getElementById("verifyBtn").addEventListener("click", async () => {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const userId = tg.initDataUnsafe?.user?.id;
  if (!userId) return showMessage("❌ Telegram WebApp not loaded properly.");

  showMessage("⏳ Verifying...");

  try {
    // Get user IP
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    const ip = ipData.ip;

    // Send to your backend API
    const res = await fetch(`/api/onWebhook?user_id=${userId}&ip=${ip}`);
    const text = await res.text();

    // Optionally send directly to your Telegram Bot (via webhook or backend logic)
    await fetch(`https://api.telegram.org/bot<8105294009:AAGNS_G7C25H_hO_Tk-p4SbRdlHJ6hyAVYE>/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: userId,
        text: `🛡️ New Verification\nUser ID: ${userId}\nIP: ${ip}`
      }),
    });

    if (text.includes("ban") || text.includes("vpn")) {
      showMessage("❌ Access denied due to VPN or ban.");
    } else if (text.includes("verified") || res.ok) {
      showMessage("✅ Verified! Back to Bot");
      setTimeout(() => {
        window.location.href = `https://t.me/AIRTIMEPLUSBOT?start=${ip}`;
      }, 1500);
    } else {
      showMessage("❌ Unknown error occurred.\n\n" + text);
    }

  } catch (err) {
    console.error(err);
    showMessage("❌ Could not contact the server.");
  }
});

function showMessage(msg) {
  const div = document.getElementById("message");
  div.innerText = msg;
  div.classList.remove("hidden");
}

// Load real-time stats
async function loadStats() {
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();
    document.getElementById("statsBox").innerHTML = `📊 Today: ${data.today}<br>📅 Yesterday: ${data.yesterday}<br>🔢 Total: ${data.total}<br>🔌 Online: ${data.online}`;
  } catch (err) {
    console.error("Stats load failed", err);
  }
}

loadStats();
setInterval(loadStats, 10000);
