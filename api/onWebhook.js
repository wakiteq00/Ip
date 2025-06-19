import fetch from 'node-fetch';

const TELEGRAM_BOT_TOKEN = "8034807038:AAHk__yTrY464hIiilgU12iNLyIQ8bgVQhc";
const IPHUB_API_KEY = "HPbJ5iTirMqlqtBV9x5v8nlj1naDmTUS";

const BANNED_USERS = [];

export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) return res.status(400).send("❌ Missing user_id");

  const chatId = user_id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (BANNED_USERS.includes(user_id) || BANNED_USERS.includes(ip)) {
    return res.status(403).send("ban");
  }

  // IPHub VPN check
  try {
    const response = await fetch(`https://iphub.info/api/ip/${ip}`, {
      headers: {
        "X-Key": IPHUB_API_KEY,
        "Accept": "application/json"
      }
    });

    const data = await response.json();

    if (data.block === 1) {
      console.log("VPN detected:", ip);
      return res.status(403).send("vpn");
    }

  } catch (err) {
    console.error("VPN check failed:", err);
    // Continue without VPN block if IPHub fails
  }

  // Send Telegram message
  try {
    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: "✅ You've been verified via CAPTCHA!",
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Continue", callback_data: "/mainmenu" }]]
      }
    };

    await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return res.status(200).send("verified");

  } catch (err) {
    console.error("Telegram error:", err);
    return res.status(500).send("telegram_failed");
  }
}
