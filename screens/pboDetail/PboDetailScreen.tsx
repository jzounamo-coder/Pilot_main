import React, { useLayoutEffect } from 'react'; 
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { styles } from './pboDetail.style';
import { usePboDetail } from './pboDetail.hooks';
import { HeaderButton } from './components/HeaderButton';
import { ClientRow } from './components/ClientRow';

export default function PboDetailScreen() {
  const {
    pbo,
    isEditing,
    setIsEditing,
    showClients,
    toggleShowClients,
    modalVisible,
    setModalVisible,
    newClient,
    setNewClient,
    totalFixe,
    availablePorts,
    occupiedPorts,
    clientsLoading,
    pboUpdating,
    clientsSurCePbo,
    updateAvailable,
    updateOccupied,
    handleSavePbo,
    handleAddClient,
    navigation,
  } = usePboDetail();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton 
          isEditing={isEditing} 
          pboUpdating={pboUpdating} 
          onPress={() => isEditing ? handleSavePbo() : setIsEditing(true)} 
        />
      ),
    });
  }, [navigation, isEditing, pboUpdating, availablePorts, occupiedPorts]);

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
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { 
              width: `${(occupiedPorts / totalFixe) * 100}%`, 
              backgroundColor: availablePorts === 0 ? '#EF4444' : '#1A237E' 
            }]} />
          </View>

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
          <TouchableOpacity onPress={toggleShowClients} style={styles.accordionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.sectionTitle}>Liste des Clients branchés </Text>
                <View style={styles.badge}><Text style={styles.badgeText}>{clientsSurCePbo.length}</Text></View>
            </View>
            <Ionicons name={showClients ? "chevron-up" : "chevron-down"} size={24} color="#1A237E" />
          </TouchableOpacity>

          {showClients && (
            <View style={styles.clientsList}>
              {clientsLoading ? ( 
                <ActivityIndicator size="small" color="#1A237E" /> 
              ) : clientsSurCePbo.length > 0 ? (
                clientsSurCePbo.map((client: any, index: number) => (
                  <ClientRow key={index} client={client} />
                ))
              ) : ( 
                <Text style={styles.noClientText}>Aucun client trouvé.</Text> 
              )}
            </View>
          )}
        </View>
        <View style={styles.scrollSpacer} />
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