const banned = new Set();
const fingerprints = new Map();
const IPHUB_KEY = "8105294009:AAGNS_G7C25H_hO_Tk-p4SbRdlHJ6hyAVYE=";

export default async function handler(req, res) {
  const { user_id } = req.query;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!user_id) return res.status(400).send("❌ Missing user_id");

  if (banned.has(user_id)) return res.status(403).send("ban");

  try {
    const iphub = await fetch(`https://v2.api.iphub.info/ip/${ip}`, {
      headers: { "X-Key": IPHUB_KEY }
    });
    const info = await iphub.json();

    if (info.block === 1 || info.block === 2) {
      banned.add(user_id);
      return res.status(403).send("vpn");
    }

    const TELEGRAM_BOT_TOKEN = "8105294009:AAGNS_G7C25H_hO_Tk-p4SbRdlHJ6hyAVYE";
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: user_id,
        text: "✅ You've been verified via CAPTCHA!",
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "Continue", callback_data: "/mainmenu" }]]
        }
      })
    });

    return res.status(200).send("verified");
  } catch (err) {
    console.error("onWebhook error:", err);
    return res.status(500).send("error");
  }
}
