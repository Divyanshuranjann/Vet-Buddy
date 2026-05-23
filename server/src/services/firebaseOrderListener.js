import { getRealtimeDatabase } from "../config/firebase.js";
import { syncOrderToSheets, syncAllOrdersToSheets } from "../services/orderSyncService.js";

let ordersListener = null;

// Set up real-time listener for orders from Realtime Database
export const setupOrdersListener = async () => {
  try {
    console.log("🔍 Setting up orders listener (Realtime Database)...");
    
    const db = getRealtimeDatabase();
    const ordersRef = db.ref("orders");

    console.log("📡 Attaching child_added listener...");

    // Listen to new orders
    ordersRef.on(
      "child_added",
      async (snapshot) => {
        try {
          const orderId = snapshot.key;
          const orderData = snapshot.val();

          console.log("🎯 child_added event triggered!");
          console.log("Order ID:", orderId);
          console.log("Order Data:", JSON.stringify(orderData, null, 2));

          if (!orderId || !orderData) {
            console.warn("⚠️ Invalid order snapshot");
            return;
          }

          console.log("📦 New order detected, syncing to Google Sheets...");

          // Normalize order data to match Google Sheets schema
          const normalizedOrder = {
            id: orderId,
            orderId: orderData.orderId || orderId,
            customerId: orderData.customerId || "",
            customerName: orderData.customerName || "",
            customerEmail: orderData.customerEmail || "",
            customerPhone: orderData.customerPhone || "",
            items: orderData.items || [],
            shippingAddress: orderData.shippingAddress || {},
            subtotal: orderData.subtotal || 0,
            tax: orderData.tax || 0,
            deliveryCharge: orderData.deliveryCharge || 0,
            totalAmount: orderData.totalAmount || 0,
            couponCode: orderData.couponCode || "",
            status: orderData.status || "pending",
            paymentMethod: orderData.paymentMethod || "upi",
            createdAt: orderData.createdAt || Date.now(),
            updatedAt: orderData.updatedAt || Date.now(),
          };

          console.log("📊 Calling syncOrderToSheets with normalized data...");

          // Sync to Google Sheets
          const syncResult = await syncOrderToSheets(normalizedOrder);
          
          if (syncResult) {
            console.log(`✅ Order ${orderId} synced to Google Sheets`);
          } else {
            console.error(`❌ Failed to sync order ${orderId}`);
          }
        } catch (error) {
          console.error("❌ Error in child_added handler:", error.message);
          console.error("Stack:", error.stack);
        }
      },
      (error) => {
        console.error("❌ Error in orders listener (child_added):", error.message);
      }
    );

    // Listen for order updates
    ordersRef.on(
      "child_changed",
      async (snapshot) => {
        try {
          const orderId = snapshot.key;
          const orderData = snapshot.val();

          console.log("🔄 child_changed event triggered for order:", orderId);

          if (!orderId || !orderData) return;

          console.log("📦 Order updated, syncing to Google Sheets...");

          const normalizedOrder = {
            id: orderId,
            orderId: orderData.orderId || orderId,
            customerId: orderData.customerId || "",
            customerName: orderData.customerName || "",
            customerEmail: orderData.customerEmail || "",
            customerPhone: orderData.customerPhone || "",
            items: orderData.items || [],
            shippingAddress: orderData.shippingAddress || {},
            subtotal: orderData.subtotal || 0,
            tax: orderData.tax || 0,
            deliveryCharge: orderData.deliveryCharge || 0,
            totalAmount: orderData.totalAmount || 0,
            couponCode: orderData.couponCode || "",
            status: orderData.status || "pending",
            paymentMethod: orderData.paymentMethod || "upi",
            createdAt: orderData.createdAt || Date.now(),
            updatedAt: orderData.updatedAt || Date.now(),
          };

          const syncResult = await syncOrderToSheets(normalizedOrder);
          
          if (syncResult) {
            console.log(`✅ Updated order ${orderId} synced to Google Sheets`);
          } else {
            console.error(`❌ Failed to sync updated order ${orderId}`);
          }
        } catch (error) {
          console.error("❌ Error in child_changed handler:", error.message);
        }
      },
      (error) => {
        console.error("❌ Error in orders listener (child_changed):", error.message);
      }
    );

    console.log("✅ Orders listener setup complete");
  } catch (error) {
    console.error("❌ Error setting up orders listener:", error.message);
  }
};

// Sync all existing orders on startup
export const syncExistingOrders = async () => {
  try {
    console.log("📊 Syncing existing orders from Realtime Database...");
    
    const db = getRealtimeDatabase();
    const ordersRef = db.ref("orders");

    const snapshot = await ordersRef.get();

    if (!snapshot.exists()) {
      console.log("✅ No existing orders to sync");
      return;
    }

    const ordersData = snapshot.val();
    const orders = Object.entries(ordersData).map(([id, data]) => ({
      id,
      ...data,
    }));

    console.log(`Found ${orders.length} existing orders`);

    if (orders.length > 0) {
      await syncAllOrdersToSheets(orders);
      console.log(`✅ Synced ${orders.length} existing orders to Google Sheets`);
    }
  } catch (error) {
    console.error("❌ Error syncing existing orders:", error.message);
  }
};

// Clean up listener
export const stopOrdersListener = () => {
  if (ordersListener) {
    const db = getRealtimeDatabase();
    db.ref("orders").off();
    console.log("✅ Orders listener stopped");
  }
};

export default {
  setupOrdersListener,
  syncExistingOrders,
  stopOrdersListener,
};