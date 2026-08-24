function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxW, lh, maxLines = 2) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && words.length > lines.join(" ").split(/\s+/).length - 1) {
    let last = lines[maxLines - 1];
    if (ctx.measureText(last).width < maxW - 14) last += "…";
    lines[maxLines - 1] = last;
  }
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
}

function pill(ctx, text, cx, cy, fg, bg, font = "bold 12px") {
  ctx.font = `${font} 'Inter', 'Segoe UI', sans-serif`;
  const padX = 16;
  const w = ctx.measureText(text).width + padX * 2;
  const h = 30;
  ctx.fillStyle = bg;
  rr(ctx, cx - w / 2, cy - h / 2, w, h, 15);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, cy + 1);
  return w;
}

export function downloadTicketImage({ event, registration, qrCanvas }) {
  if (!event || !registration) return;

  const W = 640;
  const H = 760;
  const S = 2;
  const canvas = document.createElement("canvas");
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext("2d");
  ctx.scale(S, S);
  ctx.textBaseline = "alphabetic";

  const MARGIN = 24;
  ctx.fillStyle = "#eef0f8";
  rr(ctx, 0, 0, W, H, 24);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  rr(ctx, MARGIN / 2, MARGIN / 2, W - MARGIN, H - MARGIN, 18);
  ctx.fill();

  const cardX = MARGIN / 2;
  const cardW = W - MARGIN;

  const grad = ctx.createLinearGradient(cardX, 0, cardX + cardW, 170);
  grad.addColorStop(0, "#7c3aed");
  grad.addColorStop(1, "#4338ca");
  ctx.save();
  rr(ctx, cardX, MARGIN / 2, cardW, 170, 18);
  ctx.clip();
  ctx.fillStyle = grad;
  ctx.fillRect(cardX, MARGIN / 2, cardW, 170);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.arc(cardX + cardW - 40, 40, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "bold 11px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillText("C A M P U S H U B   •   E V E N T   P A S S", cardX + 26, MARGIN / 2 + 38);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 25px 'Inter', 'Segoe UI', sans-serif";
  wrapText(ctx, event.title, cardX + 26, MARGIN / 2 + 78, cardW - 52, 31, 2);

  ctx.font = "600 13px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(event.department || "", cardX + 26, MARGIN / 2 + 148);

  const bodyX = cardX + 30;
  const col2X = cardX + cardW / 2 + 10;
  let y = MARGIN / 2 + 210;

  const rows = [
    ["DATE", formatDateShort(event.date), bodyX],
    ["TIME", [event.time, event.endTime].filter(Boolean).join(" – ") || "—", col2X],
    ["VENUE", event.venue || "—", bodyX],
    ["ORGANIZER", event.department || "—", col2X],
  ];
  rows.forEach(([label, value], i) => {
    const x = i % 2 === 0 ? bodyX : col2X;
    if (i % 2 === 0 && i !== 0) y += 62;
    else if (i % 2 === 0) y = MARGIN / 2 + 210;
    drawField(ctx, label, value, x, y, cardW / 2 - 46);
  });

  y += 66;
  drawField(ctx, "STUDENT NAME", registration.studentName || "—", bodyX, y, cardW - 70);

  y += 58;
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillText("REGISTRATION ID", bodyX, y);
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 17px ui-monospace, 'Cascadia Mono', Consolas, monospace";
  ctx.fillText(registration.regId, bodyX, y + 24);

  y += 44;
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "#dbe0ec";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bodyX, y);
  ctx.lineTo(cardX + cardW - 30, y);
  ctx.stroke();
  ctx.setLineDash([]);

  const qrSize = 210;
  const qx = (W - qrSize) / 2;
  const qy = y + 26;
  if (qrCanvas) {
    try {
      ctx.drawImage(qrCanvas, qx, qy, qrSize, qrSize);
    } catch {
      /* ignore draw errors */
    }
  }
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  rr(ctx, qx - 10, qy - 10, qrSize + 20, qrSize + 20, 14);
  ctx.stroke();

  const checkedIn = registration.status === "Checked-in";
  pill(
    ctx,
    checkedIn ? "CHECKED-IN" : "CONFIRMED",
    W / 2,
    qy + qrSize + 42,
    checkedIn ? "#047857" : "#5b21b6",
    checkedIn ? "#d1fae5" : "#ede9fe"
  );

  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 11px 'Inter', 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    `Present this QR at the venue entry  •  ${formatDateShort(event.date)}`,
    W / 2,
    H - 36
  );

  canvas.toBlob((blob) => {
    const url = blob ? URL.createObjectURL(blob) : canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `CampusHub-Pass-${registration.regId}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (blob) URL.revokeObjectURL(url);
  }, "image/png");
}

function drawField(ctx, label, value, x, y, maxW) {
  ctx.textAlign = "left";
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px 'Inter', 'Segoe UI', sans-serif";
  ctx.fillText(label, x, y);
  ctx.fillStyle = "#1e293b";
  ctx.font = "600 15px 'Inter', 'Segoe UI', sans-serif";
  const text = String(value ?? "");
  if (ctx.measureText(text).width > maxW) {
    let cut = text;
    while (cut.length > 4 && ctx.measureText(cut + "…").width > maxW) {
      cut = cut.slice(0, -1);
    }
    ctx.fillText(cut + "…", x, y + 23);
  } else {
    ctx.fillText(text || "—", x, y + 23);
  }
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function formatDateShort(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
