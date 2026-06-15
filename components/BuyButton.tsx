"use client";
import React, { useEffect, useState, useCallback } from "react";

/**
 * Product definition for multi-product checkout
 * Example:
 * {
 *   name: 'Premium',
 *   priceId: 'pri_01aryz6z94z1smf44ehs2d9rbp',  // Sandbox or Live price ID
 *   productId: 'prod_...'  // Optional: if using Paddle's product ID
 * }
 */
interface Product {
  name: string;
  priceId: string;
  productId?: string;
}

interface BuyButtonProps {
  /** Price ID from Paddle (e.g., 'pri_...' for sandbox or production) */
  priceId?: string;
  /** Product ID from Paddle (optional, if using products instead of prices) */
  productId?: string;
  /** Quantity to purchase */
  quantity?: number;
  /** Button label/children */
  children?: React.ReactNode;
  /** Callback when checkout opens successfully */
  onCheckoutOpen?: () => void;
  /** Callback on checkout error */
  onCheckoutError?: (error: Error) => void;
  /** Custom CSS class for button */
  className?: string;
  /** Disable button */
  disabled?: boolean;
}

/**
 * BuyButton - Paddle Checkout Integration Component
 *
 * Features:
 * - Supports both sandbox (ctok_) and production (live_) environments
 * - Handles Paddle script loading dynamically
 * - Multiple checkout item support
 * - Comprehensive error handling and logging
 * - CSP (Content Security Policy) compatible
 *
 * Usage:
 * <BuyButton priceId="pri_01aryz6z94z1smf44ehs2d9rbp" />
 *
 * For production:
 * - Update NEXT_PUBLIC_PADDLE_CLIENT_TOKEN to live_... token
 * - Tokens are determined by environment: ctok_ = sandbox, live_ = production
 */
export default function BuyButton({
  priceId,
  productId,
  quantity = 1,
  children = 'Buy Now',
  onCheckoutOpen,
  onCheckoutError,
  className = '',
  disabled = false,
}: BuyButtonProps) {
  const [paddleReady, setPaddleReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Paddle script dynamically if needed
  const loadPaddleScript = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window not available'));
        return;
      }

      // If Paddle is already loaded, resolve immediately
      if (window.Paddle) {
        resolve();
        return;
      }

      // Create and load script
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ [BuyButton] Paddle script loaded successfully');
        // Initialize Paddle with the appropriate token
        try {
          const billingToken = process.env.NEXT_PUBLIC_PADDLE_BILLING_TOKEN || '';
          const liveToken = process.env.NEXT_PUBLIC_LIVE_PADDLE_CLIENT_TOKEN || '';
          const sandboxToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
          
          // Prefer billing token, then live token, then sandbox token
          const token = billingToken || liveToken || sandboxToken;
          
          const w = window as any;
          if (w.Paddle && typeof w.Paddle.Initialize === 'function' && !w.__PADDLE_INITIALIZED) {
            if (token) {
              w.Paddle.Initialize({ token });
              w.__PADDLE_INITIALIZED = true;
              console.log(`✅ [BuyButton] Paddle initialized with token: ${token.substring(0, 10)}...`);
            }
          }
        } catch (e) {
          console.warn('⚠️ [BuyButton] Paddle initialization check failed', e);
        }
        resolve();
      };
      script.onerror = () => {
        const err = 'Failed to load Paddle script from CDN';
        console.error(`❌ [BuyButton] ${err}`);
        reject(new Error(err));
      };
      document.head.appendChild(script);
    });
  }, []);

  // Check if Paddle is ready
  const checkPaddleReady = useCallback(async () => {
    const maxAttempts = 15; // 3.75 seconds
    const delayMs = 250;
    let attempts = 0;

    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(() => {
        attempts++;
        const w = window as any;

        if (w?.Paddle?.Checkout?.open) {
          console.log('✅ [BuyButton] Paddle.Checkout.open is ready');
          clearInterval(interval);
          setPaddleReady(true);
          resolve();
          return;
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          const err = 'Paddle SDK failed to initialize after 3.75 seconds';
          console.error(`❌ [BuyButton] ${err}`);
          setError(err);
          reject(new Error(err));
          return;
        }

        if (process.env.NODE_ENV === 'development' && attempts % 5 === 0) {
          console.log(`⏳ [BuyButton] Waiting for Paddle.Checkout.open (attempt ${attempts}/${maxAttempts})`);
        }
      }, delayMs);
    });
  }, []);

  // Initialize Paddle on component mount
  useEffect(() => {
    const initializePaddle = async () => {
      try {
        await loadPaddleScript();
        await checkPaddleReady();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to initialize Paddle';
        console.error(`❌ [BuyButton] Initialization error: ${errorMsg}`);
        setError(errorMsg);
        if (onCheckoutError) {
          onCheckoutError(new Error(errorMsg));
        }
      }
    };

    initializePaddle();
  }, [loadPaddleScript, checkPaddleReady, onCheckoutError]);

  // Handle checkout button click
  const handleClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const w = window as any;
      const Paddle = w?.Paddle;

      if (!Paddle) {
        throw new Error('Paddle SDK not available. Please refresh the page.');
      }

      if (!Paddle.Checkout?.open) {
        throw new Error('Paddle.Checkout.open is not available. Checkout initialization may have failed.');
      }

      if (!priceId && !productId) {
        throw new Error('Either priceId or productId must be provided');
      }

      // Build checkout items
      const items: any[] = [];
      if (priceId) {
        items.push({ priceId, quantity });
        if (process.env.NODE_ENV === 'development') {
          console.log(`🎯 [BuyButton] Opening checkout with priceId: ${priceId}`);
        }
      }
      if (productId) {
        items.push({ productId, quantity });
        if (process.env.NODE_ENV === 'development') {
          console.log(`🎯 [BuyButton] Opening checkout with productId: ${productId}`);
        }
      }

      // Determine environment from token - check both sandbox and live tokens
      const sandboxToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
      const liveToken = process.env.NEXT_PUBLIC_LIVE_PADDLE_CLIENT_TOKEN || '';
      const token = liveToken || sandboxToken;
      const env = token.startsWith('live_') ? 'production' : 'sandbox';
      
      if (!token) {
        throw new Error('Paddle token not configured. Please check your environment variables.');
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📍 [BuyButton] Environment: ${env}`);
        console.log(`📍 [BuyButton] Using token: ${token.substring(0, 10)}...`);
      }

      // Open checkout overlay
      Paddle.Checkout.open({
        items,
        settings: {
          displayMode: 'overlay',
          frameInitialHeight: 600,
          // On success/error, Paddle handles callbacks via webhooks
        },
      });

      if (onCheckoutOpen) {
        onCheckoutOpen();
      }

      console.log('✅ [BuyButton] Checkout opened successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown checkout error';
      console.error(`❌ [BuyButton] Checkout error: ${errorMsg}`, err);
      setError(errorMsg);

      if (onCheckoutError) {
        onCheckoutError(err instanceof Error ? err : new Error(errorMsg));
      }
    } finally {
      setIsLoading(false);
    }
  }, [priceId, productId, quantity, onCheckoutOpen, onCheckoutError]);

  // Render button
  const isDisabled = disabled || isLoading || !paddleReady;

  return (
    <div className="inline-block">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          px-6 py-3 rounded-lg font-semibold transition-all duration-200
          whitespace-nowrap
          ${isDisabled
            ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'
            : 'bg-amber-600 text-white hover:bg-amber-700 active:scale-95 shadow-lg hover:shadow-xl'
          }
          ${className}
        `}
        type="button"
        aria-label={typeof children === 'string' ? children : 'Buy now'}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {typeof children === 'string' ? (children === 'Buy Now' ? 'Processing...' : 'Loading...') : children}
          </span>
        ) : !paddleReady ? (
          `Loading...`
        ) : (
          children
        )}
      </button>

      {/* Error message display */}
      {error && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
          <p className="font-semibold">Checkout Error</p>
          <p className="text-xs mt-1">{error}</p>
          <p className="text-xs mt-2 opacity-75">
            {error.includes('refresh') && 'Try refreshing the page or contact support.'}
            {!error.includes('refresh') && 'Please try again or contact support if the problem persists.'}
          </p>
        </div>
      )}
    </div>
  );
}
