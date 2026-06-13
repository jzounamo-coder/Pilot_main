import React from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { PoleItem } from '../mapScreen.hooks';

interface PoleMarkerProps {
  pole: PoleItem;
  index: number;
}

export const PoleMarker = React.memo(({ pole, index }: PoleMarkerProps) => {
  const latitude = parseFloat(pole.lat);
  const longitude = parseFloat(pole.lng);

  if (isNaN(latitude) || isNaN(longitude)) return null;

  return (
    <Marker
      key={pole._id || `pole-${index}`}
      coordinate={{ latitude, longitude }}
      title={`Poteau: ${pole.id_material}`}
    >
      <Image 
        source={require('../../../assets/images/poteaux_metal.png')} 
        style={{ width: 30, height: 30 }} // Taille légèrement réduite pour fluidité
        resizeMode="contain"
      />
    </Marker>
  );
});