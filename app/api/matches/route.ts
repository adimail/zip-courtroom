import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const SPREADSHEET_ID = "1YQ2xoLyN4pXqhuicquJZGWbV6x7wy8vqeCQ5FT05g_0";

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

export async function fetchMatches(year?: number) {
  const currentYear = new Date().getFullYear();
  const targetYear = year || currentYear;

  if (targetYear > currentYear) {
    throw new Error(`Cannot fetch data for future year: ${targetYear}`);
  }
  if (targetYear < 2025) {
    throw new Error(`No data available before 2025`);
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const RANGE = `${targetYear}!A2:E`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    const matchData = rows.map((row) => ({
      puzzleNo: row[0] || "???",
      aditya: parseTime(row[1]),
      mahi: parseTime(row[2]),
      prize: row[3] || null,
    }));

    return matchData;
  } catch (error: any) {
    if (error?.message?.includes("Unable to parse range")) {
      return [];
    }
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const yearParam = searchParams.get("year");
  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

  try {
    const data = await fetchMatches(year);
    if (!data) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
