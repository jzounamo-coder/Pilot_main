import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function VisualisationScreen({ route, navigation }: any) {
  const { client } = route.params;
  // On initialise l'état. Si on revient en arrière, on essaie de récupérer les photos existantes
  const [photos, setPhotos] = useState<any>(route.params.photos || { pointA: null, pointB: null, pointC: null });

  const takePhoto = async (pointKey: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission refusée", "Nous avons besoin de l'accès à l'appareil photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ 
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 0.7 
    });

    if (!result.canceled) {
      setPhotos({ ...photos, [pointKey]: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Prise de photos : {client.nom}</Text>
        
        {['pointA', 'pointB', 'pointC'].map((key) => (
          <View key={key} style={styles.photoCard}>
            <TouchableOpacity style={styles.cameraBtn} onPress={() => takePhoto(key)}>
              {photos[key] ? (
                <Image source={{ uri: photos[key] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#1A237E" />
              )}
            </TouchableOpacity>
            <Text style={styles.label}>{key === 'pointA' ? 'Point A' : key === 'pointB' ? 'Point B' : 'Point C'}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btnNext} 
          // CRUCIAL : On envoie l'objet 'photos' mis à jour
          onPress={() => navigation.navigate('SummaryScreen', { client, photos: photos })}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.btnText}> VISUALISATION </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A237E', marginBottom: 20, textAlign: 'center' },
  photoCard: { backgroundColor: 'white', borderRadius: 12, padding: 10, marginBottom: 15, alignItems: 'center', elevation: 3 },
  cameraBtn: { width: '100%', height: 150, backgroundColor: '#F0F2FF', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderStyle: 'dashed', borderWidth: 2, borderColor: '#1A237E' },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  label: { marginTop: 8, fontWeight: 'bold' },
  footer: { padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eee' },
  btnNext: { backgroundColor: '#1A237E', padding: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
});