import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export interface Descriptions {
  pointA: string;
  pointB: string;
  pointC: string;
}

export const useSummary = () => {
  const isFocused = useIsFocused(); 
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { client, photos: initialPhotos } = route.params || { client: {}, photos: {} };

  const [photos, setPhotos] = useState<Record<string, string | null>>(initialPhotos || {});
  const [descriptions, setDescriptions] = useState<Descriptions>({ pointA: '', pointB: '', pointC: '' });
  const [visible, setIsVisible] = useState(false);
  const [imagesForView, setImagesForView] = useState<{ uri: string }[]>([]);

  // Synchronisation des photos à l'activation de l'écran
  useEffect(() => {
    if (isFocused && route.params?.photos) {
      setPhotos(route.params.photos);
    }
  }, [isFocused, route.params?.photos]);

  const handleSave = async (uri: string) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Succès", "Photo sauvegardée !");
    }
  };

  const handleShare = async (uri: string) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  };

  const handleDelete = (key: string) => {
    Alert.alert("Supprimer", "Supprimer cette photo ?", [
      { text: "Annuler" },
      { 
        text: "Supprimer", 
        onPress: () => setPhotos(prev => ({ ...prev, [key]: null })), 
        style: "destructive" 
      }
    ]);
  };

  const handleDescriptionChange = (key: keyof Descriptions, text: string) => {
    setDescriptions(prev => ({ ...prev, [key]: text }));
  };

  const handleOpenViewer = (uri: string) => {
    setImagesForView([{ uri }]);
    setIsVisible(true);
  };

  const handleFinalValidation = () => {
    Alert.alert(
      "Succès", 
      "Opération terminée avec succès !",
      [
        { 
          text: "OK", 
          onPress: () => navigation.navigate('ClientJobDetail', { client }) 
        }
      ]
    );
  };

  return {
    client,
    photos,
    descriptions,
    visible,
    imagesForView,
    setIsVisible,
    handleSave,
    handleShare,
    handleDelete,
    handleDescriptionChange,
    handleOpenViewer,
    handleFinalValidation
  };
};