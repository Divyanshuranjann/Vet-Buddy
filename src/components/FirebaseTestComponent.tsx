"use client";

import { useEffect, useState } from "react";
import { testWriteRealtimeData, testRealtimeConnection } from "@/lib/firebase/testUtils";
import { listenToAppointments, listenToNotifications } from "@/lib/firebase";

export default function FirebaseTestComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Write test data
  const handleWriteTestData = async () => {
    setIsLoading(true);
    setStatus("Writing test data...");

    try {
      await testRealtimeConnection();
      const success = await testWriteRealtimeData();

      if (success) {
        setStatus("✅ Test data written successfully! Check Firebase console.");
      } else {
        setStatus("❌ Failed to write test data. Check console for errors.");
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    }

    setIsLoading(false);
  };

  // Listen to real-time updates
  useEffect(() => {
    const unsubscribeAppointments = listenToAppointments((apts) => {
      setAppointments(apts);
    });

    const unsubscribeNotifications = listenToNotifications("user-001", (notifs) => {
      setNotifications(notifs);
    });

    return () => {
      unsubscribeAppointments();
      unsubscribeNotifications();
    };
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">Firebase Realtime Database Test</h1>

        <button
          onClick={handleWriteTestData}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {isLoading ? "Writing..." : "Write Test Data to Realtime DB"}
        </button>

        {status && (
          <div className="mb-4 p-4 bg-gray-100 border-l-4 border-blue-600 rounded">
            <p className="font-mono text-sm">{status}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Appointments */}
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-xl font-bold mb-3">📅 Appointments ({appointments.length})</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="bg-white p-2 rounded text-xs border">
                    <p className="font-semibold">{apt.customerName}</p>
                    <p>Pet: {apt.petName} ({apt.petType})</p>
                    <p>
                      {apt.appointmentDate} at {apt.appointmentTime}
                    </p>
                    <p className="text-gray-600">Status: {apt.status}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs">No appointments found</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h2 className="text-xl font-bold mb-3">🔔 Notifications ({notifications.length})</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className="bg-white p-2 rounded text-xs border">
                    <p className="font-semibold">{notif.title}</p>
                    <p>{notif.message}</p>
                    <p className="text-gray-600">
                      Type: {notif.type} {notif.isRead ? "✓ Read" : "⚪ Unread"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs">No notifications found</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-bold mb-2">⚠️ If no data appears:</h3>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Check Firebase Console → Realtime Database → Rules tab</li>
            <li>Make sure the rules allow read/write (see instructions below)</li>
            <li>Refresh the page after updating rules</li>
            <li>Check browser console (F12) for errors</li>
          </ol>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold mb-2">🔧 Firebase Rules Setup:</h3>
          <p className="text-sm mb-3">
            Replace your Realtime Database rules with:
          </p>
          <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`{
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
}`}
          </pre>
          <p className="text-xs text-gray-600 mt-3">
            ⚠️ Note: Use these permissive rules for development only. 
            Implement proper authentication-based rules for production.
          </p>
        </div>
      </div>
    </div>
  );
}
