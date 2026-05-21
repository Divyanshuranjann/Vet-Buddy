import { realtimeDb } from "@/firebase/firebase";
import { ref, set } from "firebase/database";

// Test function to write sample data to Realtime Database
export const testWriteRealtimeData = async () => {
  try {
    // Test appointment data
    await set(ref(realtimeDb, "appointments/test-apt-1"), {
      customerId: "cust-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+1-555-0100",
      petName: "Max",
      petType: "Dog",
      serviceType: "Checkup",
      appointmentDate: "2024-06-15",
      appointmentTime: "10:00",
      status: "confirmed",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Test chat data
    await set(ref(realtimeDb, "chats/test-chat-1"), {
      customerId: "cust-001",
      customerName: "John Doe",
      status: "open",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: {
        msg1: {
          sender: "customer",
          senderId: "cust-001",
          senderName: "John Doe",
          message: "Hello! I need help with my pet.",
          timestamp: Date.now(),
          isRead: false,
        },
      },
    });

    // Test notification data
    await set(ref(realtimeDb, "notifications/user-001/notif-1"), {
      userId: "user-001",
      type: "appointment",
      title: "Appointment Confirmed",
      message: "Your appointment with Max is confirmed for June 15 at 10:00 AM",
      isRead: false,
      timestamp: Date.now(),
    });

    // Test inventory data
    await set(ref(realtimeDb, "inventory/product-001"), {
      productId: "product-001",
      quantity: 100,
      lastUpdated: Date.now(),
    });

    // Test activity log
    await set(ref(realtimeDb, `activity_logs/${Date.now()}`), {
      userId: "admin-001",
      action: "test_write",
      description: "Testing realtime database write",
      details: {
        source: "test-utility",
      },
      timestamp: Date.now(),
    });

    console.log("✅ Test data written to Realtime Database successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error writing test data:", error);
    return false;
  }
};

// Test function to verify connection
export const testRealtimeConnection = async () => {
  try {
    await set(ref(realtimeDb, ".info/connected"), true);
    console.log("✅ Connected to Firebase Realtime Database!");
    return true;
  } catch (error) {
    console.error("❌ Cannot connect to Firebase Realtime Database:", error);
    return false;
  }
};
