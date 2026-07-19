import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "74px", color: "#f4f0e6", background: "#07101f", fontFamily: "Arial" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 27, fontWeight: 700 }}><div style={{ width: 42, height: 42, borderRadius: 12, border: "2px solid #d5ad62", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0d89e" }}>CF</div>ClientFlow</div>
      <div style={{ display: "flex", flexDirection: "column" }}><span style={{ color: "#d5ad62", letterSpacing: 5, fontSize: 18 }}>CLIENT DELIVERY, WITHOUT THE CHAOS</span><strong style={{ marginTop: 24, maxWidth: 940, fontSize: 72, lineHeight: 1.05, letterSpacing: -3 }}>Give every client a clear view of the work.</strong></div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#9ba5b7", fontSize: 21 }}><span>Interactive full-stack portfolio case study</span><span>Built by John Venancio</span></div>
    </div>,
    size,
  );
}
