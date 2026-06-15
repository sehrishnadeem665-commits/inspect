"use client";
import { useEffect } from "react";

type PackageType = "basic" | "standard" | "premium";

const PRICE_IDS: Record<PackageType, string> = {
  basic: "pri_01kg4gy97s9knjqxs7nw1t7dyy",
  standard: "pri_01kg4hffc22yaemyz1yj5vkkjs",
  premium: "pri_01kg4hge9f1nf3ec8qvyxkwg7j",
};

const FALLBACK_CLIENT_TOKEN = "ctok_test_9782bccddc407716eba1336d17a"; // sandbox demo token
const CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || FALLBACK_CLIENT_TOKEN;

export default function PaddleButtonSimple({ pkg }: { pkg: PackageType }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const Paddle = (window as any).Paddle;
    if (!Paddle) return;

    try {
      // Prefer explicit Environment API if available
      if (Paddle.Environment && typeof Paddle.Environment.set === "function") {
        Paddle.Environment.set("sandbox");
      }
      // Setup with client token
      if (typeof Paddle.Setup === "function") {
        Paddle.Setup({ token: CLIENT_TOKEN });
      } else if (typeof Paddle.Initialize === "function") {
        Paddle.Initialize({ token: CLIENT_TOKEN });
      } else {
        // last resort
        (Paddle as any).token = CLIENT_TOKEN;
      }

      console.log("PaddleButtonSimple: Paddle initialized (sandbox)", { tokenExists: !!CLIENT_TOKEN });
    } catch (err) {
      console.error("PaddleButtonSimple: failed to setup Paddle:", err);
    }
  }, []);

  const handleCheckout = () => {
    const Paddle = (window as any).Paddle;
    if (!Paddle) return alert("Paddle not loaded yet!");

    const price = PRICE_IDS[pkg];
    if (!price) return alert("Price not configured for package: " + pkg);

    try {
      Paddle.Checkout.open({
        items: [{ price, quantity: 1 }],
        passthrough: JSON.stringify({ package: pkg }),
        // optional: prefill email or other fields
        // email: 'buyer@example.com',
        successCallback: (data: any) => {
          console.log("Paddle success (frontend-only):", data);
          alert("Checkout completed (frontend-only test). See console for details.");
        },
        onError: (err: any) => {
          console.error("Paddle checkout error:", err);
          alert("Paddle error: " + (err?.message || JSON.stringify(err)));
        },
      });
    } catch (err) {
      console.error("Failed to open Paddle Checkout:", err);
      alert("Failed to open Paddle Checkout: " + err);
    }
  };

  return (
    <button type="button" onClick={handleCheckout} className="paddle-simple-buy px-4 py-2 bg-blue-600 text-white rounded">
      Buy {pkg}
    </button>
  );
}
