import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal,
  ActivityIndicator, Platform, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const PRIMARY_BLUE = '#1A237E';
const LIGHT_BLUE = '#E8EAF6';
const BACKGROUND = '#F8F9FA';

// ── Composant carte de détail d'une demande ──
const DemandeDetailModal = ({ item, onClose }: { item: any, onClose: () => void }) => (
  <Modal visible={!!item} transparent animationType="slide" onRequestClose={onClose}>
    <View style={styles.detailOverlay}>
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <View>
            <Text style={styles.detailTitle}>Détail Demande</Text>
            <Text style={styles.detailSubtitle}>#{item?.id?.slice(-6).toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.detailCloseBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
          {/* Badge statut */}
          <View style={[styles.statusBadge, { backgroundColor: item?.statut === 'En attente' ? '#FFF8E1' : '#E8F5E9', alignSelf: 'flex-start', marginBottom: 16 }]}>
            <View style={[styles.statusDot, { backgroundColor: item?.statut === 'En attente' ? '#F59E0B' : '#10B981' }]} />
            <Text style={[styles.statusText, { color: item?.statut === 'En attente' ? '#92400E' : '#065F46' }]}>{item?.statut}</Text>
          </View>

          {/* PBO ID */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardIcon}>
              <Ionicons name="cube-outline" size={20} color={PRIMARY_BLUE} />
            </View>
            <View style={styles.detailCardContent}>
              <Text style={styles.detailCardLabel}>PBO ID</Text>
              <Text style={styles.detailCardValue}>{item?.pboId || '-'}</Text>
            </View>
          </View>

          {/* Client ID */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardIcon}>
              <Ionicons name="person-outline" size={20} color={PRIMARY_BLUE} />
            </View>
            <View style={styles.detailCardContent}>
              <Text style={styles.detailCardLabel}>Client ID</Text>
              <Text style={styles.detailCardValue}>{item?.clientId || '-'}</Text>
            </View>
          </View>

          {/* Raison */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardIcon}>
              <Ionicons name="document-text-outline" size={20} color={PRIMARY_BLUE} />
            </View>
            <View style={styles.detailCardContent}>
              <Text style={styles.detailCardLabel}>Raison</Text>
              <Text style={styles.detailCardValue}>{item?.raison || '-'}</Text>
            </View>
          </View>

          {/* SN */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardIcon}>
              <Ionicons name="qr-code-outline" size={20} color={PRIMARY_BLUE} />
            </View>
            <View style={styles.detailCardContent}>
              <Text style={styles.detailCardLabel}>Numéro de Série (SN)</Text>
              <Text style={styles.detailCardValue}>{item?.sn || '-'}</Text>
            </View>
          </View>

          {/* Date */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardIcon}>
              <Ionicons name="calendar-outline" size={20} color={PRIMARY_BLUE} />
            </View>
            <View style={styles.detailCardContent}>
              <Text style={styles.detailCardLabel}>Date de demande</Text>
              <Text style={styles.detailCardValue}>{item?.date || '-'}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default function DemandeCreation() {
  const navigation = useNavigation<any>();
  
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState<any>(null);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/pilot/ot-recreation', {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
      const rawText = await response.text();
      let json: any;
      try { json = JSON.parse(rawText); } catch (e) {
        return;
      }
      const apiData = json.data ? (Array.isArray(json.data) ? json.data : [json.data]) : [];
      const formatted = apiData.map((item: any) => ({
        id: item._id || item.id || Math.random().toString(),
        pboId: item.pboId || item.idPbo || '-',
        clientId: item.clientId || item.loginId || '-',
        raison: item.raison || item.reason || '-',
        sn: item.sn || item.serialNumber || '-',
        statut: item.statut || item.status || 'En attente',
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
          : '-',
      }));
      setDemandes(formatted);
    } catch (error) {
      console.error('Erreur fetch demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchDemandes(); }, []));

  const renderDemande = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.demandeCard} onPress={() => setSelectedDemande(item)} activeOpacity={0.8}>
      <View style={styles.demandeCardLeft}>
        <View style={styles.demandeIconBox}>
          <Ionicons name="document-outline" size={22} color={PRIMARY_BLUE} />
        </View>
        <View style={styles.demandeInfo}>
          <Text style={styles.demandePboId}>{item.pboId}</Text>
          <Text style={styles.demandeClientId}>Client : {item.clientId}</Text>
          <Text style={styles.demandeRaison} numberOfLines={1}>{item.raison}</Text>
        </View>
      </View>
      <View style={styles.demandeCardRight}>
        <View style={[styles.statusBadge, { backgroundColor: item.statut === 'En attente' ? '#FFF8E1' : '#E8F5E9' }]}>
          <View style={[styles.statusDot, { backgroundColor: item.statut === 'En attente' ? '#F59E0B' : '#10B981' }]} />
          <Text style={[styles.statusText, { color: item.statut === 'En attente' ? '#92400E' : '#065F46' }]}>
            {item.statut}
          </Text>
        </View>
        <Text style={styles.demandeDate}>{item.date}</Text>
        <Ionicons name="chevron-forward" size={16} color="#BBB" style={{ marginTop: 4 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* HEADER PREMIUM UNIFIÉ */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerSubtitle}>Suivi des demandes</Text>
          <Text style={styles.headerTitle}>Demandes Création</Text>
        </View>
        <TouchableOpacity 
          onPress={fetchDemandes} 
          style={styles.headerActionBtn} 
          disabled={loading}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={24} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>

      {/* LISTE */}
      {loading && demandes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        </View>
      ) : (
        <FlatList
          data={demandes}
          keyExtractor={(item) => item.id}
          renderItem={renderDemande}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchDemandes}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#CCC" />
              <Text style={styles.emptyText}>Aucune demande pour le moment</Text>
                <Text style={styles.emptyText}>Appuyez sur + pour créer une demande</Text>
            </View>
          }
        />
      )}

      {/* FAB BOUTON */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('NouvelleDemande')} 
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <DemandeDetailModal item={selectedDemande} onClose={() => setSelectedDemande(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  
  /* ── DESIGN HEADER PREMIUM ── */
  headerContainer: {
    backgroundColor: PRIMARY_BLUE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
  },
  headerTextContainer: { flex: 1 },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  headerActionBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  /* ────────────────────────── */

  listContainer: { padding: 16, paddingBottom: 100 },
  demandeCard: { backgroundColor: 'white', borderRadius: 14, padding: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, borderLeftWidth: 4, borderLeftColor: PRIMARY_BLUE },
  demandeCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  demandeIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: LIGHT_BLUE, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  demandeInfo: { flex: 1 },
  demandePboId: { fontSize: 14, fontWeight: 'bold', color: PRIMARY_BLUE },
  demandeClientId: { fontSize: 12, color: '#555', marginTop: 2 },
  demandeRaison: { fontSize: 12, color: '#888', marginTop: 2, fontStyle: 'italic' },
  demandeCardRight: { alignItems: 'flex-end', marginLeft: 8 },
  demandeDate: { fontSize: 10, color: '#AAA', marginTop: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 28, right: 24, width: 62, height: 62, borderRadius: 31, backgroundColor: PRIMARY_BLUE, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: PRIMARY_BLUE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  
  detailOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  detailContainer: { backgroundColor: 'white', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 20, maxHeight: '80%' },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#EFEFEF' },
  detailTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  detailSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  detailCloseBtn: { padding: 6, backgroundColor: '#F5F6FA', borderRadius: 10 },
  detailCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 14, marginBottom: 10 },
  detailCardIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: LIGHT_BLUE, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  detailCardContent: { flex: 1 },
  detailCardLabel: { fontSize: 11, color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailCardValue: { fontSize: 15, fontWeight: '700', color: '#111', marginTop: 2 },
});