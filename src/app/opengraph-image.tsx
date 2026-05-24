import { ImageResponse } from "next/og";

export const alt = "Fajicat — Comodidad para tu mascota";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ee7f1a 0%, #8dbf3c 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 800 }}>Fajicat</div>
        <div style={{ fontSize: 44, marginTop: 8 }}>
          Fajas postquirúrgicas para tu mascota
        </div>
        <div style={{ fontSize: 28, marginTop: 28, opacity: 0.92 }}>
          Animal Health · Medellín, Colombia
        </div>
      </div>
    ),
    { ...size },
  );
}
