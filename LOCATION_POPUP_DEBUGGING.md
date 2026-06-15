# Location Popup - Debugging Guide

## If Popup is Not Showing

### Step 1: Clear Browser Storage
The popup only shows on **first visit**. If it's not appearing, clear your browser's localStorage:

**In Browser Console (F12 → Console tab):**
```javascript
localStorage.clear()
```

Then **reload the page** (Ctrl+R or Cmd+R). The popup should now appear.

---

### Step 2: Force Show the Popup
If clearing localStorage doesn't help, you can force the popup to show:

1. Visit this URL: `http://localhost:3000?showLocationPopup=true`
2. The popup will appear regardless of localStorage state
3. This is useful for testing without clearing all browser data

---

### Step 3: Check Browser Console for Errors
1. Open DevTools: **F12** (or right-click → Inspect)
2. Go to the **Console** tab
3. Look for red error messages
4. Common issues:
   - `Cannot find module` errors → Component not imported correctly
   - `useCountry must be used within CountryProvider` → Context not wrapped properly
   - `localStorage is not defined` → Server-side rendering issue (should be fixed)

---

### Step 4: Verify localStorage Setup
Check if localStorage values are being set correctly:

**In Browser Console:**
```javascript
// Check if popup flag exists
console.log(localStorage.getItem('locationPopupShown'))

// Check if country selection is saved
console.log(localStorage.getItem('selectedCountryCode'))

// Manually set the flag to test next time
localStorage.removeItem('locationPopupShown')
```

---

### Step 5: Check Network Tab
1. Open DevTools: **F12**
2. Go to **Network** tab
3. Reload the page
4. Look for any failed requests (red items)
5. Check if all components are loading:
   - LocationPopup.tsx should be bundled
   - lucide-react icons should load
   - CSS should apply

---

### Step 6: Verify CountryProvider is Wrapping the App
The popup needs `CountryProvider` context. Check `components/LayoutWrapper.tsx`:

```tsx
<CountryProvider>
  <LocationPopup />  // ← Must be inside provider
  <Header />
  {children}
</CountryProvider>
```

If this structure is missing, the popup won't work.

---

## Testing Checklist

- [ ] **Test 1: First Visit**
  - Clear localStorage
  - Reload page
  - Popup should appear

- [ ] **Test 2: Force Show**
  - Visit `localhost:3000?showLocationPopup=true`
  - Popup should appear

- [ ] **Test 3: Select Country**
  - Click a country in the popup
  - Popup should close
  - Check console: no errors

- [ ] **Test 4: Persistence**
  - Reload page
  - Popup should NOT appear
  - Selected country should remain

- [ ] **Test 5: Manual Change**
  - Click location button in header
  - Popup should open
  - Select different country
  - Currency should update immediately

- [ ] **Test 6: Mobile View**
  - Shrink browser window to mobile size
  - Popup should be responsive
  - All buttons clickable

---

## Development Server Restart

If changes aren't showing, restart the development server:

**In Terminal:**
```bash
# Stop the server: Ctrl+C
# Then restart:
npm run dev
```

---

## Common Issues & Solutions

### ❌ **Popup doesn't appear, no console errors**
**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Reload page: Ctrl+R
3. Check if you're inside CountryProvider

### ❌ **Error: "Cannot find module lucide-react"**
**Solution:**
```bash
npm install lucide-react
npm run dev
```

### ❌ **Error: "useCountry must be used within CountryProvider"**
**Solution:** Ensure `LocationPopup` is inside `<CountryProvider>` in `LayoutWrapper.tsx`

### ❌ **Popup shows but buttons don't respond**
**Solution:**
1. Check for JavaScript errors in Console
2. Verify Tailwind CSS is loaded
3. Try `npm run build` to check for build errors

### ❌ **Country selection doesn't persist**
**Solution:**
```javascript
// Check localStorage in console
localStorage.getItem('selectedCountryCode')
// Should return a country code like "US", "GB", "DE"
```

---

## Quick Test URL

Visit this to test the popup directly:
```
http://localhost:3000/location-popup-test?showLocationPopup=true
```

This page has all testing instructions built-in.

---

## Check ComponentStructure

Verify the import chain:
1. ✅ `LayoutWrapper.tsx` imports `LocationPopup`
2. ✅ `LocationPopup.tsx` imports `useCountry` from `CountryContext`
3. ✅ `CountryContext.tsx` exports `countries` array
4. ✅ `lib/countries.ts` exports country list

---

## Debug Components in Real-Time

**Add this to LocationPopup.tsx to debug:**
```tsx
useEffect(() => {
  console.log('LocationPopup mounted')
  console.log('isHydrated:', isHydrated)
  console.log('isOpen:', isOpen)
  console.log('localStorage locationPopupShown:', localStorage.getItem('locationPopupShown'))
}, [isHydrated, isOpen])
```

This will log the popup state to the console, helping identify where it's breaking.

---

## Still Not Working?

1. ✅ Restart dev server: `Ctrl+C` then `npm run dev`
2. ✅ Clear browser cache: Ctrl+Shift+Delete
3. ✅ Clear localhost storage: DevTools → Application → Storage → Clear All
4. ✅ Check console for errors: F12 → Console tab
5. ✅ Try incognito/private mode (fresh browser session)

If still not working, check:
- Is Next.js dev server running?
- Are you on `http://localhost:3000`?
- Does the page load at all?
