import { google } from "googleapis";
import { NextResponse } from "next/server";

const SPREADSHEET_ID = "1YQ2xoLyN4pXqhuicquJZGWbV6x7wy8vqeCQ5FT05g_0";

function convertDriveLinkToImageSrc(url: string): string {
  if (!url) return "";
  const idMatch = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
  }
  return url;
}

export async function fetchZoozooData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const RANGE = "paper!A2:J";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows.map((row, index) => {
      const togetherRaw = row[9] || "";
      const togetherImages = togetherRaw
        .split(",")
        .map((link: string) => convertDriveLinkToImageSrc(link.trim()))
        .filter(Boolean);

      return {
        id: `zoo-${index}`,
        title: row[1] || "Untitled",
        date: row[2] || null,
        difficulty: parseInt(row[3], 10) || 1,
        foldingTime: row[4] || "Unknown",
        note: row[5] || "",
        type: row[6] || "Uncategorized",
        mahi: convertDriveLinkToImageSrc(row[7]),
        aditya: convertDriveLinkToImageSrc(row[8]),
        together: togetherImages,
      };
    });
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    const data = await fetchZoozooData();
    if (!data) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
