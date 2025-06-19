document.getElementById("verifyBtn").addEventListener("click", async () => {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const userId = tg.initDataUnsafe?.user?.id;

  if (!userId) {
    showMessage("❌ Telegram WebApp not loaded properly.");
    return;
  }

  showMessage("⏳ Verifying....");

  try {
    const webhookUrl = `https://newsitecap.vercel.app/api/onWebhook?user_id=${userId}`;
    const res = await fetch(webhookUrl);
    const text = await res.text();

    console.log("Webhook response:", text);

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
