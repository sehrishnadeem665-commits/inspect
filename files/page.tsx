export default function PaddleDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">🎣 Paddle.js Debug</h1>
        
        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h2 className="font-semibold text-blue-900 mb-2">Configuration</h2>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Client Token: <code className="bg-white px-2 py-1 rounded">live_0315ac06b1b66c0e808184756dc</code></li>
              <li>✓ Vendor ID: <code className="bg-white px-2 py-1 rounded">281569</code> (legacy, not used)</li>
              <li>✓ Environment: <code className="bg-white px-2 py-1 rounded">production</code></li>
              <li>✓ Method: <code className="bg-white px-2 py-1 rounded">Paddle.Initialize()</code> (v2)</li>
            </ul>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded p-4 font-mono text-sm">
            <h3 className="font-bold mb-2">Browser Console Output:</h3>
            <div id="console-output" className="space-y-1 max-h-96 overflow-auto">
              <div className="text-gray-500">Open your browser's DevTools (F12) to see console logs...</div>
            </div>
          </div>

          <div id="paddle-status" className="bg-[#D0E3F1] border border-[#9EB8D3] rounded p-4">
            <h3 className="font-semibold text-[#0d3a64] mb-2">Paddle Status:</h3>
            <div className="text-sm text-[#0f4c81]">
              <p>Waiting for Paddle.js script to load...</p>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            const statusDiv = document.getElementById('paddle-status');
            
            function updateStatus(msg, type = 'info') {
              const timeStr = new Date().toLocaleTimeString();
              const colors = {
                success: 'text-green-900 bg-green-50 border-green-200',
                error: 'text-blue-900 bg-blue-50 border-blue-200',
                warning: 'text-[#0d3a64] bg-[#D0E3F1] border-[#9EB8D3]',
                info: 'text-blue-900 bg-blue-50 border-blue-200'
              };
              statusDiv.innerHTML = '<h3 class="font-semibold mb-2">Paddle Status:</h3>' +
                '<div class="' + colors[type] + ' border rounded p-2 text-sm">' +
                '<div>[' + timeStr + '] ' + msg + '</div></div>';
            }
            
            // Poll for Paddle.js
            let attempts = 0;
            const checkPaddle = setInterval(() => {
              attempts++;
              console.log('[Paddle Debug] Check attempt ' + attempts);
              
              if (window.Paddle) {
                clearInterval(checkPaddle);
                console.log('✅ window.Paddle is available', window.Paddle);
                
                if (window.Paddle.Initialize) {
                  console.log('✅ Paddle.Initialize() method exists');
                  updateStatus('✅ Paddle.js loaded with Initialize() method', 'success');
                } else {
                  console.warn('⚠️ Paddle.Initialize not available');
                  updateStatus('⚠️ Paddle.Initialize not found - check script order', 'warning');
                }
                
                if (window.Paddle.Checkout) {
                  console.log('✅ Paddle.Checkout is available');
                } else {
                  console.log('ℹ️ Paddle.Checkout not yet available');
                }
              } else {
                if (attempts === 1) {
                  console.log('[Paddle Debug] Paddle script not loaded yet, waiting...');
                }
              }
              
              if (attempts > 40) {
                clearInterval(checkPaddle);
                console.error('❌ Paddle.js failed to load after 10 seconds');
                updateStatus('❌ Paddle.js failed to load - check CDN access', 'error');
              }
            }, 250);
          })();
        `}} />
      </div>
    </div>
  );
}
