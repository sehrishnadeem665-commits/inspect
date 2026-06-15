# Location Popup & Auto-Adjustment Feature

## Overview
A location-aware popup system has been implemented that:
1. Shows a modal on the user's first visit asking them to select their location/country
2. Automatically adjusts currency and language based on the selected country
3. Allows users to change their location at any time via the header
4. Persists the selection in localStorage for future visits

## Components Created

### 1. `components/LocationPopup.tsx`
- **Purpose**: First-visit location selection modal
- **Features**:
  - Displays on first visit only (tracked via `locationPopupShown` in localStorage)
  - Searchable country list with real-time filtering
  - Shows country name, currency, and code
  - Highlights the currently selected country
  - Displays all 200+ countries from the countries database
  - Responsive design with grid layout
  
### 2. `components/LocationSelector.tsx`
- **Purpose**: Button component for manually changing location anytime
- **Features**:
  - Can be integrated into Header or Footer
  - Opens the location modal when clicked
  - Shows current country code
  - Responsive (shows icon on mobile, code on desktop)

## Updated Components

### `components/LayoutWrapper.tsx`
- Added `LocationPopup` component to show on first visit
- Popup appears before the main content

### `components/Header.tsx` (Already had location selector)
- Already includes country selection via dropdown
- Works seamlessly with the new LocationPopup

## How It Works

### First Visit
1. User opens the website
2. `LocationPopup` checks localStorage for `locationPopupShown`
3. If not found, popup displays with searchable country list
4. User selects their country
5. Selection is saved to `selectedCountryCode` in localStorage
6. `CountryContext` updates the currency and language settings
7. Popup closes and website content is displayed in the selected currency/language

### Changing Location Later
1. User clicks the location button in the header (country code)
2. The location modal opens (can be accessed anytime)
3. User selects a different country
4. Currency and language immediately update across the site
5. Settings persist in localStorage

## Currency & Language Auto-Adjustment

When a country is selected, the system automatically:
- Sets the **currency** based on `PRICING_MAP` in `lib/prices.ts`
- Sets the **language** based on the country's default language in `lib/countries.ts`
- Updates the `cv_locale` cookie for server-side rendering

### How Currency is Applied
The `getPrice()` function in `lib/prices.ts` uses the selected country's currency:
```typescript
export function getPrice(packageId: 'basic' | 'standard' | 'premium', currency = 'USD') {
  const pricing = PRICING_MAP[currency] || PRICING_MAP['USD']
  return pricing[packageId]
}
```

When components call `getPrice()`, they pass the currency from the context:
```typescript
const { selectedCountry } = useCountry()
const price = getPrice('basic', selectedCountry.currency)
```

### How Language is Applied
Translations are fetched based on the language code:
```typescript
const { selectedCountry } = useCountry()
const { t } = useTranslations(selectedCountry.language)
```

## Data Sources

### Countries List (`lib/countries.ts`)
- 200+ countries with:
  - ISO A2 country codes
  - Official country names
  - Currency codes
  - Primary language codes
  - Country codes for flag images

### Pricing Map (`lib/prices.ts`)
- USD, EUR, GBP, AUD, PLN, SEK, AED, MDL, BAM, RON, DKK, CHF, CZK, BGN, HUF, UAH
- Three tiers: Basic, Standard, Premium
- Prices automatically adjusted when currency changes

### Translation Map (`lib/translations.ts`)
- Multiple languages supported
- Maps language codes to translation dictionaries
- Falls back to English if language not found

## User Experience Flow

```
User visits website
    ↓
LocationPopup appears (first time only)
    ↓
User selects country
    ↓
Website updates:
  - Currency displayed in prices
  - Language/translations applied
  - Location saved to localStorage
    ↓
User can change location anytime via header
    ↓
Selection persists across sessions
```

## Browser Storage

### localStorage
- `selectedCountryCode`: Stores the ISO country code (e.g., "US", "GB", "DE")
- `locationPopupShown`: Flag to track first-visit status

### Cookies
- `cv_locale`: Server-side language code for rendering

## Customization

### Changing Default Country
Update in `contexts/CountryContext.tsx`:
```typescript
const [selectedCountry, setSelectedCountryState] = useState<Country>(
  countries.find(c => c.code === 'US') || countries[0]
)
```

### Adding/Removing Countries
Edit `lib/countries.ts` - modify the `countriesList` array

### Adjusting Pricing for a Currency
Edit `lib/prices.ts` - modify the `PRICING_MAP`:
```typescript
export const PRICING_MAP: Record<string, { basic: number; standard: number; premium: number }> = {
  'EUR': { basic: 27.99, standard: 46.99, premium: 65.99 },
  // Add or modify currencies here
}
```

### Changing Default Language for a Country
Edit `lib/countries.ts` - update the `language` field for a country:
```typescript
{ code: 'US', name: 'United States', countryCode: 'us', currency: 'USD', language: 'en' }
```

## Testing Locally

1. **First Visit Test**:
   - Clear browser localStorage: `localStorage.clear()`
   - Reload the page
   - LocationPopup should appear

2. **Country Selection Test**:
   - Select a different country
   - Check that prices update to the new currency
   - Verify language changes if supported

3. **Persistence Test**:
   - Close and reopen the browser
   - Selected country should be remembered
   - Popup should NOT appear on subsequent visits

4. **Manual Change Test**:
   - Click the country selector in the header
   - Select a different country
   - Verify immediate updates

## Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Uses localStorage (available in all modern browsers)
- Uses CSS Grid and Flexbox for layout
- Responsive design for mobile, tablet, and desktop

## Accessibility Features
- `autoFocus` on search input
- ARIA labels on buttons
- Keyboard navigation support
- Clear visual feedback for selected country
- Semantic HTML structure
