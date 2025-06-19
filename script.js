document.getElementById("verifyBtn").addEventListener("click", async () => {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const userId = tg.initDataUnsafe?.user?.id;
  if (!userId) return showMessage("❌ Telegram WebApp not loaded properly.");

  showMessage("⏳ Verifying....");

  try {
    const res = await fetch(`https://newsitecap.vercel.app/api/onWebhook?user_id=${userId}`);
    const text = await res.text();

    if (text.includes("ban") || text.includes("vpn")) {
      showMessage("❌ Access denied due to VPN or ban.");
    } else if (text.includes("verified") || res.ok) {
      showMessage("✅ Verified! Back to Bot");
      setTimeout(() => {
        window.location.href = "https://t.me/tonghostybot?start=verified";
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

// Live stat update
async function loadStats() {
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();
    document.getElementById("statsBox").innerText = `📊 Today: ${data.today}\n📅 Yesterday: ${data.yesterday}\n🔢 Total: ${data.total}\n🔌 Online: ${data.online}`;
  } catch (err) {
    console.error("Stats load failed", err);
  }
}

loadStats();
setInterval(loadStats, 10000);

