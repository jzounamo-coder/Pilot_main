import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageView from "../../components/ImageViewer"; 
import { useSummary, Descriptions } from './Summary.hooks';
import { styles } from './Summary.styles';
import { PhotoCard } from './components/PhotoCard';

export default function SummaryScreen() {
  const {
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
  } = useSummary();

  const photoSections = [
    { label: 'Point A', key: 'pointA' },
    { label: 'Point B', key: 'pointB' },
    { label: 'Point C', key: 'pointC' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="document-text-outline" size={40} color="#1A237E" />
          <Text style={styles.title}>Récapitulatif : {client?.nom}</Text>
          <Text style={styles.subtitle}>ID: {client?.id} | {client?.ville}</Text>
        </View>

        <View style={styles.photoGrid}>
          {photoSections.map((section) => (
            <PhotoCard
              key={section.key}
              label={section.label}
              photoKey={section.key}
              photoUri={photos?.[section.key]}
              descriptionValue={descriptions[section.key as keyof Descriptions]}
              onOpenViewer={handleOpenViewer}
              onSave={handleSave}
              onShare={handleShare}
              onDelete={handleDelete}
              onChangeDescription={(text) => 
                handleDescriptionChange(section.key as keyof Descriptions, text)
              }
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnFinal} onPress={handleFinalValidation}>
          <Text style={styles.btnText}>VALIDER L'OPÉRATION</Text>
        </TouchableOpacity>
      </View>

      <ImageView 
        images={imagesForView} 
        imageIndex={0} 
        visible={visible} 
        onRequestClose={() => setIsVisible(false)} 
      />
    </View>
  );
}