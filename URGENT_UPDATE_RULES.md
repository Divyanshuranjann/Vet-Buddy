# Update Your Firebase Rules NOW

## Your Current Rules (BLOCKED):
```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

❌ This blocks ALL reads and writes!

---

## Replace With This (DEVELOPMENT):
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

✅ This allows your app to read/write data!

---

## Step-by-Step Instructions:

1. Go to https://console.firebase.google.com/
2. Click on your project: **vet-buddy-ab66d**
3. In the left sidebar, click **Realtime Database**
4. Click the **Rules** tab at the top
5. **Select ALL** the text in the editor (Ctrl+A)
6. **Delete** it
7. **Copy & Paste** the replacement JSON above
8. Click the **Publish** button (blue button on right)
9. Wait for the green checkmark ✅

---

## After Publishing Rules:

1. Go to `http://localhost:3000/test-firebase` (if running `npm run dev`)
2. Click **"Write Test Data to Realtime DB"** button
3. Go to Firebase Console → Realtime Database → **Data** tab
4. You should now see your data! 🎉

---

## ⚠️ IMPORTANT for Production:

The rules above are for **development only**. Never use in production!

For production, use authentication-based rules (see FIREBASE_REALTIME_SETUP.md)

---
