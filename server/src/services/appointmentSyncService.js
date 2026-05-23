import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sheets = google.sheets("v4");

let auth = null;

// Initialize Google Auth
const initializeAuth = async () => {
  try {
    const credentialsPath = path.join(
      process.cwd(),
      process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || "./credentials/google-sheets-credentials.json"
    );

    if (!fs.existsSync(credentialsPath)) {
      console.warn("⚠️  Google Sheets credentials not found. Sync disabled.");
      return false;
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    console.log("✅ Google Sheets Auth initialized");
    return true;
  } catch (error) {
    console.error("❌ Error initializing Google Sheets auth:", error.message);
    return false;
  }
};

// Format appointment data for Google Sheets
const formatAppointmentRow = (appointment) => {
  return [
    appointment.id || "",
    appointment.customerName || "",
    appointment.customerEmail || "",
    appointment.customerPhone || "",
    appointment.petName || "",
    appointment.petType || "",
    appointment.serviceType || "",
    appointment.appointmentDate || "",
    appointment.appointmentTime || "",
    appointment.status || "pending",
    appointment.notes || "",
    new Date(appointment.createdAt || 0).toLocaleString("en-IN"),
    new Date(appointment.updatedAt || 0).toLocaleString("en-IN"),
  ];
};

// Add or update appointment in Google Sheets
export const syncAppointmentToSheets = async (appointment) => {
  try {
    if (!auth) {
      const initialized = await initializeAuth();
      if (!initialized) return false;
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_APPOINTMENTS_ID;
    if (!spreadsheetId) {
      console.warn("⚠️  Appointments spreadsheet ID not configured");
      return false;
    }

    // Check if appointment already exists in sheet
    const existingRows = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet1!A:A",
    });

    const appointmentExists = existingRows.data.values?.some(
      (row) => row[0] === appointment.id
    );

    const row = formatAppointmentRow(appointment);

    if (appointmentExists) {
      // Update existing row
      const rowIndex = existingRows.data.values?.findIndex(
        (row) => row[0] === appointment.id
      );

      await sheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `Sheet1!A${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [row],
        },
      });

      console.log(`📝 Updated appointment ${appointment.id} in Google Sheets`);
    } else {
      // Add new row
      await sheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [row],
        },
      });

      console.log(`✅ Added appointment ${appointment.id} to Google Sheets`);
    }

    return true;
  } catch (error) {
    console.error("❌ Error syncing appointment to Google Sheets:", error.message);
    return false;
  }
};

// Sync all appointments to sheets
export const syncAllAppointmentsToSheets = async (appointments) => {
  try {
    if (!auth) {
      const initialized = await initializeAuth();
      if (!initialized) return false;
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_APPOINTMENTS_ID;
    if (!spreadsheetId) {
      console.warn("⚠️  Appointments spreadsheet ID not configured");
      return false;
    }

    // Clear existing data (keep header)
    await sheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: "Sheet1!A2:M1000",
    });

    // Add headers
    await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            "Appointment ID",
            "Customer Name",
            "Email",
            "Phone",
            "Pet Name",
            "Pet Type",
            "Service Type",
            "Date",
            "Time",
            "Status",
            "Notes",
            "Created At",
            "Updated At",
          ],
        ],
      },
    });

    // Add all appointments
    if (appointments.length > 0) {
      const rows = appointments.map(formatAppointmentRow);
      await sheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: rows,
        },
      });
    }

    console.log(`✅ Synced ${appointments.length} appointments to Google Sheets`);
    return true;
  } catch (error) {
    console.error("❌ Error syncing all appointments to Google Sheets:", error.message);
    return false;
  }
};

export default {
  initializeAuth,
  syncAppointmentToSheets,
  syncAllAppointmentsToSheets,
};
