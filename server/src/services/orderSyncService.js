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

    console.log("✅ Google Sheets Auth initialized for Orders");
    return true;
  } catch (error) {
    console.error("❌ Error initializing Google Sheets auth for Orders:", error.message);
    return false;
  }
};

// Format order data for Google Sheets
const formatOrderRow = (order) => {
  // Handle address object - convert to string
  const shippingAddress = order.shippingAddress
    ? `${order.shippingAddress.line1 || ""}, ${order.shippingAddress.line2 || ""}, ${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""} ${order.shippingAddress.pincode || ""}`.trim()
    : "";

  // Format items - using correct field names
  const itemsText = order.items
    ? order.items.map((item) => `${item.name} (${item.quantity}x)`).join("; ")
    : "";

  return [
    order.id || order.orderId || "",
    order.customerName || "",
    order.customerEmail || "",  // ✅ FIXED
    order.customerPhone || "",  // ✅ FIXED
    itemsText,  // ✅ FIXED - uses "name" not "productName"
    order.totalAmount || 0,  // ✅ FIXED
    order.status || "pending",
    order.paymentMethod || "upi",  // Changed from paymentStatus
    shippingAddress,  // ✅ FIXED - uses shippingAddress
    order.createdAt
      ? new Date(order.createdAt).toLocaleString("en-IN")
      : "",
    order.updatedAt
      ? new Date(order.updatedAt).toLocaleString("en-IN")
      : "",
  ];
};

// Add or update order in Google Sheets
export const syncOrderToSheets = async (order) => {
  try {
    if (!auth) {
      const initialized = await initializeAuth();
      if (!initialized) return false;
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_ORDERS_ID;
    if (!spreadsheetId) {
      console.warn("⚠️  Orders spreadsheet ID not configured");
      return false;
    }

    // Check if order already exists in sheet
    const existingRows = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet1!A:A",
    });

    const orderExists = existingRows.data.values?.some((row) => row[0] === order.id);

    const row = formatOrderRow(order);

    if (orderExists) {
      // Update existing row
      const rowIndex = existingRows.data.values?.findIndex((row) => row[0] === order.id);

      await sheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `Sheet1!A${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [row],
        },
      });

      console.log(`📝 Updated order ${order.id} in Google Sheets`);
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

      console.log(`✅ Added order ${order.id} to Google Sheets`);
    }

    return true;
  } catch (error) {
    console.error("❌ Error syncing order to Google Sheets:", error.message);
    return false;
  }
};

// Sync all orders to sheets
export const syncAllOrdersToSheets = async (orders) => {
  try {
    if (!auth) {
      const initialized = await initializeAuth();
      if (!initialized) return false;
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_ORDERS_ID;
    if (!spreadsheetId) {
      console.warn("⚠️  Orders spreadsheet ID not configured");
      return false;
    }

    // Clear existing data (keep header)
    await sheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: "Sheet1!A2:K1000",
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
            "Order ID",
            "Customer Name",
            "Email",
            "Phone",
            "Items",
            "Total Amount",
            "Status",
            "Payment Status",
            "Shipping Address",
            "Created At",
            "Updated At",
          ],
        ],
      },
    });

    // Add all orders
    if (orders.length > 0) {
      const rows = orders.map(formatOrderRow);
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

    console.log(`✅ Synced ${orders.length} orders to Google Sheets`);
    return true;
  } catch (error) {
    console.error("❌ Error syncing all orders to Google Sheets:", error.message);
    return false;
  }
};

export default {
  initializeAuth,
  syncOrderToSheets,
  syncAllOrdersToSheets,
};
