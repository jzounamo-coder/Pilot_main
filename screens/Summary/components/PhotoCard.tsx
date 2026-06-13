import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../Summary.styles';

interface PhotoCardProps {
  label: string;
  photoKey: string;
  photoUri: string | null | undefined;
  descriptionValue: string;
  onOpenViewer: (uri: string) => void;
  onSave: (uri: string) => void;
  onShare: (uri: string) => void;
  onDelete: (key: string) => void;
  onChangeDescription: (text: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  label,
  photoKey,
  photoUri,
  descriptionValue,
  onOpenViewer,
  onSave,
  onShare,
  onDelete,
  onChangeDescription
}) => {
  return (
    <View style={styles.photoCard}>
      <Text style={styles.label}>{label}</Text>
      
      {photoUri ? (
        <View>
          <TouchableOpacity onPress={() => onOpenViewer(photoUri)}>
            <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
            <View style={styles.zoomIcon}>
              <Ionicons name="expand" size={18} color="white" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => onSave(photoUri)} style={styles.actionBtn}>
              <Ionicons name="download-outline" size={20} color="#1A237E" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onShare(photoUri)} style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={20} color="#1A237E" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(photoKey)} style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={20} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyImage}>
          <Ionicons name="image-outline" size={30} color="#ccc" />
          <Text style={{ color: '#999', fontSize: 12 }}>Aucune photo détectée</Text>
        </View>
      )}

      <TextInput
        style={styles.descInput}
        placeholder="Ajouter une description..."
        multiline
        value={descriptionValue}
        onChangeText={onChangeDescription}
      />
    </View>
  );
};