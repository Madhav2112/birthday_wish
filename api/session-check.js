export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("SESSION_CHECK_METHOD:", req.method);
    console.log("SESSION_CHECK_BODY:", req.body);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("SESSION_CHECK_ERROR:", err);
    return res.status(500).json({ error: "Session check failed" });
  }
}
