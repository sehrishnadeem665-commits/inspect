"use client";
import React, { useEffect, useState } from "react";

type BuyButtonProps = {
  priceId?: string;
  quantity?: number;
  children?: React.ReactNode;
};

export default function BuyButton({
  priceId = "pri_TEST123",
  quantity = 1,
  children,
}: BuyButtonProps) {
  const [paddleReady, setPaddleReady] = useState(false);

  // Ensure Paddle is ready
  useEffect(() => {
    const checkPaddleReady = () => {
      const Paddle = (window as any).Paddle;
      if (!Paddle) {
        console.log('⏳ [BuyButton] Paddle script not yet loaded');
        setTimeout(checkPaddleReady, 250);
        return;
      }
      
      // Check if Checkout is available
      if (Paddle.Checkout && typeof Paddle.Checkout.open === 'function') {
        console.log('✅ [BuyButton] Paddle.Checkout is ready');
        setPaddleReady(true);
      } else {
        console.log('⏳ [BuyButton] Waiting for Paddle.Checkout initialization');
        setTimeout(checkPaddleReady, 250);
      }
    };

    checkPaddleReady();
  }, []);

  const handleClick = async () => {
    try {
      const Paddle = (window as any).Paddle
      if (!Paddle || !Paddle.Checkout) {
        throw new Error('Paddle not initialized')
      }

      console.log('[BuyButton] Opening Paddle checkout with priceId:', priceId)
      
      // Open checkout directly using Paddle.Checkout.open with price ID
      // Paddle v2 handles the iframe and CSP automatically
      Paddle.Checkout.open({
        items: [{ priceId }],
        settings: {
          displayMode: 'overlay',
          frameInitialHeight: 600,
        },
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('[BuyButton] ❌ Checkout error:', errorMsg, err)
      alert('Failed to start checkout: ' + errorMsg)
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!paddleReady}
      className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all ${
        !paddleReady ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800'
      }`}
    >
      {paddleReady ? (children || 'Pay with Paddle') : 'Loading...'}
    </button>
  );
}
