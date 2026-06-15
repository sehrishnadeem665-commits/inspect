'use client';

import { useState } from 'react';

interface VinResult {
  success: boolean;
  vin: string;
  vehicle: {
    make: string;
    model: string;
    year: string | number;
    bodyType: string;
    color: string;
    transmission: string;
    engine: string;
    driveType: string;
    fuelType: string;
    mileage: string;
  };
  history: {
    title: string;
    accidents: number;
    owners: string | number;
    theftStatus: string;
    floodDamage: boolean;
    fireDamage: boolean;
  };
  safety: {
    recalls: any[];
    recallCount: number;
  };
  reportMetadata: {
    reportDate: string;
    dataSource: string;
  };
}

export default function VinLookup() {
  const [vin, setVin] = useState('');
  const [result, setResult] = useState<VinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const cleanVin = vin.trim().toUpperCase();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
      setError('Invalid VIN. Must be 17 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/vin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: cleanVin }),
      });

      const data = await res.json();
      
      // If request successful and data found, display result
      if (res.ok && data.success) {
        setResult(data);
        setError(null);
      } else {
        // If VIN not found or error, show error message
        setError(data.error || 'VIN data not found. Please check and try again.');
        setResult(null);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setResult(null);
      console.error('VIN Lookup Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setVin(value.slice(0, 17));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={vin}
            placeholder="Enter 17-character VIN"
            onChange={handleInputChange}
            maxLength={17}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 font-medium transition"
          >
            {loading ? 'Checking...' : 'Check VIN'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {vin.length}/17 characters | Example: 3GTP1NEC4JG195626
        </p>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-amber-100 border border-amber-400 text-amber-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <p className="mt-3 text-gray-600">Fetching VIN data...</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
          {/* Vehicle Info Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6">
            <h2 className="text-2xl font-bold">
              {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
            </h2>
            <p className="text-amber-100 mt-1">VIN: {result.vin}</p>
            <p className="text-sm text-amber-100 mt-3">
              Status: <span className="font-semibold text-green-200">{result.history.title}</span>
            </p>
          </div>

          {/* Content Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Details */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-amber-500">
                Vehicle Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Engine:</span>
                  <span className="font-semibold text-gray-900">{result.vehicle.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-semibold text-gray-900">{result.vehicle.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transmission:</span>
                  <span className="font-semibold text-gray-900">{result.vehicle.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drive Type:</span>
                  <span className="font-semibold text-gray-900">{result.vehicle.driveType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Body Type:</span>
                  <span className="font-semibold text-gray-900">{result.vehicle.bodyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-semibold text-gray-900">{result.vehicle.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-semibold text-gray-900">{result.vehicle.mileage}</span>
                </div>
              </div>
            </div>

            {/* History & Safety */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-amber-500">
                History & Safety
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Owners:</span>
                  <span className="font-semibold text-gray-900">{result.history.owners}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accidents:</span>
                  <span className={`font-semibold ${result.history.accidents === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                    {result.history.accidents}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Theft Status:</span>
                  <span className="font-semibold text-gray-900">{result.history.theftStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flood Damage:</span>
                  <span className={`font-semibold ${result.history.floodDamage ? 'text-amber-600' : 'text-green-600'}`}>
                    {result.history.floodDamage ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fire Damage:</span>
                  <span className={`font-semibold ${result.history.fireDamage ? 'text-amber-600' : 'text-green-600'}`}>
                    {result.history.fireDamage ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recalls:</span>
                  <span className={`font-semibold ${result.safety.recallCount === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {result.safety.recallCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recalls List */}
          {result.safety.recallCount > 0 && (
            <div className="border-t border-gray-200 p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Recalls</h3>
              <div className="space-y-2">
                {result.safety.recalls.map((recall, idx) => (
                  <div key={idx} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm font-semibold text-orange-900">{recall.title || recall.description || `Recall ${idx + 1}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-4 text-center text-xs text-gray-500">
            <p>Data Source: {result.reportMetadata.dataSource}</p>
            <p>Report Generated: {new Date(result.reportMetadata.reportDate).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Enter a VIN to get started</p>
          <p className="text-gray-400 text-sm mt-2">Worldwide VIN decoder powered by auto.dev</p>
        </div>
      )}
    </div>
  );
}
