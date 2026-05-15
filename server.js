const admin = require("firebase-admin");
const find = require('local-devices');
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://securitywifi-653bd-default-rtdb.firebaseio.com"
});

const db = admin.database();
const devicesRef = db.ref("wifi_devices");
const blockedRef = db.ref("blocked_devices");

// Ўзингизнинг қурилмаларингиз MAC манзилларини шу ерга ёзинг (Whitelist)
const myTrustedDevices = [
    "00:11:22:33:44:55", // Сизнинг телефонингиз MAC манзили
    "AA:BB:CC:DD:EE:FF"  // Сизнинг компьютерингиз
];

async function scanAndProtect() {
    console.log("🛡️ Хавфсизлик сканери ишга тушди...");
    try {
        const devices = await find();
        
        devices.forEach(async (device) => {
            // Агар қурилма меники бўлмаса (Оқ рўйхатда йўқ бўлса)
            if (!myTrustedDevices.includes(device.mac)) {
                console.log(`⚠️ ДИҚҚАТ! Бегона қурилма аниқланди: IP: ${device.ip}, MAC: ${device.mac}`);
                
                // 1. Уни базада "Шубҳали" деб белгилаш
                device.status = "BLOCKED"; 
                
                // 2. Уни Firebase-даги "blocked_devices" папкасига алоҳида сақлаш
                await blockedRef.child(device.mac.replace(/:/g, "-")).set({
                    ...device,
                    detectedAt: new Date().toISOString()
                });
            } else {
                device.status = "TRUSTED";
            }
        });

        // Маълумотларни базага янгилаш
        await devicesRef.set(devices);
        console.log("✅ Мониторинг янгиланди.");

    } catch (err) {
        console.error("❌ Хатолик:", err);
    }
}

// Ҳар 30 сонияда текшириш
setInterval(scanAndProtect, 30000);
scanAndProtect();