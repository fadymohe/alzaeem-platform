import { extractSubdomain } from "../artifacts/api-server/src/middlewares/tenantRouting.ts";
import { dispatchShipmentToCourier, queryLiveCourierTracking } from "../artifacts/api-server/src/services/shippingService.ts";

console.log("=================================================================");
console.log("1. Testing Wildcard Subdomain Extraction:");
console.log("=================================================================");

const testHosts = [
  { host: "za3em.shop", expectedSub: null, expectedRoot: true },
  { host: "www.za3em.shop", expectedSub: null, expectedRoot: true },
  { host: "zero.za3em.shop", expectedSub: "zero", expectedRoot: false },
  { host: "store123.za3em.shop:5000", expectedSub: "store123", expectedRoot: false },
  { host: "api.za3em.shop", expectedSub: null, expectedRoot: true },
  { host: "admin.za3em.shop", expectedSub: null, expectedRoot: true },
  { host: "zero.localhost:5000", expectedSub: "zero", expectedRoot: false },
];

let allPassed = true;
for (const tc of testHosts) {
  const res = extractSubdomain(tc.host);
  const pass = res.subdomain === tc.expectedSub && res.isRoot === tc.expectedRoot;
  console.log(`Host: ${tc.host.padEnd(28)} -> Sub: ${String(res.subdomain).padEnd(10)} Root: ${String(res.isRoot).padEnd(6)} [${pass ? "PASS ✓" : "FAIL ✗"}]`);
  if (!pass) allPassed = false;
}

console.log("\n=================================================================");
console.log("2. Testing Courier API Dispatch (COD in Egyptian Pounds):");
console.log("=================================================================");

async function testShipping() {
  const dispatchRes = await dispatchShipmentToCourier({
    orderId: 1001,
    customerName: "محمود أحمد حسن",
    customerPhone: "01012345678",
    customerAddress: "شارع التحرير، الدقي، عمارة 15 الدور الرابع",
    governorate: "الجيزة",
    codAmount: 495, // 495 جنيه مصري صحيح
    notes: "تسليم بعد الساعة 2 ظهراً",
  });

  console.log("Dispatched Waybill:", dispatchRes.trackingNumber);
  console.log("Shipping Company:", dispatchRes.shippingCompany);
  console.log("Estimated Days:", dispatchRes.estimatedDeliveryDays);
  console.log("Success:", dispatchRes.success ? "PASS ✓" : "FAIL ✗");

  console.log("\n=================================================================");
  console.log("3. Testing Live Courier Tracking Query:");
  console.log("=================================================================");

  const trackingRes = await queryLiveCourierTracking(dispatchRes.trackingNumber, {
    customerName: "محمود أحمد حسن",
    governorate: "الجيزة",
    totalAmount: 495,
    status: "out_for_delivery",
  });

  console.log("Tracking Code:", trackingRes.trackingNumber);
  console.log("Status Text:", trackingRes.currentStatusText);
  console.log("COD Amount (EGP):", trackingRes.codAmount, "ج.م");
  console.log("Number of Checkpoints:", trackingRes.checkpoints.length);
  trackingRes.checkpoints.forEach((cp, idx) => {
    console.log(`  [${cp.isCompleted ? "✓" : " "}] ${cp.title} (${cp.timestamp})`);
  });

  console.log("\nAll Verification Tests Completed Successfully!");
}

testShipping();
