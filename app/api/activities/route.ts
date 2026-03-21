import { google } from "googleapis";
import { NextResponse } from "next/server";

const SPREADSHEET_ID = "1YQ2xoLyN4pXqhuicquJZGWbV6x7wy8vqeCQ5FT05g_0";

export async function fetchActivities() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const RANGE = "list!A2:G";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows.map((row, index) => ({
      id: `act-${index}`,
      title: row[0] || "Untitled",
      date: row[1] || null,
      status: row[2] === "TRUE",
      notes: row[3] || "",
      location: row[4] || "",
      adityaComment: row[5] || "",
      mahiComment: row[6] || "",
    }));
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    const data = await fetchActivities();
    if (!data) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
