import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface PboItem {
  _id?: string;
  lat: string;
  lng: string;
  idPbo?: string;
  pboNumberFreePort: number | string;
}

export interface PoleItem {
  _id?: string;
  lat: string;
  lng: string;
  id_material: string;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const defaultLocation = {
  latitude: -4.276043351759078,
  longitude: 15.279780031739126,
};

export function useMapData() {
  const [pbos, setPbos] = useState<PboItem[]>([]);
  const [poles, setPoles] = useState<PoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // 1. AJOUT D'UN ÉTAT POUR LA RÉGION ACTUELLE (Pour calculer le zoom)
  const [currentRegion, setCurrentRegion] = useState<Region>({
    ...defaultLocation,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const getPboColor = (freePorts: any) => {
    const free = parseInt(freePorts) || 0;
    if (free === 0) return 'red';
    if (free === 14 || free === 15) return 'yellow';
    if (free > 13) return 'green';
    return 'orange';
  };

  const fetchNearbyData = async (lat: number, lng: number) => {
    try {
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/ftth/pbo/pbo-get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: { lat, lng }
        }),
      });

      const json = await response.json();
      if (json.data?.pbos) setPbos(json.data.pbos);
      if (json.data?.poles) setPoles(json.data.poles);
    } catch (error) {
      console.error("Erreur API SpeedPro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUserLocation(defaultLocation);
        fetchNearbyData(defaultLocation.latitude, defaultLocation.longitude);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setUserLocation({ latitude, longitude });
      setCurrentRegion(newRegion); 
      fetchNearbyData(latitude, longitude);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setUserLocation({ latitude, longitude });
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    pbos,
    poles,
    loading,
    userLocation,
    currentRegion,
    setCurrentRegion,
    getPboColor
  };
}