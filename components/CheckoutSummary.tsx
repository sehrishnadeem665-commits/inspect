import React from 'react';
import Image from 'next/image';

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

export default function CheckoutSummary({ order }: { order: any }) {
  const items = order?.items || [{ name: order.package_type || 'Package', price: order.amount }];

  // Format package name nicely
  const packageName = order.package_type 
    ? order.package_type.charAt(0).toUpperCase() + order.package_type.slice(1).toLowerCase() + ' Package'
    : 'Report package';

  const category = normalizeCategory(order.category || order.vehicle_type || order.package_type)
  const imageMap: Record<string, string> = {
    car: '/cars.webp',
    truck: '/imag-1.jpg',
    suv: '/cars.webp',
    motorbike: '/imag-1.jpg',
    default: '/image.png',
  };

  const imgSrc = imageMap[category] || imageMap['default'];

  return (
    <div className="bg-background border border-border rounded-lg p-4 shadow-xl">
      <div className="flex gap-4 items-start md:items-center">
        <div className="w-20 md:w-28 h-16 md:h-20 relative rounded overflow-hidden flex-shrink-0 shadow-inner">
          <Image src={imgSrc} alt={category} fill style={{ objectFit: 'cover' }} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-md md:text-lg font-semibold truncate">{packageName}</h3>
          <div className="text-xs md:text-sm text-muted-foreground truncate">{order.vehicle_make ? `${order.vehicle_make} • ${order.vehicle_model || ''}` : 'Comprehensive vehicle report'}</div>
          <div className="mt-2 text-xs md:text-sm text-foreground">
            <span className="inline-block bg-gradient-to-r from-amber-100 to-cyan-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">{order.package_type || 'Standard'}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">Subtotal</div>
          <div className="text-lg font-bold">{order.currency || 'USD'} {Number(order.amount || 0).toFixed(2)}</div>
        </div>

        <div className="mt-3 text-xs text-gray-500">Taxes and fees calculated at checkout.</div>
      </div>

      <div className="mt-4">
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2"><span className="text-green-600 font-semibold">✓</span> Instant vehicle history lookup</li>
          <li className="flex items-start gap-2"><span className="text-green-600 font-semibold">✓</span> Ownership & accident records</li>
          <li className="flex items-start gap-2"><span className="text-green-600 font-semibold">✓</span> Trusted data sources</li>
        </ul>
      </div>
    </div>
  );
}
