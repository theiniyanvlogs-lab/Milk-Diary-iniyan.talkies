import fs from "fs";
import path from "path";

export default function handler(req, res) {

  const { pwd, device } = req.query;

  if (!pwd) {
    return res.status(200).json({ valid: false });
  }

  const filePath = path.join(process.cwd(), "data", "registry.json");
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const record = jsonData[pwd];

  // Password not found
  if (!record) {
    return res.status(200).json({ valid: false });
  }

  // Only allow paid passwords
  if (record.type !== "paid") {
    return res.status(200).json({ valid: false });
  }

  // Block if used on another device
  if (record.used && record.device && record.device !== device) {
    return res.status(200).json({
      valid: false,
      message: "Password already used on another device"
    });
  }

  return res.status(200).json({
    valid: true,
    used: record.used,
    device: record.device || ""
  });
}
