import { google } from "googleapis";
import { NextResponse } from "next/server";
import path from "path";

const SPREADSHEET_ID = "1YQ2xoLyN4pXqhuicquJZGWbV6x7wy8vqeCQ5FT05g_0";
const RANGE = "Sheet1!A2:D";

const parseTime = (timeStr: string | undefined | null) => {
  if (!timeStr || timeStr.trim() === "-" || timeStr.trim() === "") {
    return null;
  }

  try {
    const parts = timeStr.split(":");
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      return minutes * 60 + seconds;
    }
  } catch (e) {
    return null;
  }
  return null;
};

export async function fetchMatches() {
  try {
    const keyFilePath = path.join(process.cwd(), "credentials.json");

    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    const matchData = rows.map((row) => ({
      date: row[0] || "Unknown Date",
      puzzleNo: row[1] || "???",
      aditya: parseTime(row[2]),
      mahi: parseTime(row[3]),
    }));

    return matchData;
  } catch (error) {
    console.error("Error fetching matches:", error);
    return null;
  }
}

export async function GET() {
  const data = await fetchMatches();
  if (!data) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
  return NextResponse.json(data);
}
