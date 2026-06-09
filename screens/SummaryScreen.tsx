import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageView from "../components/ImageViewer";
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from '@react-navigation/native'; 

export default function SummaryScreen({ route, navigation }: any) {
  const isFocused = useIsFocused(); 
  const { client, photos: initialPhotos } = route.params;

  const [photos, setPhotos] = useState(initialPhotos || {});
  const [descriptions, setDescriptions] = useState({ pointA: '', pointB: '', pointC: '' });
  const [visible, setIsVisible] = useState(false);
  const [imagesForView, setImagesForView] = useState<{ uri: string }[]>([]);

  // FORCE LA MISE À JOUR DES PHOTOS QUAND ON ARRIVE SUR LA PAGE
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
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
  };

  const handleDelete = (key: string) => {
    Alert.alert("Supprimer", "Supprimer cette photo ?", [
      { text: "Annuler" },
      { text: "Supprimer", onPress: () => setPhotos({ ...photos, [key]: null }), style: "destructive" }
    ]);
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="document-text-outline" size={40} color="#1A237E" />
          <Text style={styles.title}>Récapitulatif : {client.nom}</Text>
          <Text style={styles.subtitle}>ID: {client.id} | {client.ville}</Text>
        </View>

        <View style={styles.photoGrid}>
          {[{ label: 'Point A', key: 'pointA' }, { label: 'Point B', key: 'pointB' }, { label: 'Point C', key: 'pointC' }].map((item, index) => {
            const photoUri = photos?.[item.key];
            return (
              <View key={index} style={styles.photoCard}>
                <Text style={styles.label}>{item.label}</Text>
                {photoUri ? (
                  <View>
                    <TouchableOpacity onPress={() => { setImagesForView([{ uri: photoUri }]); setIsVisible(true); }}>
                      <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
                      <View style={styles.zoomIcon}><Ionicons name="expand" size={18} color="white" /></View>
                    </TouchableOpacity>
                    <View style={styles.actionRow}>
                      <TouchableOpacity onPress={() => handleSave(photoUri)} style={styles.actionBtn}><Ionicons name="download-outline" size={20} color="#1A237E" /></TouchableOpacity>
                      <TouchableOpacity onPress={() => handleShare(photoUri)} style={styles.actionBtn}><Ionicons name="share-social-outline" size={20} color="#1A237E" /></TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.key)} style={styles.actionBtn}><Ionicons name="trash-outline" size={20} color="#D32F2F" /></TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyImage}>
                    <Ionicons name="image-outline" size={30} color="#ccc" />
                    <Text style={{color: '#999', fontSize: 12}}>Aucune photo détectée</Text>
                  </View>
                )}
                <TextInput
                  style={styles.descInput}
                  placeholder="Ajouter une description..."
                  multiline
                  value={descriptions[item.key as keyof typeof descriptions]}
                  onChangeText={(txt) => setDescriptions({ ...descriptions, [item.key]: txt })}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnFinal} onPress={handleFinalValidation}>
          <Text style={styles.btnText}>VALIDER L'OPÉRATION</Text>
        </TouchableOpacity>
      </View>

      <ImageView images={imagesForView} imageIndex={0} visible={visible} onRequestClose={() => setIsVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A237E' },
  subtitle: { fontSize: 14, color: '#666' },
  photoGrid: { width: '100%' },
  photoCard: { backgroundColor: 'white', borderRadius: 12, padding: 10, marginBottom: 20, elevation: 3 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  image: { width: '100%', height: 200, borderRadius: 8 },
  zoomIcon: { position: 'absolute', right: 10, top: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 5, padding: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  actionBtn: { padding: 5 },
  descInput: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 8, marginTop: 10, minHeight: 40 },
  emptyImage: { width: '100%', height: 200, borderRadius: 8, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  footer: { position: 'absolute', bottom: 0, backgroundColor: 'white', padding: 20, width: '100%', borderTopWidth: 1, borderColor: '#eee' },
  btnFinal: { backgroundColor: '#1A237E', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
});