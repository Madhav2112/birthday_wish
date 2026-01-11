export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  try {
    console.log("SESSION CHECK BODY:", req.body);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("ERROR in session-check:", err);
    res.status(500).json({ error: err.message });
  }
}
