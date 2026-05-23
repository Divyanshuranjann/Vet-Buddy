import { getRealtimeDatabase } from "../config/firebase.js";
import { syncAppointmentToSheets, syncAllAppointmentsToSheets } from "./appointmentSyncService.js";

let appointmentsListener = null;

// Set up real-time listener for appointments
export const setupAppointmentsListener = async () => {
  try {
    const db = getRealtimeDatabase();
    const appointmentsRef = db.ref("appointments");

    appointmentsListener = appointmentsRef.on(
      "child_added",
      async (snapshot) => {
        const appointmentData = snapshot.val();
        const appointmentId = snapshot.key;

        const appointment = {
          id: appointmentId,
          ...appointmentData,
        };

        console.log("📍 New appointment detected, syncing to Google Sheets...");
        await syncAppointmentToSheets(appointment);
      },
      (error) => {
        console.error("❌ Error in appointments listener:", error.message);
      }
    );

    // Also listen for updates
    appointmentsRef.on(
      "child_changed",
      async (snapshot) => {
        const appointmentData = snapshot.val();
        const appointmentId = snapshot.key;

        const appointment = {
          id: appointmentId,
          ...appointmentData,
        };

        console.log("📍 Appointment updated, syncing to Google Sheets...");
        await syncAppointmentToSheets(appointment);
      },
      (error) => {
        console.error("❌ Error in appointments update listener:", error.message);
      }
    );

    console.log("✅ Appointments listener setup complete");
  } catch (error) {
    console.error("❌ Error setting up appointments listener:", error.message);
  }
};

// Sync all existing appointments on startup
export const syncExistingAppointments = async () => {
  try {
    const db = getRealtimeDatabase();
    const appointmentsRef = db.ref("appointments");

    const snapshot = await appointmentsRef.once("value");
    const appointmentsData = snapshot.val();

    if (!appointmentsData) {
      console.log("✅ No existing appointments to sync");
      return;
    }

    const appointments = Object.entries(appointmentsData).map(([id, data]) => ({
      id,
      ...data,
    }));

    await syncAllAppointmentsToSheets(appointments);
  } catch (error) {
    console.error("❌ Error syncing existing appointments:", error.message);
  }
};

// Clean up listener
export const stopAppointmentsListener = () => {
  if (appointmentsListener) {
    const db = getRealtimeDatabase();
    db.ref("appointments").off();
    console.log("✅ Appointments listener stopped");
  }
};

export default {
  setupAppointmentsListener,
  syncExistingAppointments,
  stopAppointmentsListener,
};
