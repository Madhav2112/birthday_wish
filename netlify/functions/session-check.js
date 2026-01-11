// netlify/functions/session-check.js
import { createClient } from "@netlify/blobs";

export async function handler(event, context) {
  const { sessionId, module } = JSON.parse(event.body);

  const client = createClient({ token: process.env.NETLIFY_BLOBS_TOKEN });
  const store = client.store("sessions");

  let session = await store.get(sessionId, { type: "json" });

  if (!session) {
    session = { progress: [] };
  }

  if (session.progress.includes(module)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Module already completed" })
    };
  }

  session.progress.push(module);

  await store.set(sessionId, session);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Progress updated", session })
  };
}