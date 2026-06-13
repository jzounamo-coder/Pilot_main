import { useState } from 'react';
import { Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export interface PhotoState {
  pointA: string | null;
  pointB: string | null;
  pointC: string | null;
}

export interface ClientData {
  nom: string;
  [key: string]: any;
}

export const useVisualisation = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const client: ClientData = route.params?.client || { nom: 'Client Inconnu' };
  
  // Reprise de l'état si l'utilisateur revient en arrière
  const [photos, setPhotos] = useState<PhotoState>(
    route.params?.photos || { pointA: null, pointB: null, pointC: null }
  );

  const takePhoto = async (pointKey: keyof PhotoState) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission refusée", "Nous avons besoin de l'accès à l'appareil photo pour documenter l'installation.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ 
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 0.7 
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos((prev) => ({ 
        ...prev, 
        [pointKey]: result.assets[0].uri 
      }));
    }
  };

  const handleNavigateNext = () => {
    navigation.navigate('SummaryScreen', { client, photos });
  };

  return {
    client,
    photos,
    takePhoto,
    handleNavigateNext,
  };
};
