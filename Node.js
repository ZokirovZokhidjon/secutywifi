// Бу ерга фақат ўзингиз ишонган қурилмаларни киритинг
const myTrustedDevices = [
    "80:F7:A6:5A:EE:EF", // Сизнинг роутерингиз (масалан)
    "A1:B2:C3:D4:E5:F6", // Сизнинг телефонингиз
    "Z1:X2:Y3:W4:V5:U6"  // Копмьютерингиз
];

// Текшириш мантиқи:
devices.forEach(device => {
    if (myTrustedDevices.includes(device.mac.toUpperCase())) {
        console.log(`✅ Бу бизники: ${device.ip}`);
    } else {
        console.log(`🚫 БЕГОНА ТОПИЛДИ: ${device.ip}. Блоклаш бошланди...`);
        // Блоклаш функциясини шу ерда чақирамиз
    }
});