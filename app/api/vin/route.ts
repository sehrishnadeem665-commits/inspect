import { NextRequest, NextResponse } from 'next/server';

const US_API_BASE_URL = 'https://api.auto.dev/vin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const vin = body?.vin?.trim().toUpperCase();

    // VIN Validation (17 alphanumeric characters)
    if (!vin || !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid VIN. Must be exactly 17 alphanumeric characters.',
          code: 'INVALID_VIN_FORMAT',
        },
        { status: 400 }
      );
    }

    console.log(`[VIN API] Processing US VIN: ${vin}`);
    return await fetchUSVINData(vin);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[VIN API] Error:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: errorMessage,
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}

// Fetch US VIN Data (auto.dev)
async function fetchUSVINData(vin: string) {
  try {
    const apiKey = process.env.AUTO_DEV_API_KEY;
    console.log(`[VIN API] API Key configured: ${!!apiKey}`);
    
    if (!apiKey) {
      console.log('[VIN API] AUTO_DEV_API_KEY is not set. Manual lookup mode active.');
      return NextResponse.json(
        {
          success: false,
          error: 'Manual lookup required',
          code: 'MANUAL_LOOKUP',
          note: 'Please use the manual entry form.',
        },
        { status: 200 } // Return 200 to avoid console error
      );
    }

    const apiUrl = `${US_API_BASE_URL}/${vin}?apiKey=${apiKey}`;
    console.log(`[VIN API] Fetching from: ${US_API_BASE_URL}/${vin}?apiKey=${apiKey.substring(0, 5)}***`);

    // Create an AbortController with a 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error(`[VIN API] Request timeout for VIN: ${vin}`);
    }, 10000);

    let response;
    let data;
    
    try {
      console.log(`[VIN API] Making fetch request to external API...`);
      response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'True Inspectify/1.0',
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);
      
      console.log(`[VIN API] Received response with status: ${response.status}`);
      data = await response.json();
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle abort error (timeout)
      if (fetchError.name === 'AbortError') {
        console.error(`[VIN API] Request timeout for VIN: ${vin}`);
        return NextResponse.json(
          {
            success: false,
            error: 'External API request timeout',
            details: 'The VIN lookup service is currently unavailable. Please try again later.',
            code: 'API_TIMEOUT',
          },
          { status: 504 }
        );
      }
      
      // Handle other network errors
      console.error(`[VIN API] Network error: ${fetchError.message}`);
      console.error(`[VIN API] Error stack:`, fetchError.stack);
      return NextResponse.json(
        {
          success: false,
          error: 'Network error while fetching VIN data',
          details: fetchError.message,
          code: 'NETWORK_ERROR',
          debug: `Error: ${fetchError.message}`,
        },
        { status: 503 }
      );
    }

    if (!response.ok) {
      console.warn(`[VIN API] API returned status ${response.status} for VIN: ${vin}`);
      console.warn(`[VIN API] Response data:`, JSON.stringify(data).substring(0, 200));
      return NextResponse.json(
        {
          success: false,
          error: data.error || 'VIN not found or invalid',
          details: data,
          code: 'VIN_NOT_FOUND',
        },
        { status: response.status }
      );
    }

    // Helper function to extract fuel type from engine description
    const extractFuelType = (engineStr: string, driveStr: string): string => {
      if (!engineStr || engineStr === 'N/A') return 'Gasoline'; // Default to Gasoline
      const lowerEngine = engineStr.toLowerCase();
      if (lowerEngine.includes('diesel')) return 'Diesel';
      if (lowerEngine.includes('hybrid')) return 'Hybrid';
      if (lowerEngine.includes('electric') || lowerEngine.includes('ev')) return 'Electric';
      if (lowerEngine.includes('plug-in')) return 'Plug-in Hybrid';
      return 'Gasoline'; // Default
    };

    const engineStr = data.engine || '';
    const driveStr = data.drive || '';
    const fuelType = extractFuelType(engineStr, driveStr);
    
    // Use the most recent year from years array if available, otherwise use year field
    let yearValue = data.vehicle?.year || data.year || 'N/A';
    if (data.years && Array.isArray(data.years) && data.years.length > 0) {
      // If year is N/A, use the most recent year from the array
      if (yearValue === 'N/A') {
        yearValue = Math.max(...data.years.filter((y: any) => typeof y === 'number'));
      }
    }
    
    // Use type field if available for bodyType
    const bodyType = data.body || data.type || data.bodyType || data.body_class || 'N/A';

    // Format comprehensive US VIN data
    const basicReport = {
      success: true,
      vin,
      country: 'United States',
      countryCode: 'US',
      vehicle: {
        // Basic identification
        make: data.make || 'N/A',
        model: data.model || 'N/A',
        year: yearValue,
        bodyType: bodyType,
        color: data.color || 'N/A',
        
        // Engine & Performance
        transmission: data.transmission || 'N/A',
        engine: data.engine || data.engine_displacement || 'N/A',
        engineType: data.engineType || data.engine_type || 'N/A',
        fuelType: fuelType,
        horsepower: data.horsepower || data.power || 'N/A',
        driveType: data.drive || data.driveType || data.drive_type || 'N/A',
        
        // Dimensions & Capacity
        mileage: data.mileage || 'Unknown',
        doors: data.doors || data.number_of_doors || 'N/A',
        seatingCapacity: data.seatingCapacity || data.seating_capacity || 'N/A',
        cargoCapacity: data.cargoCapacity || data.cargo_capacity || 'N/A',
        gvwr: data.gvwr || data.gross_vehicle_weight_rating || 'N/A',
        
        // Technical specs
        wheelbase: data.wheelbase || 'N/A',
        length: data.length || 'N/A',
        width: data.width || 'N/A',
        height: data.height || 'N/A',
        fuelTankCapacity: data.fuelTankCapacity || data.fuel_tank_capacity || 'N/A',
        
        // Features & Safety
        airbags: data.airbags || data.number_of_airbags || 'N/A',
        abs: data.abs || false,
        traction_control: data.traction_control || false,
        stability_control: data.stability_control || false,
      },
      history: {
        title: data.title || 'Clean',
        titleBrands: data.titleBrands || data.title_brands || [],
        accidents: data.accidents || data.accident_count || 0,
        owners: data.owners || data.owner_count || 'Unknown',
        theftStatus: data.theftStatus || data.theft_status || 'Not Reported',
        
        // Damage history
        floodDamage: data.floodDamage || data.flood_damage || false,
        fireDamage: data.fireDamage || data.fire_damage || false,
        structuralDamage: data.structuralDamage || data.structural_damage || false,
        lemonStatus: data.lemonStatus || data.lemon_status || 'Not a Lemon',
        
        // Service & registration
        serviceRecords: data.serviceRecords || data.service_records || 0,
        registrations: data.registrations || data.registration_count || 0,
        
        // Additional history
        auctions: data.auctions || false,
        dealerAuctions: data.dealerAuctions || false,
        coParted: data.coParted || false,
        salvageTitle: data.salvageTitle || data.salvage_title || false,
        lien: data.lien || false,
      },
      safety: {
        recalls: data.recalls || [],
        recallCount: (data.recalls || []).length,
        safetyRating: data.safetyRating || data.safety_rating || 'N/A',
        crashTestRating: data.crashTestRating || data.crash_test_rating || 'N/A',
        nhtsa_rating: data.nhtsa_rating || 'N/A',
        iihs_rating: data.iihs_rating || 'N/A',
      },
      market: {
        marketValue: data.marketValue || data.market_value || 'N/A',
        depreciation: data.depreciation || 'N/A',
        estimatedResaleValue: data.estimatedResaleValue || data.estimated_resale_value || 'N/A',
      },
      registrationInfo: {
        registrationState: data.registrationState || data.registration_state || 'N/A',
        registrationStatus: data.registrationStatus || data.registration_status || 'N/A',
        licensePlate: data.licensePlate || data.license_plate || 'N/A',
        odometer: data.odometer || 'Unknown',
        lastServiceDate: data.lastServiceDate || 'N/A',
      },
      manufacturerInfo: {
        manufacturingCountry: 'United States',
        plantCode: data.plantCode || data.plant_code || 'N/A',
        serialNumber: data.serialNumber || data.serial_number || 'N/A',
        checkDigit: data.checkDigit || data.check_digit || 'N/A',
      },
      reportMetadata: {
        reportDate: new Date().toISOString(),
        dataSource: 'auto.dev VIN Decoder API',
        apiVersion: '2.0',
        region: 'United States',
      },
    };

    console.log(`[VIN API] Successfully returned report for VIN: ${vin}`);
    return NextResponse.json(basicReport, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[VIN API] Error fetching VIN data:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch VIN data',
        details: errorMessage,
        code: 'FETCH_ERROR',
      },
      { status: 500 }
    );
  }
}

// Optional GET handler for ?vin= query
export async function GET(request: NextRequest) {
  try {
    const vin = request.nextUrl.searchParams.get('vin');
    if (!vin) {
      return NextResponse.json(
        { success: false, error: 'VIN parameter is required', code: 'MISSING_VIN' },
        { status: 400 }
      );
    }

    // Forward to POST logic
    const postRequest = new NextRequest(request, { 
      method: 'POST', 
      body: JSON.stringify({ vin }) 
    });
    return POST(postRequest);
  } catch (error) {
    console.error('[VIN API] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'GET_ERROR' },
      { status: 500 }
    );
  }
}
