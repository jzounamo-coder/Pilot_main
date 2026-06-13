import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../Visualisation.styles';

interface PhotoCardProps {
  label: string;
  imageUri: string | null;
  onPressCamera: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  label,
  imageUri,
  onPressCamera,
}) => {
  return (
    <View style={styles.photoCard}>
      <TouchableOpacity style={styles.cameraBtn} onPress={onPressCamera}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Ionicons name="camera" size={40} color="#1A237E" />
        )}
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};