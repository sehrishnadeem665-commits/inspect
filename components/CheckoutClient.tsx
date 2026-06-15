"use client";
import React, { useState } from 'react';
import { Lock, CreditCard } from 'lucide-react';
import BuyButton from './BuyButton';
import { getPrice } from '@/lib/prices';
import CheckoutSummary from './CheckoutSummary';
import Image from 'next/image';

function normalizePackageKey(input: any) {
  if (!input) return 'standard'
  const s = String(input).trim().toLowerCase()
  if (s.includes('premium')) return 'premium'
  if (s.includes('standard')) return 'standard'
  if (s.includes('basic')) return 'basic'
  // fallback common synonyms
  if (s.includes('pro') || s.includes('plus')) return 'premium'
  return 'standard'
}

function normalizeCategory(input: any) {
  if (!input) return 'car'
  const s = String(input).trim().toLowerCase()
  if (s.includes('truck') || s.includes('lorry')) return 'truck'
  if (s.includes('suv')) return 'suv'
  if (s.includes('van')) return 'truck'
  if (s.includes('motor') || s.includes('bike') || s.includes('motorcycle')) return 'motorbike'
  if (s.includes('car') || s.includes('auto')) return 'car'
  return 'car'
}

export default function CheckoutClient({ order }: { order: any }) {
  const [error, setError] = useState<string | null>(null);

  // Get the Paddle price ID for this order's package type
  // Normalize package type so values like "Premium ", "PREMIUM package" still map correctly
  const packageKey = normalizePackageKey(order?.package_type || order?.package || order?.package_type_name)
  // Paddle integration removed
  const priceId = undefined
  // Use stored amount from order, don't recalculate
  const displayAmount = order?.amount || getPrice(packageKey as 'basic' | 'standard' | 'premium', order?.currency || 'USD')

  console.log('[CheckoutClient] Order loaded:', {
    order_id: order?.id,
    order_number: order?.order_number,
    raw_package_type: order?.package_type,
    normalized_packageKey: packageKey,
    stored_amount: order?.amount,
    display_amount: displayAmount,
    currency: order?.currency,
    priceId: priceId
  })

  const category = normalizeCategory(order.category || order.vehicle_type || order.package_type || order.vehicle_type)
  const imageMap: Record<string, string> = {
    car: '/cars.webp',
    truck: '/imag-1.jpg',
    suv: '/cars.webp',
    default: '/image.png',
    motorbike: '/imag-1.jpg',
  };
  const imgSrc = imageMap[category] || imageMap['default'];

  if (!priceId) {
    return (
      <div className="p-4">
        <div className="p-4 border border-border rounded mb-4 bg-background">
          <h2 className="font-semibold">Package</h2>
          <div className="text-lg font-bold">{order.package_type}</div>
          <div className="text-sm text-muted-foreground">{order.currency} {order.amount}</div>
        </div>
        <div className="text-amber-600">No Paddle price ID configured for {order.package_type}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-gradient-to-br from-white to-amber-50 border rounded-xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-full md:w-40 h-44 md:h-28 relative rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            <Image src={imgSrc} alt={category} fill style={{ objectFit: 'cover' }} />
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">{order.vehicle_make ? `${order.vehicle_make} ${order.vehicle_model || ''}` : packageKey}</h2>
            <div className="mt-2 text-sm md:text-base text-muted-foreground">{packageKey} • {order.currency} {Number(displayAmount).toFixed(2)}</div>

            <div className="mt-4 text-sm md:text-base text-foreground space-y-2">
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Deep vehicle history check</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Ownership & accident records</div>
              <div className="flex items-center gap-2"><span className="text-green-600">✓</span> Photos & title status</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-6 bg-gradient-to-br from-white to-indigo-50 border rounded-2xl shadow-2xl overflow-hidden">
          <div className="-mx-6 px-6 -mt-6 pt-6 pb-4 bg-gradient-to-r from-indigo-600 to-amber-600 text-white rounded-t-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shadow-md">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase opacity-90 tracking-widest">Secure checkout</div>
              <div className="text-sm opacity-90">Powered by Paddle</div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-full">
                <CreditCard className="w-4 h-4 text-white opacity-95" />
                <span className="text-xs text-white/95">Encrypted</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              {error && <div className="text-amber-600 mb-3">{error}</div>}

              <div className="flex items-baseline gap-3">
                <div className="text-sm text-muted-foreground">Amount</div>
                <div className="text-3xl md:text-4xl font-extrabold">{order.currency} {Number(displayAmount).toFixed(2)}</div>
              </div>

              <div className="mt-3 text-sm text-foreground">
                Instant access to your vehicle report after payment.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  <img src="/visa-icon.svg" alt="visa" className="w-4 h-4" /> Visa
                </span>
                <span className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  <img src="/paypal-icon.svg" alt="paypal" className="w-4 h-4" /> PayPal
                </span>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="w-full">
                <BuyButton priceId={priceId} quantity={1}>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm">Pay</span>
                    <span className="font-semibold">{order.currency} {Number(displayAmount).toFixed(2)}</span>
                  </div>
                </BuyButton>
              </div>

              <div className="mt-3 text-center text-xs text-gray-500">30-day money-back guarantee • Secure payment</div>
            </div>
          </div>
        </div>
      </div>

      <aside className="md:col-span-1 md:sticky md:top-24">
        <CheckoutSummary order={order} />
      </aside>
      {/* Dev debug panel: shows raw vs normalized package and resolved Paddle priceId */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-6 text-xs text-foreground bg-accent/10 border border-accent/30 p-3 rounded">
          <div className="font-medium mb-1">Debug (dev only)</div>
          <div className="flex gap-3 flex-wrap">
            <div className="min-w-[220px]">raw package_type: <code className="bg-white px-1 rounded">{String(order?.package_type)}</code></div>
            <div className="min-w-[160px]">normalized: <code className="bg-white px-1 rounded">{packageKey}</code></div>
            <div className="min-w-[220px]">displayAmount: <code className="bg-white px-1 rounded">{order?.currency} {displayAmount}</code></div>
            <div className="min-w-[300px]">resolved priceId: <code className="bg-white px-1 rounded break-all">{priceId}</code></div>
          </div>
        </div>
      )}

    </div>
  );
}
