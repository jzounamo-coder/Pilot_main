import React from 'react';
import { Marker } from 'react-native-maps';
import { PboItem } from '../mapScreen.hooks';

interface PboMarkerProps {
  pbo: PboItem;
  index: number;
  pinColor: string;
}

export const PboMarker = React.memo(({ pbo, index, pinColor }: PboMarkerProps) => {
  const latitude = parseFloat(pbo.lat);
  const longitude = parseFloat(pbo.lng);

  if (isNaN(latitude) || isNaN(longitude)) return null;

  return (
    <Marker
      key={pbo._id || `pbo-${index}`}
      coordinate={{ latitude, longitude }}
      title={pbo.idPbo || "PBO"}
      description={`Ports libres: ${pbo.pboNumberFreePort}`}
      pinColor={pinColor}
    />
  );
});