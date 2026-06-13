import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVisualisation, PhotoState } from './Visualisation.hooks';
import { styles } from './Visualisation.styles';
import { PhotoCard } from './components/PhotoCard';

// Mapping déclaratif pour le traitement itératif propre des points de contrôle photo
const PHOTO_MAPPING: { key: keyof PhotoState; label: string }[] = [
  { key: 'pointA', label: 'Point A' },
  { key: 'pointB', label: 'Point B' },
  { key: 'pointC', label: 'Point C' },
];

export default function VisualisationScreen() {
  const { client, photos, takePhoto, handleNavigateNext } = useVisualisation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Prise de photos : {client.nom}</Text>
        
        {PHOTO_MAPPING.map((item) => (
          <PhotoCard
            key={item.key}
            label={item.label}
            imageUri={photos[item.key]}
            onPressCamera={() => takePhoto(item.key)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnNext} onPress={handleNavigateNext}>
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.btnText}> VISUALISATION </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}