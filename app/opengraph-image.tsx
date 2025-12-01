import { ImageResponse } from "next/og";
import { MOCK_API_DATA, processMatches } from "@/lib/courtroom";
import { fetchMatches } from "@/app/api/matches/route";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const alt = "Zip Courtroom Official Verdict";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  let rawData = await fetchMatches();
  if (!rawData || rawData.length === 0) {
    rawData = MOCK_API_DATA;
  }

  const matches = processMatches(rawData);
  const latestMatch = matches[matches.length - 1];

  if (!latestMatch) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "white",
            background: "black",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Court is in session...
        </div>
      ),
      { ...size }
    );
  }

  const primaryQuote = latestMatch.quotes[0];
  const secondaryQuote = latestMatch.quotes[1] || "Justice served.";

  const serifFontData = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/PlayfairDisplay-Bold.ttf")
  );

  const sansFontData = fs.readFileSync(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf"));

  const getVerdictChar = () => {
    switch (latestMatch.winner) {
      case "aditya":
        return "A";
      case "mahi":
        return "M";
      case "tie":
        return "T";
      case "draw":
        return "D";
      default:
        return "?";
    }
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1C1C1C",
          color: "#EBE8E1",
          fontFamily: '"Playfair Display"',
          position: "relative",
          padding: "40px",
        }}
      >
        <svg
          width="500"
          height="500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#EBE8E1"
          strokeWidth="0.5"
          style={{
            position: "absolute",
            opacity: 0.05,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <path d="M12 3v18" />
          <path d="m6 6 12 12" />
          <path d="m6 18 12-12" />
          <path d="M6 6h12" />
          <path d="M6 18h12" />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "4px solid rgba(235, 232, 225, 0.3)",
            padding: "40px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10" />
              <path d="m16 16 6-6" />
              <path d="m8 8 6-6" />
              <path d="m9 7 8 8" />
              <path d="m21 11-8-8" />
            </svg>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginTop: "10px",
              }}
            >
              <div
                style={{ display: "flex", width: "40px", height: "1px", background: "#D97706" }}
              />
              <div
                style={{
                  display: "flex",
                  fontFamily: '"Inter"',
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#F59E0B",
                  textTransform: "uppercase",
                }}
              >
                Judicial Finding • Case #{latestMatch.puzzleNo}
              </div>
              <div
                style={{ display: "flex", width: "40px", height: "1px", background: "#D97706" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "20px",
              maxWidth: "900px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "56px",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#EBE8E1",
              }}
            >
              {primaryQuote}
            </div>

            <div
              style={{
                display: "flex",
                width: "60%",
                height: "1px",
                background: "rgba(235, 232, 225, 0.2)",
                margin: "20px 0",
              }}
            />

            <div
              style={{
                display: "flex",
                fontFamily: '"Inter"',
                fontSize: "24px",
                fontStyle: "italic",
                color: "#9CA3AF",
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              &quot;{secondaryQuote}&quot;
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              borderTop: "1px solid #374151",
              paddingTop: "20px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: '"Inter"',
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: "#6B7280",
                textTransform: "uppercase",
              }}
            >
              Judge: Master Oogway
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: '"Inter"',
                fontSize: "14px",
                letterSpacing: "0.1em",
                color: "#6B7280",
                textTransform: "uppercase",
              }}
            >
              {latestMatch.date}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "140px",
              height: "140px",
              border: "4px solid #B45309",
              borderRadius: "50%",
              transform: "rotate(12deg)",
              opacity: 0.8,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "130px",
                height: "130px",
                border: "1px solid #B45309",
                borderRadius: "50%",
                color: "#B45309",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                lineHeight: 1.2,
              }}
            >
              <div style={{ display: "flex" }}>Official</div>
              <div style={{ display: "flex" }}>Verdict</div>
              <div style={{ display: "flex", fontSize: "24px", marginTop: "5px" }}>
                {getVerdictChar()}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: serifFontData,
          style: "normal",
          weight: 700,
        },
        {
          name: "Inter",
          data: sansFontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
