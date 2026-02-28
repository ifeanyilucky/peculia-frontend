interface PaystackPopOptions {
  key: string;
  email?: string;
  amount?: number;
  ref?: string;
  access_code?: string;
  onClose: () => void;
  callback: (response: { reference: string; status: string }) => void;
}

// Ensure window.PaystackPop is available
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackPopOptions) => { openIframe: () => void };
    };
  }
}

/**
 * Loads the Paystack inline script dynamically.
 */
function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.body.appendChild(script);
  });
}

/**
 * Opens the Paystack modal using the initialized access_code and reference.
 */
export async function openPaystackModal(options: PaystackPopOptions) {
  try {
    await loadPaystackScript();

    // The official V1 API uses `setup()` followed by `openIframe()`
    const handler = window.PaystackPop.setup(options);
    handler.openIframe();
  } catch (error) {
    console.error("Paystack Initialization Error: ", error);
    // You could trigger a toast or fallback error handling here
  }
}
