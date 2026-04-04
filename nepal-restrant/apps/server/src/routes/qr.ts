import { Router, Request, Response } from "express";
import QRCode from "qrcode";

const router = Router();

const BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

// GET /api/qr/:tableId — generate QR code as PNG data URL
router.get("/:tableId", async (req: Request, res: Response) => {
  const tableId = parseInt(req.params.tableId);
  if (isNaN(tableId) || tableId < 1 || tableId > 5) {
    return res.status(400).json({ error: "Table ID must be between 1 and 5" });
  }

  const url = `${BASE_URL}/menu?table=${tableId}`;

  try {
    const format = req.query.format as string;

    if (format === "png") {
      // Return raw PNG image
      const buffer = await QRCode.toBuffer(url, {
        width: 400,
        margin: 2,
        color: { dark: "#1a1a1a", light: "#ffffff" },
      });
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename="table-${tableId}-qr.png"`);
      return res.send(buffer);
    }

    // Return data URL (default)
    const dataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    });

    return res.json({
      tableId,
      url,
      qrCode: dataUrl,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// GET /api/qr — generate all 5 QR codes
router.get("/", async (_req: Request, res: Response) => {
  const codes = await Promise.all(
    [1, 2, 3, 4, 5].map(async (tableId) => {
      const url = `${BASE_URL}/menu?table=${tableId}`;
      const qrCode = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: { dark: "#1a1a1a", light: "#ffffff" },
      });
      return { tableId, url, qrCode };
    })
  );
  return res.json(codes);
});

export default router;
