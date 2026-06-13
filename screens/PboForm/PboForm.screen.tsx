import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { usePboForm } from './PboForm.hooks';
import { styles } from './PboForm.styles';

export default function PboFormScreen() {
  const {
    nomPbo,
    setNomPbo,
    nbPboTotal,
    setNbPboTotal,
    portsDispos,
    setPortsDispos,
    localisation,
    setLocalisation,
    loading,
    handleValiderPbo
  } = usePboForm();

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