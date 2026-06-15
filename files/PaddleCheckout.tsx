"use client";
import React, { useEffect, useState } from 'react';
import { getPaddlePriceId } from '@/lib/prices';

const PRODUCTS = [
  { name: 'Basic', key: 'basic' },
  { name: 'Standard', key: 'standard' },
  { name: 'Premium', key: 'premium' },
];

export default function PaddleCheckout() {
  const [paddleReady, setPaddleReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Paddle script if not already loaded
    const load = async () => {
      if (typeof window === 'undefined') return;
      if (!(window as any).Paddle) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
          s.async = true;
          s.onload = resolve;
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }

      try {
        // Fetch client token from server
        const r = await fetch('/api/paddle/token');
        const j = await r.json();
        if (!r.ok) {
          console.error('Failed to fetch paddle token', j);
          setError('Failed to fetch paddle token');
          return;
        }

        const clientToken = j.clientToken;
        if (!clientToken) {
          console.warn('No client token returned, using browser env token', j);
          // Continue with environment token instead
        }

        const Paddle = (window as any).Paddle;
        if (!Paddle) {
          setError('Paddle SDK not loaded');
          return;
        }

        // Set environment then call Setup
        if (Paddle.Environment && typeof Paddle.Environment.set === 'function') {
          Paddle.Environment.set(process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox');
        }

        // Use clientToken if available, otherwise try environment token
        const tokenToUse = clientToken || process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        
        if (typeof Paddle.Setup === 'function') {
          Paddle.Setup({ token: tokenToUse });
        } else if (typeof Paddle.Initialize === 'function') {
          // fallback
          Paddle.Initialize({ token: tokenToUse });
        }

        setPaddleReady(true);
        console.log('✅ Paddle setup completed with token:', tokenToUse?.substring(0, 15) + '...');
      } catch (err) {
        console.error('Paddle init failed', err);
        setError(String(err));
      }
    };

    void load();
  }, []);

  const openCheckout = async (priceKey: 'basic' | 'standard' | 'premium') => {
    const Paddle = (window as any).Paddle;
    const priceId = getPaddlePriceId(priceKey);
    
    if (!priceId) {
      setError('Price ID not configured for ' + priceKey);
      return;
    }

    // Paddle v2 requires client-side Checkout.open() - no server API option
    if (!Paddle || !paddleReady) {
      setError('Paddle SDK not ready. Please refresh the page.');
      return;
    }

    if (!Paddle.Checkout || typeof Paddle.Checkout.open !== 'function') {
      setError('Paddle.Checkout.open not available. Check that Paddle SDK is properly loaded.');
      return;
    }

    try {
      console.log('🎯 Opening Paddle checkout for priceId:', priceId);
      Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        successCallback: (data: any) => {
          console.log('✅ Paddle success callback', data);
        },
        onError: (err: any) => {
          console.error('Paddle checkout error', err);
          setError(err?.message || JSON.stringify(err));
        },
      });
    } catch (err) {
      console.error('Failed to open Paddle checkout', err);
      setError(String(err));
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Paddle Sandbox Checkout</h2>
      {error && <div className="text-blue-600 mb-3">{error}</div>}
      <div className="flex gap-3">
        {PRODUCTS.map((p) => (
          <button
            key={p.key}
            onClick={() => openCheckout(p.key as any)}
            className="px-4 py-2 rounded bg-blue-600 text-white"
            disabled={!paddleReady}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
