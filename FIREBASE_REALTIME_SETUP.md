# Firebase Realtime Database Setup Guide

## Problem: Data Not Showing in Realtime Database

If your data is not appearing in the Firebase Realtime Database console, follow these steps:

---

## ✅ Step 1: Update Firebase Realtime Database Rules

Your database needs proper security rules to allow reads and writes.

### How to Update Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project **"vet-buddy-ab66d"**
3. Go to **Realtime Database** from the left sidebar
4. Click on the **"Rules"** tab
5. Replace the existing rules with this:

```json
{
  "rules": {
    ".read": true,
    ".write": true,
    "appointments": {
      ".indexOn": ["customerId", "status", "appointmentDate"]
    },
    "chats": {
      ".indexOn": ["customerId", "status"]
    },
    "notifications": {
      ".indexOn": ["userId"]
    },
    "activity_logs": {
      ".indexOn": ["userId", "action"]
    },
    "inventory": {
      ".indexOn": ["productId"]
    }
  }
}
```

6. Click **"Publish"** button

---

## ✅ Step 2: Test the Connection

After updating rules:

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/test-firebase`
3. Click the button **"Write Test Data to Realtime DB"**
4. Check Firebase Console - you should see data in the **"Data"** tab

---

## ✅ Step 3: Verify Data Structure

After clicking the test button, you should see:

```
├── appointments/
│   └── test-apt-1
├── chats/
│   └── test-chat-1
├── notifications/
│   └── user-001/
│       └── notif-1
├── inventory/
│   └── product-001
└── activity_logs/
    └── [timestamp]
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "Permission Denied" Error
**Solution:** Make sure you published the updated rules in the Firebase Console

### Issue 2: Database URL Wrong
**Solution:** Verify your `databaseURL` in `src/firebase/firebase.js`:
- Should be: `https://vet-buddy-ab66d-default-rtdb.firebaseio.com`
- If different, update it

### Issue 3: Still No Data Appearing
**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Check if `.write` permission is `true` in your rules

---

## 📝 Using the Services in Your Code

Once rules are set up, use any service to write data:

```typescript
import { createAppointment, sendMessage, createNotification } from "@/lib/firebase";

// Create appointment
const appointmentId = await createAppointment({
  customerId: "cust-123",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+1-555-0100",
  petName: "Max",
  petType: "Dog",
  serviceType: "Checkup",
  appointmentDate: "2024-06-15",
  appointmentTime: "10:00",
  status: "pending"
});

// Send chat message
await sendMessage(chatId, {
  sender: "customer",
  senderId: "user-123",
  senderName: "John",
  message: "Hello!",
  timestamp: Date.now()
});

// Create notification
await createNotification({
  userId: "user-123",
  type: "order",
  title: "Order Shipped",
  message: "Your order is on the way!",
  isRead: false
});
```

---

## 🔐 Security Rules for Production

The above rules are **permissive** and suitable for development only. For production, use:

```json
{
  "rules": {
    "appointments": {
      ".read": "auth != null",
      ".write": "auth != null && (root.child('admins').child(auth.uid).exists() || root.child('customers').child(auth.uid).child('id').val() == $appointmentId)",
      ".indexOn": ["customerId", "status", "appointmentDate"]
    },
    "chats": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["customerId", "status"]
    },
    "notifications": {
      "$userId": {
        ".read": "auth.uid == $userId",
        ".write": "auth.uid == $userId || root.child('admins').child(auth.uid).exists()",
        ".indexOn": ["userId"]
      }
    },
    "activity_logs": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": "root.child('admins').child(auth.uid).exists()",
      ".indexOn": ["userId", "action"]
    },
    "inventory": {
      ".read": true,
      ".write": "root.child('admins').child(auth.uid).exists()",
      ".indexOn": ["productId"]
    }
  }
}
```

---

## ✨ Real-time Listening

To listen to data changes in real-time:

```typescript
import { listenToAppointments, listenToMessages, listenToNotifications } from "@/lib/firebase";

// Listen to all appointments
const unsubscribe = listenToAppointments((appointments) => {
  console.log("Appointments updated:", appointments);
});

// Listen to chat messages
const unsubscribeChat = listenToMessages(chatId, (messages) => {
  console.log("New messages:", messages);
});

// Listen to notifications
const unsubscribeNotif = listenToNotifications("user-123", (notifications) => {
  console.log("Notifications:", notifications);
});

// Unsubscribe when component unmounts
return () => {
  unsubscribe();
  unsubscribeChat();
  unsubscribeNotif();
};
```

---

## 📞 Need Help?

1. Check Firebase Console → Realtime Database → "Usage" tab for any errors
2. Open browser console (F12) and check for JavaScript errors
3. Verify databaseURL is correct
4. Make sure rules are published (green checkmark)

---
