import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TicketFormScreen() {
  const navigation = useNavigation<any>();

  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [adresse, setAdresse] = useState('');
  const [nAbonnement, setNAbonnement] = useState('');
  const [pon, setPon] = useState('');
  const [pbo, setPbo] = useState('');
  const [lat, setLat] = useState('');
  const [lnf, setLnf] = useState('');
  const [valPbo, setValPbo] = useState('');
  const [valPto, setValPto] = useState('');
  const [disn, setDisn] = useState('');
  const [edl, setEdl] = useState('');
  const [npl, setNpl] = useState('');
  const [npv, setNpv] = useState('');
  const [idClient, setIdClient] = useState('');

  const handleValider = () => {
    if (!nom || !idClient) {
      Alert.alert("Attention", "Le nom et l'ID client sont obligatoires.");
      return;
    }

    const nouveauTicket = {
      id: String(Date.now()),
      name: nom,
      phone: tel,
      adresse, 
      nAbonnement,
      pon,
      pbo,
      lat,
      lnf,
      valPbo,
      valPto,
      disn,
      edl,
      npl,
      npv,
      subscriberId: idClient,
      date: new Date().toLocaleDateString(),
      imageUri: 'https://i.pinimg.com/736x/fe/82/6a/fe826a52f124f7691d096da3d4537802.jpg'
    };

    // le ticket sera ajouté à la page ticket via les paramètres
    navigation.navigate('Root', {
      screen: 'Ticket',
      params: { nouveauTicket: nouveauTicket },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>

      
      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>Nom du client</Text>
        <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Nom complet" />
        
        <Text style={styles.inputLabel}>ID Client</Text>
        <TextInput style={styles.input} value={idClient} onChangeText={setIdClient} placeholder="ID Client unique" />
        
        <Text style={styles.inputLabel}>Tel</Text>
        <TextInput style={styles.input} value={tel} onChangeText={setTel} placeholder="+242..." keyboardType="phone-pad" />
        
        <Text style={styles.inputLabel}>Adresse</Text>
        <TextInput style={styles.input} value={adresse} onChangeText={setAdresse} placeholder="Quartier, Rue..." />
        
        <Text style={styles.inputLabel}>N. Abonnement</Text>
        <TextInput style={styles.input} value={nAbonnement} onChangeText={setNAbonnement} placeholder="Numéro abonnement" />
        
        <Text style={styles.inputLabel}>PON</Text>
        <TextInput style={styles.input} value={pon} onChangeText={setPon} placeholder="Valeur PON" />
        
        <Text style={styles.inputLabel}>PBO</Text>
        <TextInput style={styles.input} value={pbo} onChangeText={setPbo} placeholder="Nom PBO" />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '48%' }}>
                <Text style={styles.inputLabel}>Lat (Latitude)</Text>
                <TextInput style={styles.input} value={lat} onChangeText={setLat} placeholder="Latitude" />
            </View>
            <View style={{ width: '48%' }}>
                <Text style={styles.inputLabel}>Lnf (Longitude)</Text>
                <TextInput style={styles.input} value={lnf} onChangeText={setLnf} placeholder="Longitude" />
            </View>
        </View>

        <Text style={styles.inputLabel}>Val PBO</Text>
        <TextInput style={styles.input} value={valPbo} onChangeText={setValPbo} placeholder="Valeur PBO" />
        
        <Text style={styles.inputLabel}>Val PTO</Text>
        <TextInput style={styles.input} value={valPto} onChangeText={setValPto} placeholder="Valeur PTO" />
        
        <Text style={styles.inputLabel}>Disn</Text>
        <TextInput style={styles.input} value={disn} onChangeText={setDisn} placeholder="Distance" />
        
        <Text style={styles.inputLabel}>EDL</Text>
        <TextInput style={styles.input} value={edl} onChangeText={setEdl} placeholder="Etat des lieux" />
        
        <Text style={styles.inputLabel}>NPL</Text>
        <TextInput style={styles.input} value={npl} onChangeText={setNpl} placeholder="NPL" />
        
        <Text style={styles.inputLabel}>NPV</Text>
        <TextInput style={styles.input} value={npv} onChangeText={setNpv} placeholder="NPV" />

        <TouchableOpacity style={styles.btnValider} onPress={handleValider}>
          <Text style={styles.btnText}>VALIDER LE TICKET</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btnRetour} onPress={() => navigation.goBack()}>
          <Text style={styles.retourText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  avatarSection: { alignItems: 'center', marginVertical: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd' },

  // Le style cameraBadge a été retiré ici
  formCard: { backgroundColor: 'white', marginHorizontal: 15, padding: 20, borderRadius: 15, elevation: 2 },
  inputLabel: { fontSize: 11, fontWeight: 'bold', color: '#1A237E', marginBottom: 2, marginTop: 12, textTransform: 'uppercase' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 5, fontSize: 16, color: '#333' },
  btnValider: { backgroundColor: '#1A237E', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  btnRetour: { marginTop: 15, alignItems: 'center' },
  retourText: { color: '#666' }
});