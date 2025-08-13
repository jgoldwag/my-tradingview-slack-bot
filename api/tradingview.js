export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbol, price, alert } = req.body;

    // Validate incoming data
    if (!symbol || !price || !alert) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send to Slack
    const slackResponse = await fetch(`https://slack.com/api/chat.postMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
      },
      body: JSON.stringify({
        channel: process.env.SLACK_CHANNEL_ID,
        text: `*${symbol}* — ${price}\n${alert}`
      })
    });

    const data = await slackResponse.json();

    if (!data.ok) {
      console.error('Slack API error:', data);
      return res.status(500).json({ error: 'Failed to send to Slack' });
    }

    res.status(200).json({ success: true, sent: req.body });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

