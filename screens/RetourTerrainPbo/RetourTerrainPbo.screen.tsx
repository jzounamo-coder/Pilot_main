import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Imports internes découpés
import { useRetourTerrain } from './useRetourTerrain.hooks';
import { ClientPortItem } from './components/ClientPortItem';
import { ClientEditModal } from './components/ClientEditModal';
import { styles, PRIMARY_BLUE, LIGHT_BLUE } from './retourTerrain.styles';

export default function RetourTerrainPbo() {
  const navigation = useNavigation();
  const hook = useRetourTerrain();

  return (
    <View style={styles.container}>
      
      {/* ── HEADER PREMIUM UNIFIÉ ── */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerSubtitle}>suivi infrastructures</Text>
          <Text style={styles.headerTitle}>Retour terrain</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerHistoryBtn} 
          onPress={() => navigation.navigate('ListeRetoursTerrain' as never)} 
          activeOpacity={0.8}
        >
          <Ionicons name="time-outline" size={24} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[{ key: 'content' }]}
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <View style={{ padding: 12 }}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Configuration Type de PBO</Text>
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={[styles.actionBtn, hook.estPboNomme === true && { backgroundColor: LIGHT_BLUE, borderColor: PRIMARY_BLUE }]} onPress={() => hook.setEstPboNomme(true)} activeOpacity={0.8}>
                  <Ionicons name="bookmark-outline" size={16} color={hook.estPboNomme === true ? PRIMARY_BLUE : "#666"} />
                  <Text style={[styles.btnText, hook.estPboNomme === true && { color: PRIMARY_BLUE, fontWeight: '600' }]}>PBO Nommé</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, hook.estPboNomme === false && { backgroundColor: LIGHT_BLUE, borderColor: PRIMARY_BLUE }]} onPress={() => hook.setEstPboNomme(false)} activeOpacity={0.8}>
                  <Ionicons name="help-circle-outline" size={16} color={hook.estPboNomme === false ? PRIMARY_BLUE : "#666"} />
                  <Text style={[styles.btnText, hook.estPboNomme === false && { color: PRIMARY_BLUE, fontWeight: '600' }]}>Non Nommé</Text>
                </TouchableOpacity>
              </View>

              {hook.estPboNomme === true && (
                <View style={{ marginTop: 14 }}>
                  <Text style={styles.inputLabel}>Nom du PBO (Format Imbriqué BZV-)</Text>
                  <View style={styles.nestedInputContainer}>
                    <View style={styles.prefixLabelBox}>
                      <Text style={styles.prefixLabelText}>BZV-</Text>
                    </View>
                    <TextInput
                      style={styles.maInputField}
                      value={hook.pboMA}
                      onChangeText={hook.handleMAChange}
                      placeholder="G01"
                      placeholderTextColor="#AAA"
                      autoCapitalize="characters"
                      editable={!hook.pboDetails}
                    />
                    <Text style={styles.dashSeparator}>-PB-</Text>
                    <TextInput
                      style={styles.numeroInputField}
                      value={hook.pboNumero}
                      onChangeText={hook.handleNumeroChange}
                      placeholder="0000"
                      placeholderTextColor="#AAA"
                      keyboardType="numeric"
                      editable={!hook.pboDetails}
                    />
                    {!hook.pboDetails && hook.pboVerificationStatus !== 'NOT_FOUND' ? (
                      <TouchableOpacity style={styles.checkInnerBtn} onPress={hook.verifyNamedPbo}>
                        {hook.loadingClients
                          ? <ActivityIndicator size="small" color="white" />
                          : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>Check</Text>
                        }
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.clearInnerBtn} onPress={() => { hook.setPboDetails(null); hook.setPboValideNom(null); hook.setPboVerificationStatus(null); hook.setClients(hook.generateFullPortList([])); }}>
                        <Ionicons name="close" size={18} color="#D32F2F" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {hook.pboVerificationStatus === 'FOUND' && (
                    <View style={styles.pboSuccessDottedBox}>
                      <Ionicons name="checkmark-circle" size={16} color="#2E7D32" style={{ marginRight: 6 }} />
                      <Text style={styles.pboSuccessDottedText}>PBO trouvé ({hook.pboValideNom})</Text>
                      {hook.pboDetails?.typeSplitter && (
                        <Text style={{ fontSize: 12, color: '#2E7D32', marginLeft: 'auto', fontWeight: '500' }}>
                          ({hook.pboDetails.typeSplitter})
                        </Text>
                      )}
                    </View>
                  )}

                  {hook.pboVerificationStatus === 'NOT_FOUND' && (
                    <View style={styles.pboErrorDottedBox}>
                      <Ionicons name="close-circle" size={16} color="#D32F2F" style={{ marginRight: 6 }} />
                      <Text style={styles.pboErrorText}>PBO non trouvé</Text>
                    </View>
                  )}
                </View>
              )}

              {hook.estPboNomme === false && (
                <View style={{ marginTop: 14 }}>
                  <View style={styles.warningInputBox}>
                    <Ionicons name="warning-outline" size={20} color="#D32F2F" style={styles.warningIconField} />
                    <Text style={styles.warningInputText}>
                      Avant d'enregistrer les informations veuillez vous rapprocher à moins de 1 mètre
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {(hook.pboVerificationStatus === 'FOUND' || hook.estPboNomme === false) && (
              <>
                <View style={styles.portsManagementCard}>
                  <View style={styles.portsCardHeader}>
                    <Text style={styles.portsSectionTitle}>Configuration des Ports </Text>
                    <TouchableOpacity style={styles.discreetCalcBtn} onPress={hook.handleCalculateTotal} activeOpacity={0.7}>
                      <Ionicons name="calculator-outline" size={13} color={PRIMARY_BLUE} style={{ marginRight: 4 }} />
                      <Text style={styles.discreetCalcText}>enregistrer</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.editableStatsRow}>
                    <View style={[styles.statInputBadge, { borderColor: '#2E7D32' }]}>
                      <Text style={[styles.statLabelText, { color: '#2E7D32' }]}> Libres</Text>
                      <View style={styles.inputWithIconRow}>
                        <Ionicons name="pencil-outline" size={12} color="#2E7D32" style={{ marginRight: 4 }} />
                        <TextInput
                          style={[styles.statTextInput, { color: '#2E7D32' }]}
                          value={hook.portsLibres}
                          onChangeText={(txt) => {
                            hook.setPortsLibres(txt);
                            const lib = parseInt(txt, 10) || 0;
                            const occ = parseInt(hook.portsOccupes, 10) || 0;
                            hook.setPortsTotal(String(lib + occ));
                          }}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                      </View>
                    </View>

                    <View style={[styles.statInputBadge, { borderColor: '#C62828' }]}>
                      <Text style={[styles.statLabelText, { color: '#C62828' }]}>Occupés</Text>
                      <View style={styles.inputWithIconRow}>
                        <Ionicons name="pencil-outline" size={12} color="#C62828" style={{ marginRight: 4 }} />
                        <TextInput
                          style={[styles.statTextInput, { color: '#C62828' }]}
                          value={hook.portsOccupes}
                          onChangeText={(txt) => {
                            hook.setPortsOccupes(txt);
                            const occ = parseInt(txt, 10) || 0;
                            const lib = parseInt(hook.portsLibres, 10) || 0;
                            hook.setPortsTotal(String(lib + occ));
                          }}
                          keyboardType="numeric"
                          maxLength={2}
                        />
                      </View>
                    </View>

                    <View style={[styles.statInputBadge, { borderColor: PRIMARY_BLUE, backgroundColor: '#F0F2FF' }]}>
                      <Text style={[styles.statLabelText, { color: PRIMARY_BLUE }]}>Total</Text>
                      <Text style={[styles.statValueDisplay, { color: PRIMARY_BLUE }]}>{hook.portsTotal}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.listHeaderSection}>
                  <Ionicons name="grid-outline" size={18} color="#333" />
                  <Text style={styles.listSectionTitle}>Liste des Ports (16 ports)</Text>
                </View>

                {hook.loadingClients ? (
                  <ActivityIndicator size="large" color={PRIMARY_BLUE} style={{ marginVertical: 20 }} />
                ) : (
                  <View>
                    {hook.clients.map((item) => (
                      <ClientPortItem key={item.id} item={item} onOpenEdit={hook.openEditModal} />
                    ))}
                    {hook.clients.length === 0 && (
                      <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Aucun port trouvé.</Text>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        )}
      />

      <ClientEditModal
        isVisible={hook.isModalVisible}
        onClose={() => hook.setIsModalVisible(false)}
        isReady={hook.isReady}
        currentClient={hook.currentClient}
        savingClient={hook.savingClient}
        onSave={hook.handleSaveClient}
        formFields={{
          editNom: hook.editNom, setEditNom: hook.setEditNom,
          editPrenom: hook.editPrenom, setEditPrenom: hook.setEditPrenom,
          editTelephone: hook.editTelephone, setEditTelephone: hook.setEditTelephone,
          editNumAbonnement: hook.editNumAbonnement, setEditNumAbonnement: hook.setEditNumAbonnement,
          editArrondissement: hook.editArrondissement, setEditArrondissement: hook.setEditArrondissement,
          editQuartier: hook.editQuartier, setEditQuartier: hook.setEditQuartier,
          editAdresse: hook.editAdresse, setEditAdresse: hook.setEditAdresse,
        }}
      />
    </View>
  );
}