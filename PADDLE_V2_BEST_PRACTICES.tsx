/**
 * PaddleButtonSimple - Paddle v2 Best Practice Example
 * 
 * This component demonstrates the recommended way to integrate Paddle v2
 * in a React application using token-based authentication.
 * 
 * Key Features:
 * - Token-based authentication (no Seller ID)
 * - Proper loading state management
 * - Error handling
 * - Type-safe price selection
 * - Responsive design
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";

interface PaddleButtonProps {
  /** The Paddle price ID (starts with pri_) */
  priceId: string;
  /** Custom button text */
  label?: string;
  /** Callback when checkout opens */
  onCheckoutOpen?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Custom CSS class */
  className?: string;
  /** Disable the button */
  disabled?: boolean;
  /** Show loading state */
  showLoading?: boolean;
}

declare global {
  interface Window {
    Paddle?: {
      Checkout?: {
        open: (config: {
          items: Array<{ priceId: string; quantity?: number }>;
          settings?: {
            displayMode?: "overlay" | "inline";
            frameInitialHeight?: number;
            frameTarget?: string;
          };
          customData?: Record<string, any>;
        }) => void;
      };
      Setup?: (config: { token: string }) => void;
    };
  }
}

export default function PaddleButtonSimple({
  priceId,
  label = "Pay with Paddle",
  onCheckoutOpen,
  onError,
  className = "",
  disabled = false,
  showLoading = true,
}: PaddleButtonProps) {
  const [isLoading, setIsLoading] = useState(showLoading);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Wait for Paddle to be initialized before allowing checkout
   * This polls window.Paddle.Checkout.open until it's available
   */
  useEffect(() => {
    let mounted = true;
    let attempts = 0;
    const maxAttempts = 40; // 10 seconds with 250ms interval

    const checkPaddleReady = () => {
      attempts++;

      if (!mounted) return;

      // Check if Paddle is fully loaded and initialized
      if (window.Paddle?.Checkout?.open) {
        console.log(`✅ [${priceId}] Paddle.Checkout.open is ready`);
        setIsReady(true);
        setIsLoading(false);
        return;
      }

      if (attempts >= maxAttempts) {
        const err =
          "Paddle SDK failed to initialize. Please refresh the page.";
        console.error(`❌ [${priceId}] ${err}`);
        setError(err);
        setIsLoading(false);
        if (onError) {
          onError(new Error(err));
        }
        return;
      }

      // Retry after 250ms
      setTimeout(checkPaddleReady, 250);
    };

    checkPaddleReady();

    return () => {
      mounted = false;
    };
  }, [priceId, onError]);

  /**
   * Handle checkout button click
   * Opens the Paddle checkout overlay with the specified price
   */
  const handleClick = useCallback(async () => {
    try {
      // Safety check - verify Paddle is available
      if (!window.Paddle?.Checkout?.open) {
        throw new Error(
          "Paddle is not initialized. Please refresh the page."
        );
      }

      // Validate price ID format
      if (!priceId || !priceId.startsWith("pri_")) {
        throw new Error(`Invalid price ID: ${priceId}`);
      }

      console.log(`🎯 [${priceId}] Opening Paddle checkout`);

      // Callback before opening
      if (onCheckoutOpen) {
        onCheckoutOpen();
      }

      // Open checkout with Paddle v2 API
      window.Paddle.Checkout.open({
        items: [
          {
            priceId,
            quantity: 1,
          },
        ],
        settings: {
          displayMode: "overlay",
          frameInitialHeight: 600,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`❌ [${priceId}] Checkout error:`, message);
      setError(message);
      if (onError) {
        onError(err instanceof Error ? err : new Error(message));
      }
    }
  }, [priceId, onCheckoutOpen, onError]);

  /**
   * Render logic:
   * - Show loading state while waiting for Paddle
   * - Show error if initialization fails
   * - Show button when ready
   */
  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading || !isReady || !!error}
        className={`
          px-6 py-3 rounded-lg font-semibold transition-all duration-200
          ${
            disabled || isLoading || !isReady || error
              ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-600"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }
          ${className}
        `}
        type="button"
      >
        {isLoading ? "Loading..." : isReady ? label : "Initializing..."}
      </button>

      {/* Error message display */}
      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
          {error}
        </div>
      )}

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 mt-2">
          <div>Price: {priceId}</div>
          <div>Ready: {isReady ? "✅" : "⏳"}</div>
          <div>
            Token: {process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN?.substring(0, 20)}
            ...
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 *
 * 1. Simple usage:
 *    <PaddleButtonSimple priceId="pri_basic_1" />
 *
 * 2. With custom label:
 *    <PaddleButtonSimple priceId="pri_pro_1" label="Upgrade to Pro" />
 *
 * 3. With callbacks:
 *    <PaddleButtonSimple
 *      priceId="pri_premium_1"
 *      onCheckoutOpen={() => console.log('Checkout opened')}
 *      onError={(err) => toast.error(err.message)}
 *    />
 *
 * 4. Multiple buttons:
 *    {[
 *      { id: 'pri_basic', label: 'Basic' },
 *      { id: 'pri_pro', label: 'Pro' },
 *      { id: 'pri_enterprise', label: 'Enterprise' },
 *    ].map(({ id, label }) => (
 *      <PaddleButtonSimple key={id} priceId={id} label={label} />
 *    ))}
 *
 * 5. With custom styling:
 *    <PaddleButtonSimple
 *      priceId="pri_xyz"
 *      className="w-full md:w-auto"
 *    />
 */
