// api/index.js
import { WebClient } from "@slack/web-api";

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { secret, message, color } = req.body;

  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(403).json({ error: "Invalid secret" });
  }

  try {
    await slackClient.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      attachments: [
        {
          color: color || "#36a64f",
          text: message,
        },
      ],
    });

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Slack API error" });
  }
}
