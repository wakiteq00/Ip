document.getElementById("verifyBtn").addEventListener("click", async () => {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const userId = tg.initDataUnsafe?.user?.id;
  if (!userId) return showMessage("❌ Telegram WebApp not loaded properly.");

  showMessage("⏳ Verifying...");

  try {
    // Step 1: Get IP
    let ip = "unknown";
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      ip = ipData.ip;
    } catch (ipErr) {
      console.warn("❗ IP fetch failed", ipErr);
      showMessage("❌ Couldn't fetch IP address.");
      return;
    }

    // Step 2: Call your backend
    const res = await fetch(`/api/onWebhook?user_id=${userId}&ip=${ip}`);
    const text = await res.text();
    console.log("✅ Webhook Response:", text);

    // Step 3: (Optional) Send to your bot directly
    try {
      await fetch(`https://api.telegram.org/bot<8105294009:AAGNS_G7C25H_hO_Tk-p4SbRdlHJ6hyAVYE>/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: userId,
          text: `🛡️ New Verification\nUser ID: ${userId}\nIP: ${ip}`,
        }),
      });
    } catch (botErr) {
      console.warn("❗ Telegram sendMessage failed", botErr);
      // Don't stop if this fails
    }

    // Step 4: Process response
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
    console.error("❌ General Error:", err);
    showMessage("❌ Could not contact the server.");
  }
});

function showMessage(msg) {
  const div = document.getElementById("message");
  div.innerText = msg;
  div.classList.remove("hidden");
}
