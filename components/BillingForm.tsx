"use client";
import React from 'react';

export default function BillingForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());
    if (onSubmit) onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full name</label>
        <input name="fullName" required className="mt-1 block w-full rounded-md border-border shadow-sm p-2 focus:ring-primary focus:border-primary bg-background text-foreground" />
      </div>

      <div>
        <label className="text-sm font-medium">Email</label>
        <input name="email" type="email" required className="mt-1 block w-full rounded-md border-border shadow-sm p-2 focus:ring-primary focus:border-primary bg-background text-foreground" />
      </div>

      <div>
        <label className="text-sm font-medium">Address</label>
        <input name="address" className="mt-1 block w-full rounded-md border-border shadow-sm p-2 focus:ring-primary focus:border-primary bg-background text-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium">City</label>
          <input name="city" className="mt-1 block w-full rounded-md border-border shadow-sm p-2 focus:ring-primary focus:border-primary bg-background text-foreground" />
        </div>
        <div>
          <label className="text-sm font-medium">Postal</label>
          <input name="postal" className="mt-1 block w-full rounded-md border-border shadow-sm p-2 focus:ring-primary focus:border-primary bg-background text-foreground" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Country</label>
        <select name="country" className="mt-1 block w-full rounded-md border-border shadow-sm p-2 focus:ring-primary focus:border-primary bg-background text-foreground">
          <option value="">Select country</option>
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Canada</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Notes (optional)</label>
        <textarea name="notes" rows={3} className="mt-1 block w-full rounded-md border-border shadow-sm p-2 focus:ring-primary focus:border-primary bg-background text-foreground" />
      </div>

      <div className="pt-2">
        <button type="submit" className="w-full px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-semibold hover:shadow-lg">Save & Continue</button>
      </div>
    </form>
  );
}
