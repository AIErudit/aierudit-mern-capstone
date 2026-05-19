/**
 * Mock payment provider. The real-world version would hit Stripe / PayPal /
 * an internal payment gateway. The mock supports a couple of "magic" card
 * numbers so capstone learners can exercise the broken error path.
 *
 *   4242 4242 4242 4242 — accepted (success)
 *   4000 0000 0000 0002 — declined by issuer
 *   4000 0000 0000 0119 — provider error (timeout simulation)
 */

const MOCK_DELAY = Number(process.env.PAYMENT_MOCK_DELAY_MS || 300);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(cardNumber) {
  return String(cardNumber || "").replace(/\s+/g, "");
}

async function callMockProvider({ cardNumber, amountCents }) {
  await sleep(MOCK_DELAY);
  const n = normalize(cardNumber);
  if (n === "4000000000000002") {
    const err = new Error("payment provider declined");
    err.code = "card_declined";
    throw err;
  }
  if (n === "4000000000000119") {
    const err = new Error("payment provider timeout");
    err.code = "provider_timeout";
    throw err;
  }
  return {
    providerRef: `mock_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
    chargedCents: amountCents,
  };
}

export async function processPayment({ cardNumber, amountCents }) {
  // CAPSTONE-BUG-4: this try/catch swallows ANY provider exception and returns
  // {success: true} regardless. A declined card or a provider timeout reports
  // as a successful charge. The order gets marked isPaid: true and no real
  // money moves. Expected fix: re-throw or return {success: false, error}.
  try {
    const result = await callMockProvider({ cardNumber, amountCents });
    return { success: true, providerRef: result.providerRef };
  } catch (err) {
    console.warn("[payment] provider call failed:", err.message);
    return { success: true };
  }
}
