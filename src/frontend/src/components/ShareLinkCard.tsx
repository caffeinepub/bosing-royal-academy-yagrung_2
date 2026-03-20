import { Download } from "lucide-react";
import { useRef } from "react";

interface ShareLinkCardProps {
  schoolName: string;
  siteUrl: string;
}

export default function ShareLinkCard({
  schoolName,
  siteUrl,
}: ShareLinkCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const W = 1200;
    const H = 630;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient (deep navy)
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#0f1e3d");
    grad.addColorStop(1, "#1a3a6e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Gold accent bar top
    ctx.fillStyle = "#d97706";
    ctx.fillRect(0, 0, W, 10);
    // Gold accent bar bottom
    ctx.fillRect(0, H - 10, W, 10);

    // Subtle circle decoration
    ctx.beginPath();
    ctx.arc(W - 80, H / 2, 260, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(217,119,6,0.15)";
    ctx.lineWidth = 60;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(80, H / 2, 180, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(217,119,6,0.1)";
    ctx.lineWidth = 40;
    ctx.stroke();

    // "Official Website" label
    ctx.fillStyle = "#fcd34d";
    ctx.font = "bold 28px Georgia, serif";
    ctx.letterSpacing = "8px";
    ctx.textAlign = "center";
    ctx.fillText("OFFICIAL WEBSITE", W / 2, 130);

    // School name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 68px Georgia, serif";
    ctx.textAlign = "center";
    // Word wrap for long names
    const words = schoolName.toUpperCase().split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      const test = currentLine ? `${currentLine} ${word}` : word;
      ctx.font = "bold 68px Georgia, serif";
      if (ctx.measureText(test).width > W - 120) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = test;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineH = 80;
    const startY = H / 2 - ((lines.length - 1) * lineH) / 2 - 20;
    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, startY + i * lineH);
    });

    // Divider
    ctx.fillStyle = "#d97706";
    ctx.fillRect(W / 2 - 60, startY + lines.length * lineH + 16, 120, 4);

    // URL pill
    const urlY = startY + lines.length * lineH + 70;
    const pillW = Math.min(ctx.measureText(siteUrl).width + 80, W - 120);
    const pillH = 64;
    const pillX = W / 2 - pillW / 2;
    ctx.beginPath();
    ctx.roundRect(pillX, urlY - pillH / 2, pillW, pillH, 32);
    ctx.fillStyle = "rgba(217,119,6,0.25)";
    ctx.fill();
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#fcd34d";
    ctx.font = "bold 32px monospace";
    ctx.textAlign = "center";
    ctx.fillText(siteUrl, W / 2, urlY + 12);

    // Save
    const link = document.createElement("a");
    link.download = `${schoolName.replace(/\s+/g, "-")}-website.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-amber-600 mb-2">
          Share Our Website
        </p>
        <h2 className="font-serif text-2xl font-bold text-gray-900 uppercase mb-2">
          Download Link as Image
        </h2>
        <div className="w-12 h-1 bg-amber-600 mx-auto mb-8" />

        {/* Preview card */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl mb-6"
          style={{
            background: "linear-gradient(135deg, #0f1e3d 0%, #1a3a6e 100%)",
            minHeight: 220,
          }}
        >
          {/* Top accent */}
          <div className="h-2 w-full bg-amber-600" />

          {/* Decorative circles */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-[20px] border-amber-600/20 translate-x-1/3" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-[14px] border-amber-600/10 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col items-center justify-center py-10 px-6 text-center">
            <p className="text-amber-300 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Official Website
            </p>
            <h3 className="font-serif text-white text-xl md:text-3xl font-bold uppercase tracking-wide mb-3">
              {schoolName}
            </h3>
            <div className="w-12 h-0.5 bg-amber-500 mb-4" />
            <div className="px-6 py-2 rounded-full border border-amber-500 bg-amber-600/20">
              <span className="text-amber-300 font-mono text-sm md:text-base font-bold">
                {siteUrl}
              </span>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-2 w-full bg-amber-600" />
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest rounded-full shadow-lg transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Download Image
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Save this image and share it on WhatsApp, Facebook, or anywhere.
        </p>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
}
