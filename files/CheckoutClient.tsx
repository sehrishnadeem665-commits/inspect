"use client";
import React, { useState } from 'react';
import BuyButton from './BuyButton';
import { getPaddlePriceId } from '@/lib/prices';

export default function CheckoutClient({ order }: { order: any }) {
  const [error, setError] = useState<string | null>(null);

  // Get the Paddle price ID for this order's package type
  const packageType = (order.package_type?.toLowerCase() as any) || 'standard';
  const priceId = getPaddlePriceId(packageType);

  if (!priceId) {
    return (
      <div>
        <div className="p-4 border rounded mb-4">
          <h2 className="font-semibold">Package</h2>
          <div className="text-lg font-bold">{order.package_type}</div>
          <div className="text-sm text-gray-600">{order.currency} {order.amount}</div>
        </div>
        <div className="text-blue-600">No Paddle price ID configured for {order.package_type}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 border rounded mb-4">
        <h2 className="font-semibold">Package</h2>
        <div className="text-lg font-bold">{order.package_type}</div>
        <div className="text-sm text-gray-600">{order.currency} {order.amount}</div>
      </div>

      {error && <div className="text-blue-600 mb-3">{error}</div>}

      <BuyButton priceId={priceId} quantity={1}>
        Pay with Paddle
      </BuyButton>
    </div>
  );
}
