// Firebase Cloud Functions for QR Registration System
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const sgMail = require("@sendgrid/mail");
const QRCode = require("qrcode");

// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid with API key
sgMail.setApiKey(functions.config().sendgrid.apikey);

// Function to send QR code by email
exports.sendQrCodeByEmail = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function"
    );
  }

  try {
    const { uid, registrationId } = data;
    
    // Verify user exists and has permission
    const userRecord = await admin.auth().getUser(context.auth.uid);
    
    // Check if this is the user's own QR code or an admin
    const isAdmin = await isUserAdmin(context.auth.uid);
    const isOwner = context.auth.uid === uid;
    
    if (!isAdmin && !isOwner) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You don't have permission to send this QR code"
      );
    }

    // Get user data from Firestore
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "User not found"
      );
    }
    
    const userData = userDoc.data();
    
    // Check if user has QR data
    if (!userData.registrationId || userData.registrationId !== registrationId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid registration ID"
      );
    }
    
    // Create QR code data
    const qrData = JSON.stringify({
      regId: userData.registrationId,
      name: userData.name,
      email: userData.email,
      timestamp: Date.now()
    });
    
    // Generate QR code as data URL
    const qrCodeImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300
    });
    
    // Send email with QR code
    const msg = {
      to: userData.email,
      from: {
        email: functions.config().email.sender || "noreply@example.com",
        name: functions.config().email.name || "QR Registration System"
      },
      subject: "Your Event QR Code",
      text: `Hello ${userData.name},\n\nThank you for registering for the event! Attached is your QR code for check-in.\n\nRegistration ID: ${userData.registrationId}\n\nPlease bring this QR code with you to the event for check-in.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Your Event QR Code</h2>
          <p>Hello ${userData.name},</p>
          <p>Thank you for registering for the event! Below is your QR code for check-in.</p>
          <div style="text-align: center; margin: 30px 0;">
            <img src="${qrCodeImage}" alt="QR Code" style="max-width: 300px; height: auto;" />
            <p style="margin-top: 10px; font-size: 14px; color: #666;">Registration ID: ${userData.registrationId}</p>
          </div>
          <p>Please bring this QR code with you to the event for check-in.</p>
          <p>If you have any questions, please contact us.</p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">This is an automated email, please do not reply.</p>
        </div>
      `
    };
    
    await sgMail.send(msg);
    
    // Update user document to track email sent
    await admin.firestore().collection("users").doc(uid).update({
      qrCodeEmailSent: true,
      qrCodeEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, message: "QR code email sent successfully" };
  } catch (error) {
    console.error("Error sending QR code email:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send QR code email",
      error.message
    );
  }
});

// Function to verify phone number with OTP
exports.verifyPhoneNumber = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function"
    );
  }

  try {
    const { phoneNumber } = data;
    
    // Validate phone number
    if (!phoneNumber || !/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      throw new functions.https.HttpsError(A
        "invalid-argument",
        "Phone number must be in E.164 format (e.g., +12065551234)"
      );
    }
    
    // Check if phone is already registered
    const phoneInUse = await isPhoneInUse(phoneNumber, context.auth.uid);
    if (phoneInUse) {
      throw new functions.https.HttpsError(
        "already-exists",
        "This phone number is already in use by another account"
      );
    }
    
    // Update user's phone number
    await admin.firestore().collection("users").doc(context.auth.uid).update({
      phone: phoneNumber,
      phoneVerificationStarted: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, message: "Phone verification initiated" };
  } catch (error) {
    console.error("Error verifying phone number:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to verify phone number",
      error.message
    );
  }
});

// Function to confirm phone verification is complete
exports.confirmPhoneVerification = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function"
    );
  }

  try {
    // Update verification status
    await admin.firestore().collection("users").doc(context.auth.uid).update({
      isPhoneVerified: true,
      phoneVerifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Check if email is also verified, and update overall verification status
    const userDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();
    const userData = userDoc.data();
    
    if (userData.isEmailVerified) {
      await admin.firestore().collection("users").doc(context.auth.uid).update({
        isVerified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return { success: true, message: "Phone verification confirmed" };
  } catch (error) {
    console.error("Error confirming phone verification:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to confirm phone verification",
      error.message
    );
  }
});

// Function to confirm email verification is complete
exports.confirmEmailVerification = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function"
    );
  }

  // Verify email is actually verified in Auth
  const user = await admin.auth().getUser(context.auth.uid);
  if (!user.emailVerified) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Email is not verified yet"
    );
  }

  try {
    // Update verification status
    await admin.firestore().collection("users").doc(context.auth.uid).update({
      isEmailVerified: true,
      emailVerifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Check if phone is also verified, and update overall verification status
    const userDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();
    const userData = userDoc.data();
    
    if (userData.isPhoneVerified) {
      await admin.firestore().collection("users").doc(context.auth.uid).update({
        isVerified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return { success: true, message: "Email verification confirmed" };
  } catch (error) {
    console.error("Error confirming email verification:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to confirm email verification",
      error.message
    );
  }
});

// Function to check in an attendee
exports.checkInAttendee = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function"
    );
  }

  // Verify admin permissions
  const isAdmin = await isUserAdmin(context.auth.uid);
  if (!isAdmin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can check in attendees"
    );
  }

  try {
    const { attendeeId, registrationId } = data;
    
    // Find attendee by ID or registration ID
    let attendeeDoc;
    
    if (attendeeId) {
      attendeeDoc = await admin.firestore().collection("users").doc(attendeeId).get();
    } else if (registrationId) {
      const querySnapshot = await admin.firestore()
        .collection("users")
        .where("registrationId", "==", registrationId)
        .limit(1)
        .get();
      
      if (!querySnapshot.empty) {
        attendeeDoc = querySnapshot.docs[0];
      }
    } else {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Either attendeeId or registrationId must be provided"
      );
    }
    
    if (!attendeeDoc || !attendeeDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Attendee not found"
      );
    }
    
    // Get attendee data
    const attendeeData = attendeeDoc.data();
    
    // Check if already checked in
    if (attendeeData.checkInStatus) {
      return {
        success: false,
        alreadyCheckedIn: true,
        message: "Attendee is already checked in",
        attendee: {
          id: attendeeDoc.id,
          name: attendeeData.name,
          email: attendeeData.email,
          registrationId: attendeeData.registrationId,
          checkInTime: attendeeData.checkInTime
        }
      };
    }
    
    // Check verification status
    if (!attendeeData.isVerified) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Attendee registration is not verified"
      );
    }
    
    // Update check-in status
    await admin.firestore().collection("users").doc(attendeeDoc.id).update({
      checkInStatus: true,
      checkInTime: admin.firestore.FieldValue.serverTimestamp(),
      checkedInBy: {
        adminId: context.auth.uid,
        adminName: (await admin.firestore().collection("admins").doc(context.auth.uid).get()).data()?.name || "Admin",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    // Log check-in event
    await admin.firestore().collection("checkInLogs").add({
      attendeeId: attendeeDoc.id,
      attendeeName: attendeeData.name,
      attendeeEmail: attendeeData.email,
      registrationId: attendeeData.registrationId,
      adminId: context.auth.uid,
      adminName: (await admin.firestore().collection("admins").doc(context.auth.uid).get()).data()?.name || "Admin",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      eventType: "check-in"
    });
    
    return {
      success: true,
      message: "Attendee checked in successfully",
      attendee: {
        id: attendeeDoc.id,
        name: attendeeData.name,
        email: attendeeData.email,
        registrationId: attendeeData.registrationId
      }
    };
  } catch (error) {
    console.error("Error checking in attendee:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to check in attendee",
      error.message
    );
  }
});

// Function to undo check-in
exports.undoCheckIn = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function"
    );
  }

  // Verify admin permissions
  const isAdmin = await isUserAdmin(context.auth.uid);
  if (!isAdmin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can undo check-ins"
    );
  }

  try {
    const { attendeeId } = data;
    
    if (!attendeeId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Attendee ID is required"
      );
    }
    
    // Get attendee data
    const attendeeDoc = await admin.firestore().collection("users").doc(attendeeId).get();
    
    if (!attendeeDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Attendee not found"
      );
    }
    
    const attendeeData = attendeeDoc.data();
    
    // Check if already checked in
    if (!attendeeData.checkInStatus) {
      return {
        success: false,
        message: "Attendee is not checked in"
      };
    }
    
    // Undo check-in status
    await admin.firestore().collection("users").doc(attendeeId).update({
      checkInStatus: false,
      checkInTime: null,
      checkedInBy: null,
      checkOutTime: admin.firestore.FieldValue.serverTimestamp(),
      checkedOutBy: {
        adminId: context.auth.uid,
        adminName: (await admin.firestore().collection("admins").doc(context.auth.uid).get()).data()?.name || "Admin",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    // Log check-out event
    await admin.firestore().collection("checkInLogs").add({
      attendeeId: attendeeDoc.id,
      attendeeName: attendeeData.name,
      attendeeEmail: attendeeData.email,
      registrationId: attendeeData.registrationId,
      adminId: context.auth.uid,
      adminName: (await admin.firestore().collection("admins").doc(context.auth.uid).get()).data()?.name || "Admin",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      eventType: "check-out"
    });
    
    return {
      success: true,
      message: "Check-in status undone successfully"
    };
  } catch (error) {
    console.error("Error undoing check-in:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to undo check-in",
      error.message
    );
  }
});

// Function to create a new admin user
exports.createAdminUser = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function"
    );
  }

  // Verify super admin permissions
  const isSuperAdmin = await isUserSuperAdmin(context.auth.uid);
  if (!isSuperAdmin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only super admins can create new admin users"
    );
  }

  try {
    const { email, name, role, permissions } = data;
    
    // Validate required fields
    if (!email || !name || !role) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Email, name, and role are required"
      );
    }
    
    // Check if email already exists
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      
      // If we get here, user exists
      // Check if already an admin
      const adminDoc = await admin.firestore().collection("admins").doc(userRecord.uid).get();
      
      if (adminDoc.exists) {
        throw new functions.https.HttpsError(
          "already-exists",
          "This email is already registered as an admin"
        );
      }
      
      // Add admin role to existing user
      await admin.firestore().collection("admins").doc(userRecord.uid).set({
        name,
        email,
        role,
        permissions: permissions || [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: context.auth.uid
      });
      
      return {
        success: true,
        message: "Admin role added to existing user",
        adminId: userRecord.uid
      };
      
    } catch (error) {
      // User doesn't exist, create new user
      if (error.code === 'auth/user-not-found') {
        // Generate a random password
        const password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // Create new user
        const userRecord = await admin.auth().createUser({
          email,
          password,
          displayName: name,
          emailVerified: true
        });
        
        // Add admin role
        await admin.firestore().collection("admins").doc(userRecord.uid).set({
          name,
          email,
          role,
          permissions: permissions || [],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          createdBy: context.auth.uid
        });
        
        // Send password reset email
        await admin.auth().generatePasswordResetLink(email);
        
        return {
          success: true,
          message: "New admin user created",
          adminId: userRecord.uid
        };
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to create admin user",
      error.message
    );
  }
});

// Function to get check-in statistics
exports.getCheckInStats = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function"
    );
  }

  // Verify admin permissions
  const isAdmin = await isUserAdmin(context.auth.uid);
  if (!isAdmin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can view check-in statistics"
    );
  }

  try {
    // Get total registered users
    const totalRegisteredSnapshot = await admin.firestore()
      .collection("users")
      .where("isVerified", "==", true)
      .get();
    
    const totalRegistered = totalRegisteredSnapshot.size;
    
    // Get total checked in users
    const totalCheckedInSnapshot = await admin.firestore()
      .collection("users")
      .where("checkInStatus", "==", true)
      .get();
    
    const totalCheckedIn = totalCheckedInSnapshot.size;
    
    // Get check-in rate
    const checkInRate = totalRegistered > 0 ? (totalCheckedIn / totalRegistered) * 100 : 0;
    
    // Get recent check-ins
    const recentCheckInsSnapshot = await admin.firestore()
      .collection("users")
      .where("checkInStatus", "==", true)
      .orderBy("checkInTime", "desc")
      .limit(10)
      .get();
    
    const recentCheckIns = [];
    recentCheckInsSnapshot.forEach(doc => {
      const data = doc.data();
      recentCheckIns.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        registrationId: data.registrationId,
        checkInTime: data.checkInTime
      });
    });
    
    return {
      totalRegistered,
      totalCheckedIn,
      checkInRate: checkInRate.toFixed(2),
      recentCheckIns
    };
  } catch (error) {
    console.error("Error getting check-in stats:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to get check-in statistics",
      error.message
    );
  }
});

// Utility function to check if a phone number is already in use
async function isPhoneInUse(phoneNumber, excludeUserId) {
  const querySnapshot = await admin.firestore()
    .collection("users")
    .where("phone", "==", phoneNumber)
    .get();
  
  if (querySnapshot.empty) {
    return false;
  }
  
  // Check if the phone is used by a different user
  for (const doc of querySnapshot.docs) {
    if (doc.id !== excludeUserId) {
      return true;
    }
  }
  
  return false;
}

// Utility function to check if user is an admin
async function isUserAdmin(uid) {
  const adminDoc = await admin.firestore().collection("admins").doc(uid).get();
  return adminDoc.exists;
}

// Utility function to check if user is a super admin
async function isUserSuperAdmin(uid) {
  const adminDoc = await admin.firestore().collection("admins").doc(uid).get();
  
  if (!adminDoc.exists) {
    return false;
  }
  
  const adminData = adminDoc.data();
  return adminData.role === "superadmin";
}

// Automatically update user verification status when email is verified
exports.onUserEmailVerified = functions.auth.user().onUpdate((change, context) => {
  const beforeUser = change.before.emailVerified;
  const afterUser = change.after.emailVerified;
  
  // If email was verified in this update
  if (!beforeUser && afterUser) {
    const uid = change.after.uid;
    
    return admin.firestore().collection("users").doc(uid).update({
      isEmailVerified: true,
      emailVerifiedAt: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      // Check if phone is also verified
      return admin.firestore().collection("users").doc(uid).get();
    })
    .then(doc => {
      if (doc.exists && doc.data().isPhoneVerified) {
        // Update overall verification status
        return admin.firestore().collection("users").doc(uid).update({
          isVerified: true,
          verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      return null;
    })
    .catch(error => {
      console.error("Error updating email verification status:", error);
    });
  }
  
  return null;
});

// Generate registration QR code and ID when user is verified
exports.onUserVerified = functions.firestore
  .document('users/{userId}')
  .onUpdate((change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const userId = context.params.userId;
    
    // Check if verification status changed to true
    if (!beforeData.isVerified && afterData.isVerified) {
      // Generate registration ID if not already present
      if (!afterData.registrationId) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const registrationId = `REG-${timestamp.substring(timestamp.length - 4)}-${random}`;
        
        // Create QR code data
        const qrData = JSON.stringify({
          regId: registrationId,
          name: afterData.name,
          email: afterData.email,
          timestamp: Date.now()
        });
        
        // Update user with registration ID and QR data
        return admin.firestore().collection('users').doc(userId).update({
          registrationId: registrationId,
          qrData: qrData,
          qrGeneratedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
    
    return null;
  });

// Export all functions
module.exports = {
  sendQrCodeByEmail: exports.sendQrCodeByEmail,
  verifyPhoneNumber: exports.verifyPhoneNumber,
  confirmPhoneVerification: exports.confirmPhoneVerification,
  confirmEmailVerification: exports.confirmEmailVerification,
  checkInAttendee: exports.checkInAttendee,
  undoCheckIn: exports.undoCheckIn,
  createAdminUser: exports.createAdminUser,
  getCheckInStats: exports.getCheckInStats,
  onUserEmailVerified: exports.onUserEmailVerified,
  onUserVerified: exports.onUserVerified
};