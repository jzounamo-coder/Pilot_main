import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import { addPbo } from '../redux/slices/pboslices'; 

export default function PboFormScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();

  // On récupère l'état de chargement depuis Redux
  const { loading } = useSelector((state: any) => state.pbos);

  const [nomPbo, setNomPbo] = useState('');
  const [nbPboTotal, setNbPboTotal] = useState('');
  const [portsDispos, setPortsDispos] = useState('');
  const [localisation, setLocalisation] = useState('Brazzaville'); 

  const handleValiderPbo = () => {
    // Conversion en nombres pour validation
    const total = parseInt(nbPboTotal);
    const libres = parseInt(portsDispos) || 0;

    if (!nomPbo || !nbPboTotal) {
      Alert.alert("Erreur", "Veuillez remplir le nom et le nombre de PBO.");
      return;
    }

    // Sécurité : Empêcher les nombres négatifs
    if (total < 0 || libres < 0) {
      Alert.alert("Erreur", "Le nombre de ports ne peut pas être négatif.");
      return;
    }

    // Sécurité : les ports libres ne peuvent pas dépasser le total
    if (libres > total) {
      Alert.alert("Erreur", "Le nombre de ports libres ne peut pas être supérieur au total des ports.");
      return;
    }

    // --- LE POP-UP DE CONFIRMATION ---
    Alert.alert(
      "Confirmation",
      `Voulez-vous créer le PBO "${nomPbo}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "OUI, CRÉER", 
          onPress: async () => {
            // Préparation des données pour le serveur
            const pboData = {
              nomPbo,
              pboNumberTotalPort: total,
              pboNumberFreePort: libres,
              pboNumberUsedPort: total - libres, // Calcul automatique de l'occupation
              localisation,
              // On peut garder tes champs locaux si besoin
              dateMaj: new Date().toISOString(),
              imageUri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            };

            // APPEL REDUX (POST)
            const resultAction = await dispatch(addPbo(pboData));

            if (addPbo.fulfilled.match(resultAction)) {
              Alert.alert("Succès", "Le PBO a été enregistré sur le serveur.");
              navigation.goBack(); // Retour automatique à la liste
            } else {
              Alert.alert("Erreur", "Le serveur a refusé la création : " + resultAction.payload);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>Identifiant / Nom du PBO</Text>
        <TextInput 
          style={styles.input} 
          value={nomPbo} 
          onChangeText={setNomPbo} 
          placeholder="Ex: PBO-CH-01" 
          editable={!loading}
        />

        <Text style={styles.inputLabel}>Nombre total de ports</Text>
        <TextInput 
          style={styles.input} 
          value={nbPboTotal} 
          onChangeText={setNbPboTotal} 
          placeholder="Quantité" 
          keyboardType="numeric"
          editable={!loading}
        />

        <Text style={styles.inputLabel}>Nombre de ports libres</Text>
        <TextInput 
          style={styles.input} 
          value={portsDispos} 
          onChangeText={setPortsDispos} 
          placeholder="Ex: 8" 
          keyboardType="numeric"
          editable={!loading}
        />

        <Text style={styles.inputLabel}>Ville / Localisation</Text>
        <TextInput 
          style={styles.input} 
          value={localisation} 
          onChangeText={setLocalisation}
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.btnValider, loading && { opacity: 0.7 }]} 
          onPress={handleValiderPbo}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>ENREGISTRER LE PBO</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },
  formCard: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 3 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#1A237E', marginTop: 15 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 8, fontSize: 16, color: '#333' },
  btnValider: { backgroundColor: '#1A237E', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, minHeight: 50, justifyContent: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
});