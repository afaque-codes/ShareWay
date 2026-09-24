/**
 * OSRM & Geocoding Service
 * Dynamically queries live Geocoding API (Photon / OpenStreetMap) and OSRM Routing Engine.
 * 100% Dynamic API-driven: No hardcoded location arrays.
 */

// In-memory LRU cache for dynamic search queries to ensure 0ms response on repeat keystrokes
const placesCache = new Map();
const MAX_CACHE_ENTRIES = 250;

/**
 * Calculate Great-Circle distance using Haversine formula (km)
 */
export function calculateHaversineDistance(lon1, lat1, lon2, lat2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Dynamically search any location from the live Geocoding API (OpenStreetMap / Photon)
 * @param {string} query Search text (city, neighborhood, landmark, railway station, airport)
 * @returns {Promise<Array<{ name: string, city: string, fullAddress: string, coords: [number, number] }>>}
 */
export async function searchPlaces(query) {
  const cleanQuery = (query || '').trim();
  if (cleanQuery.length === 0) {
    return [];
  }

  // Check cache first
  const cacheKey = cleanQuery.toLowerCase();
  if (placesCache.has(cacheKey)) {
    return placesCache.get(cacheKey);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    // Call live Geocoding API (OpenStreetMap global dataset via Photon, biased towards India)
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      cleanQuery
    )}&lat=20.5937&lon=78.9629&limit=10`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ShareWay-App/1.0',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features)) {
        // Extract & format location data dynamically from OpenStreetMap
        const livePlaces = data.features
          .filter((f) => {
            const [lon, lat] = f.geometry?.coordinates || [];
            // Prioritize India or nearby subcontinent
            const inIndia =
              f.properties?.countrycode === 'IN' ||
              f.properties?.country === 'India' ||
              (lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98);
            return inIndia;
          })
          .map((f) => {
            const props = f.properties || {};
            const name = props.name || cleanQuery;
            const locality =
              props.district || props.city || props.county || props.state || '';
            const state = props.state || '';
            const street = props.street || '';

            // Construct full readable address
            const parts = [name, street, locality, state, 'India']
              .filter(Boolean)
              .filter((v, i, a) => a.indexOf(v) === i);

            return {
              name,
              city: locality || state || 'India',
              fullAddress: parts.join(', '),
              coords: f.geometry.coordinates, // [longitude, latitude]
            };
          });

        // Deduplicate results
        const unique = [];
        for (const place of livePlaces) {
          const exists = unique.some(
            (u) =>
              u.fullAddress.toLowerCase() === place.fullAddress.toLowerCase() ||
              (Math.abs(u.coords[0] - place.coords[0]) < 0.003 &&
                Math.abs(u.coords[1] - place.coords[1]) < 0.003)
          );
          if (!exists) {
            unique.push(place);
          }
        }

        // Cache the result
        if (placesCache.size > MAX_CACHE_ENTRIES) {
          const firstKey = placesCache.keys().next().value;
          placesCache.delete(firstKey);
        }
        placesCache.set(cacheKey, unique);

        return unique.slice(0, 8);
      }
    }
  } catch (err) {
    console.warn(`[searchPlaces] Live geocoder error for "${cleanQuery}":`, err.message);
  }

  return [];
}

/**
 * Dynamically geocode an address into [longitude, latitude] using live Geocoding API
 */
export async function geocodeAddress(address) {
  if (!address || typeof address !== 'string') {
    return [77.209, 28.6139]; // Default center
  }

  const cleanAddress = address.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      cleanAddress
    )}&lat=20.5937&lon=78.9629&limit=1`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ShareWay-App/1.0',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features) && data.features.length > 0) {
        return data.features[0].geometry.coordinates; // [lon, lat]
      }
    }
  } catch (err) {
    console.warn(`[Geocoding] Live geocoding failed for "${address}":`, err.message);
  }

  // Fallback to coordinates of Delhi center
  return [77.209, 28.6139];
}

/**
 * Request real driving route from live OSRM engine
 * @param {[number, number]} originCoords [lon, lat]
 * @param {[number, number]} destinationCoords [lon, lat]
 * @returns {Promise<{ distanceKm: number, durationMinutes: number, routeGeometry: object }>}
 */
export async function getRouteDetails(originCoords, destinationCoords) {
  const [lon1, lat1] = originCoords;
  const [lon2, lat2] = destinationCoords;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
    const response = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
        const durationMinutes = Math.round(route.duration / 60);

        return {
          distanceKm,
          durationMinutes,
          routeGeometry: route.geometry, // GeoJSON LineString
        };
      }
    }
  } catch (err) {
    console.warn('[OSRM] Live routing failed or timed out, applying resilient fallback:', err.message);
  }

  // Fallback calculation: straight line distance with road winding multiplier (1.25x)
  const directDistance = calculateHaversineDistance(lon1, lat1, lon2, lat2);
  const estimatedRoadDistance = Math.round(directDistance * 1.25 * 10) / 10;
  // Estimate ~50 km/h average speed in mixed intercity traffic
  const estimatedMinutes = Math.max(15, Math.round((estimatedRoadDistance / 50) * 60));

  return {
    distanceKm: estimatedRoadDistance,
    durationMinutes: estimatedMinutes,
    routeGeometry: {
      type: 'LineString',
      coordinates: [
        [lon1, lat1],
        [(lon1 + lon2) / 2, (lat1 + lat2) / 2],
        [lon2, lat2],
      ],
    },
  };
}
