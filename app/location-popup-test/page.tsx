"use client"

export default function LocationPopupTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Location Popup Test</h1>
          
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">🧪 Testing Instructions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Test 1: First Visit (Fresh Start)</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 bg-white p-4 rounded">
                    <li>Open DevTools (F12)</li>
                    <li>Go to Console tab</li>
                    <li>Clear localStorage: <code className="bg-gray-200 px-2 py-1 rounded">localStorage.clear()</code></li>
                    <li>Reload the page (Ctrl+R or Cmd+R)</li>
                    <li>The location popup should appear</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Test 2: Force Show Popup</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 bg-white p-4 rounded">
                    <li>Add <code className="bg-gray-200 px-2 py-1 rounded">?showLocationPopup=true</code> to the URL</li>
                    <li>Visit: <code className="bg-gray-200 px-2 py-1 rounded text-amber-600 break-all">localhost:3000?showLocationPopup=true</code></li>
                    <li>The popup should appear even if you've already selected a location</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Test 3: Check localStorage</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 bg-white p-4 rounded">
                    <li>Open DevTools (F12)</li>
                    <li>Go to Application → Storage → Local Storage</li>
                    <li>Look for <code className="bg-gray-200 px-2 py-1 rounded">locationPopupShown</code></li>
                    <li>Should be set to <code className="bg-gray-200 px-2 py-1 rounded">true</code> after selecting a country</li>
                    <li>Also check <code className="bg-gray-200 px-2 py-1 rounded">selectedCountryCode</code></li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Test 4: Verify Country Selection</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 bg-white p-4 rounded">
                    <li>Select a country from the popup (e.g., Germany)</li>
                    <li>Check if currency updates to EUR</li>
                    <li>Reload the page - selected country should persist</li>
                    <li>Popup should NOT appear on reload</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-green-900 mb-4">✅ Expected Behavior</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Popup appears on first visit only</li>
                <li>Can search countries by name, code, or currency</li>
                <li>Selected country is highlighted in blue</li>
                <li>Clicking a country closes popup and updates site currency</li>
                <li>Country selection is saved in localStorage</li>
                <li>Popup does NOT appear on subsequent visits</li>
                <li>Can still change location from header</li>
              </ul>
            </div>

            <div className="bg-[#D0E3F1] border border-[#9EB8D3] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#7a5a33] mb-4">🔍 Debug Info</h2>
              <div className="space-y-2 text-gray-700 font-mono text-sm">
                <p>Check browser console for any errors (F12 → Console tab)</p>
                <p>Test URL: <code className="bg-white px-2 py-1 rounded">http://localhost:3000?showLocationPopup=true</code></p>
                <p>Check Network tab to ensure all components load</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <a 
              href="/?showLocationPopup=true" 
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
            >
              Force Show Popup →
            </a>
            <a 
              href="/" 
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Go to Homepage →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
