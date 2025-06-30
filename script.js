document.getElementById("verifyBtn").addEventListener("click", async () => {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const userId = tg.initDataUnsafe?.user?.id;
  if (!userId) return showMessage("❌ Telegram WebApp not loaded properly.");

  showMessage("⏳ Verifying....");

  try {
    const res = await fetch(`/api/onWebhook?user_id=${userId}`);
    const text = await res.text();

    if (text.includes("ban") || text.includes("vpn")) {
      showMessage("❌ Access denied due to VPN or ban.");
    } else if (text.includes("verified") || res.ok) {
      showMessage("✅ Verified! Back to Bot");
      setTimeout(() => {
        window.location.href = "https://t.me/AIRTIMEPLUSBOT?start= "+text+"";
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
