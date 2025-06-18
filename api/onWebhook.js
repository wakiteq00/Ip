export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).send("❌ Missing user_id");
  }

  const TELEGRAM_BOT_TOKEN = "8034807038:AAHk__yTrY464hIiilgU12iNLyIQ8bgVQhc";
  const chatId = user_id;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // Optional: Add user bans here
  const bannedUsers = [];
  if (bannedUsers.includes(user_id)) {
    return res.status(403).send("ban");
  }

  const payload = {
    chat_id: chatId,
    text: "✅ You've been verified via CAPTCHA!",
    parse_mode: "Markdown"
  };

  try {
    await fetch(url, {
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
