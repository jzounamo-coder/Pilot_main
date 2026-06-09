import React, { useState, useLayoutEffect, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, LayoutAnimation, Platform, UIManager, Modal, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import { fetchClients } from '../redux/slices/clientslices'; 
// Importation de l'action de mise à jour
import { updatePboPorts } from '../redux/slices/pboslices'; 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PboDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch<any>();
  const { pbo } = route.params;

  // Récupération des clients ET du statut de chargement des PBO
  const { list: allClients, loading: clientsLoading } = useSelector((state: any) => state.clients || { list: [], loading: false });
  const { loading: pboUpdating } = useSelector((state: any) => state.pbos || { loading: false });

  const [isEditing, setIsEditing] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', abonnement: '', adresse: '', tel: '' });

  // --- LOGIQUE DE PORTS UNIFIÉE ---
  const totalFixe = parseInt(pbo.pboNumberTotalPort) || 16; 
  const [availablePorts, setAvailablePorts] = useState(parseInt(pbo.pboNumberFreePort) || 0);
  const [occupiedPorts, setOccupiedPorts] = useState(parseInt(pbo.pboNumberUsedPort) || (totalFixe - (parseInt(pbo.pboNumberFreePort) || 0)));

  // --- LOGIQUE DE RECHERCHE CLIENTS ---
  useEffect(() => {
    if (newClient.abonnement.length > 2 || newClient.tel.length > 4) {
      const found = allClients.find((c: any) => 
        (c.abonnement && c.abonnement.toLowerCase().includes(newClient.abonnement.toLowerCase())) || 
        (c.tel && c.tel.includes(newClient.tel))
      );
      if (found) {
        setNewClient(prev => ({ ...prev, name: found.name || found.nom || '', adresse: found.adresse || '' }));
      }
    }
  }, [newClient.abonnement, newClient.tel]);

  const clientsSurCePbo = (pbo.clients && pbo.clients.length > 0) ? pbo.clients : allClients.filter((c: any) => c.pbo_id === pbo.id || c.pbo_id === pbo._id);

  useEffect(() => { dispatch(fetchClients()); }, [dispatch]);

  // --- LIAISON DIRECTE DES CALCULS ---
  const updateAvailable = (val: string) => {
    const free = parseInt(val) || 0;
    if (free < 0) return; // Sécurité négatif
    if (free > totalFixe) return;
    setAvailablePorts(free);
    setOccupiedPorts(totalFixe - free);
  };

  const updateOccupied = (val: string) => {
    const occ = parseInt(val) || 0;
    if (occ < 0) return; // Sécurité négatif
    if (occ > totalFixe) return;
    setOccupiedPorts(occ);
    setAvailablePorts(totalFixe - occ);
  };

  // --- SAUVEGARDE VERS LE SERVEUR ---
  const handleSavePbo = async () => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment enregistrer ces modifications sur le serveur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, Valider",
          onPress: async () => {
            try {
              const resultAction = await dispatch(updatePboPorts({
                id: pbo.id || pbo._id,
                used: occupiedPorts,
                free: availablePorts
              }));

              if (updatePboPorts.fulfilled.match(resultAction)) {
                Alert.alert("Succès", "Mise à jour du PBO réussie !");
                setIsEditing(false);
              } else {
                Alert.alert("Erreur", String(resultAction.payload || "Le serveur n'a pas pu enregistrer les modifications."));
              }
            } catch (error) {
              Alert.alert("Erreur", "Problème de connexion au serveur.");
            }
          }
        }
      ]
    );
  };

  const handleAddClient = () => {
    if (!newClient.abonnement && !newClient.tel) {
      Alert.alert("Erreur", "Abonnement ou téléphone requis.");
      return;
    }
    Alert.alert("Succès", `Client ${newClient.name} prêt à être raccordé.`);
    setModalVisible(false);
    setNewClient({ name: '', abonnement: '', adresse: '', tel: '' });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => isEditing ? handleSavePbo() : setIsEditing(true)} 
          style={[styles.headerButton, pboUpdating && { opacity: 0.7 }]}
          disabled={pboUpdating}
        >
          {pboUpdating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.headerButtonText}>{isEditing ? "VALIDER" : "MODIFIER"}</Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing, availablePorts, occupiedPorts, pboUpdating]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="package-variant-closed" size={50} color="white" />
          <Text style={styles.pboTitle}>{pbo.nomPbo || pbo.idPbo || pbo.codePbo}</Text>
          <Text style={styles.pboSubTitle}>{pbo.localisation || pbo.ville || "Brazzaville"}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Gestion des Ports (Total: {totalFixe})</Text>
          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Ports Libres</Text>
              {isEditing ? (
                <TextInput style={styles.input} keyboardType="numeric" value={String(availablePorts)} onChangeText={updateAvailable} />
              ) : (
                <Text style={[styles.value, { color: '#1A237E' }]}>{availablePorts}</Text>
              )}
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Ports Occupés</Text>
              {isEditing ? (
                <TextInput style={styles.input} keyboardType="numeric" value={String(occupiedPorts)} onChangeText={updateOccupied} />
              ) : (
                <Text style={[styles.value, { color: '#E67E22' }]}>{occupiedPorts}</Text>
              )}
            </View>
          </View>
          
          {/* BARRE DE PROGRESSION LIÉE DIRECTEMENT */}
          <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { 
                  width: `${(occupiedPorts / totalFixe) * 100}%`, 
                  backgroundColor: availablePorts === 0 ? '#EF4444' : '#1A237E' 
              }]} />
          </View>

          {/* ALERTE VISUELLE DE SATURATION LIÉE DIRECTEMENT */}
          {availablePorts === 0 && (
            <View style={styles.saturationBadge}>
              <Ionicons name="warning" size={18} color="#EF4444" />
              <Text style={styles.saturationText}>PBO SATURÉ : AUCUN PORT DISPONIBLE</Text>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Fiche Technique</Text>
          <View style={styles.detailItem}>
             <Ionicons name="map-outline" size={20} color="#1A237E" />
             <Text style={styles.detailText}>Arrondissement : <Text style={styles.boldText}>{pbo.arrondissement || 'Non renseigné'}</Text></Text>
          </View>
          <View style={styles.detailItem}>
             <Ionicons name="code-working" size={20} color="#1A237E" />
             <Text style={styles.detailText}>Projet : <Text style={styles.boldText}>{pbo.projetCode || 'FTTH-Brazza'}</Text></Text>
          </View>
          <View style={styles.detailItem}>
             <Ionicons name="barcode-outline" size={20} color="#1A237E" />
             <Text style={styles.detailText}>Code PBO : <Text style={styles.boldText}>{pbo.codePbo || pbo.idPbo || 'N/A'}</Text></Text>
          </View>
          <View style={styles.detailItem}>
             <Ionicons name="location-outline" size={20} color="#1A237E" />
             <Text style={styles.detailText}>Position : <Text style={styles.boldText}>{pbo.lat}, {pbo.lng}</Text></Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <TouchableOpacity onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setShowClients(!showClients); }} style={styles.accordionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.sectionTitle}>Liste des Clients branchés </Text>
                <View style={styles.badge}><Text style={styles.badgeText}>{clientsSurCePbo.length}</Text></View>
            </View>
            <Ionicons name={showClients ? "chevron-up" : "chevron-down"} size={24} color="#1A237E" />
          </TouchableOpacity>

          {showClients && (
            <View style={styles.clientsList}>
              {clientsLoading ? ( <ActivityIndicator size="small" color="#1A237E" /> ) : clientsSurCePbo.length > 0 ? (
                clientsSurCePbo.map((client: any, index: number) => (
                  <TouchableOpacity key={index} style={styles.clientItem}>
                    <View style={styles.portCircle}><Text style={styles.portNumber}>{client.port || '?'}</Text></View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.clientName}>{client.name || client.nom || "Sans nom"}</Text>
                        <Text style={styles.clientAbo}>{client.abonnement || "N/A"}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : ( <Text style={styles.noClientText}>Aucun client trouvé.</Text> )}
            </View>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="person-add" size={30} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un Client</Text>
            <TextInput style={styles.modalInput} placeholder="Numéro d'abonnement" value={newClient.abonnement} onChangeText={(t) => setNewClient({...newClient, abonnement: t})} />
            <TextInput style={styles.modalInput} placeholder="Numéro de téléphone" keyboardType="phone-pad" value={newClient.tel} onChangeText={(t) => setNewClient({...newClient, tel: t})} />
            <View style={{marginTop: 10, borderTopWidth: 1, borderColor: '#eee', paddingTop: 10}}>
              <TextInput style={styles.modalInput} placeholder="Nom (auto-rempli si trouvé)" value={newClient.name} onChangeText={(t) => setNewClient({...newClient, name: t})} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}><Text>Annuler</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#1A237E' }]} onPress={handleAddClient}><Text style={{ color: 'white' }}>Valider</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  headerButton: { marginRight: 15, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5, minWidth: 80, alignItems: 'center' },
  headerButtonText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  cardHeader: { backgroundColor: '#1A237E', padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  pboTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  pboSubTitle: { color: '#E7F3F0', fontSize: 14 },
  infoSection: { backgroundColor: 'white', marginHorizontal: 15, marginTop: 15, padding: 20, borderRadius: 15, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  infoBox: { width: '45%', alignItems: 'center' },
  label: { fontSize: 12, color: '#666', marginBottom: 5 },
  value: { fontSize: 24, fontWeight: 'bold' },
  input: { borderBottomWidth: 2, borderBottomColor: '#1A237E', fontSize: 22, fontWeight: 'bold', width: '60%', textAlign: 'center' },
  progressContainer: { height: 8, backgroundColor: '#EEE', borderRadius: 4, marginTop: 20, overflow: 'hidden' },
  progressBar: { height: '100%' },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  detailText: { marginLeft: 10, color: '#666', fontSize: 15 },
  boldText: { color: '#000', fontWeight: '600' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: '#1A237E', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 10 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  clientsList: { marginTop: 15, borderTopWidth: 0.5, borderTopColor: '#eee', paddingTop: 10 },
  clientItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  portCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E7F3F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  portNumber: { color: '#1A237E', fontWeight: 'bold', fontSize: 14 },
  clientName: { fontSize: 15, color: '#333', fontWeight: '500' },
  clientAbo: { fontSize: 12, color: '#999' },
  noClientText: { textAlign: 'center', color: '#999', marginVertical: 20, fontStyle: 'italic' },
  fab: { position: 'absolute', bottom: 30, right: 25, backgroundColor: '#1A237E', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A237E', marginBottom: 15 },
  modalInput: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 15, padding: 8 },
  modalBtn: { padding: 12, borderRadius: 8, width: '45%', alignItems: 'center' },
  saturationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', padding: 10, borderRadius: 10, marginTop: 15, borderWidth: 1, borderColor: '#EF4444' },
  saturationText: { color: '#B91C1C', fontWeight: 'bold', fontSize: 12, marginLeft: 8 }
});