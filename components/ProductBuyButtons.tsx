"use client";
import React from 'react';
import { getPrice, getCurrencySymbol } from '@/lib/prices';

type PackageId = 'basic' | 'standard' | 'premium';

export default function ProductBuyButtons({ currency = 'USD' }: { currency?: string }) {
  const packages: { id: PackageId; label: string }[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'standard', label: 'Standard' },
    { id: 'premium', label: 'Premium' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {packages.map((p) => {
        const price = getPrice(p.id, currency as any) as number
        const symbol = getCurrencySymbol(currency)
        return (
          <div key={p.id} className="p-4 border rounded-lg text-center">
            <h3 className="font-semibold mb-2">{p.label}</h3>
            <div className="text-lg font-bold mb-3">{symbol} {price}</div>
            <button disabled className="w-full bg-gray-400 text-white py-2 rounded-lg">
              Payment Unavailable
            </button>
          </div>
        )
      })}
    </div>
  )
}
