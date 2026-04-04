"use client";
import { useEffect, useState } from "react";
import { qrApi } from "@/lib/api";
import Image from "next/image";
import { Download, Printer, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface QRData {
  tableId: number;
  url: string;
  qrCode: string;
}

export default function AdminQRCodesPage() {
  const [qrCodes, setQrCodes] = useState<QRData[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    qrApi.getAll().then((res) => {
      setQrCodes(res.data);
      setLoading(false);
    }).catch(() => {
      toast.error("Failed to load QR codes");
      setLoading(false);
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (tableId: number) => {
    const url = qrApi.downloadPng(tableId);
    const a = document.createElement("a");
    a.href = url;
    a.download = `haveli-table-${tableId}-qr.png`;
    a.click();
    toast.success(`QR code for Table ${tableId} downloading...`);
  };

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-2 md:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary">QR Codes</h1>
          <p className="text-text-muted text-sm mt-1">
            Scan any QR code to open the menu for that table
          </p>
        </div>
        <button
          id="print-all-qr-btn"
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-background font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Printer size={18} />
          Print All
        </button>
      </div>

      {/* QR grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 print:grid-cols-5">
        {qrCodes.map((qr) => (
          <div
            key={qr.tableId}
            id={`qr-table-${qr.tableId}`}
            className="bg-surface rounded-3xl border border-border p-6 flex flex-col items-center gap-4 hover:border-accent/40 transition-colors print:border-black/20"
          >
            {/* Table label */}
            <div className="text-center">
              <p className="text-xs text-text-muted uppercase tracking-widest">Table</p>
              <p className="font-serif text-4xl font-bold text-gradient-gold">{qr.tableId}</p>
            </div>

            {/* QR code image */}
            <div className="w-40 h-40 bg-white rounded-2xl p-2 shadow-card">
              <img
                src={qr.qrCode}
                alt={`QR code for Table ${qr.tableId}`}
                className="w-full h-full"
              />
            </div>

            {/* URL */}
            <p className="text-xs text-text-muted text-center break-all px-2 font-mono">
              {qr.url}
            </p>

            {/* Actions */}
            <div className="flex gap-2 w-full print:hidden">
              <button
                id={`download-qr-${qr.tableId}`}
                onClick={() => handleDownload(qr.tableId)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-accent/30 text-accent text-xs hover:bg-accent/10 transition-colors"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-surface rounded-2xl border border-border">
        <h2 className="font-semibold text-text-primary mb-3">How to Use QR Codes</h2>
        <ol className="space-y-2 text-sm text-text-muted list-decimal list-inside">
          <li>Print each QR code and place it on the corresponding table</li>
          <li>Customers scan the QR code with their phone camera</li>
          <li>The menu opens automatically with their table number detected</li>
          <li>Customers add items and place their order directly from their phone</li>
          <li>You'll receive their order here in real-time</li>
        </ol>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
          .noise-overlay { display: none !important; }
        }
      `}</style>
    </div>
  );
}
