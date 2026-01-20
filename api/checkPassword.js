import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const pwd = req.query.pwd;

  const filePath = path.join(process.cwd(), "data", "registry.json");
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!jsonData[pwd]) {
    return res.status(200).json({ valid: false });
  }

  const record = jsonData[pwd];

  return res.status(200).json({
    valid: true,
    type: record.type || "trial",
    used: record.used,
    device: record.device || ""
  });
}
