// netlify/functions/notify.js
import { Resend } from 'resend';

export async function handler(event, context) {
  try {
    const { name, module } = JSON.parse(event.body);

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Game Notification <onboarding@resend.dev>",
      to: "YOUR_EMAIL_HERE",
      subject: `Player Update: ${name}`,
      html: `<p>${name} just completed: <strong>${module}</strong></p>`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}