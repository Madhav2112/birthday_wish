// netlify/functions/session-check.js
import { getStore } from "@netlify/blobs";

export async function handler(event, context) {
  const { sessionId, module } = JSON.parse(event.body);

  // Netlify automatically injects auth inside functions
  const store = getStore("sessions");

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