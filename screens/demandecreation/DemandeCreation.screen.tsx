import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDemandeCreation, Demande } from './DemandeCreation.hooks';
import { demandeStyles as s, PRIMARY_BLUE, getStatusColors } from './DemandeCreation.styles';
import DemandeDetailModal from './components/DemandeDetailModal';

// ─── Carte demande ────────────────────────────────────────────────────────────

const DemandeCard: React.FC<{ item: Demande; onPress: () => void }> = ({
    item,
    onPress,
}) => {
    const colors = getStatusColors(item.statut);
    return (
        <TouchableOpacity style={s.demandeCard} onPress={onPress} activeOpacity={0.8}>
            {/* Gauche */}
            <View style={s.demandeCardLeft}>
                <View style={s.demandeIconBox}>
                    <Ionicons name="document-outline" size={22} color={PRIMARY_BLUE} />
                </View>
                <View style={s.demandeInfo}>
                    <Text style={s.demandePboId}>{item.pboId}</Text>
                    <Text style={s.demandeClientId}>Client : {item.clientId}</Text>
                    <Text style={s.demandeRaison} numberOfLines={1}>{item.raison}</Text>
                </View>
            </View>

            {/* Droite */}
            <View style={s.demandeCardRight}>
                <View style={[s.statusBadge, { backgroundColor: colors.badge }]}>
                    <View style={[s.statusDot, { backgroundColor: colors.dot }]} />
                    <Text style={[s.statusText, { color: colors.text }]}>{item.statut}</Text>
                </View>
                <Text style={s.demandeDate}>{item.date}</Text>
                <Ionicons name="chevron-forward" size={16} color="#BBB" style={{ marginTop: 4 }} />
            </View>
        </TouchableOpacity>
    );
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
    <View style={s.emptyState}>
        <Ionicons name="document-outline" size={48} color="#CCC" />
        <Text style={s.emptyText}>Aucune demande pour le moment</Text>
        <Text style={s.emptyText}>Appuyez sur + pour créer une demande</Text>
    </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DemandeCreation() {
    const {
        demandes,
        loading,
        selectedDemande,
        fetchDemandes,
        openDetail,
        closeDetail,
        openNouvelleDemande,
    } = useDemandeCreation();

    return (
        <View style={s.container}>

            {/* ── Header premium ────────────────────────────────────────── */}
            <View style={s.headerContainer}>
                <View style={s.headerTextContainer}>
                    <Text style={s.headerSubtitle}>Suivi des demandes</Text>
                    <Text style={s.headerTitle}>Demandes Création</Text>
                </View>
                <TouchableOpacity
                    onPress={fetchDemandes}
                    style={s.headerActionBtn}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <Ionicons name="refresh" size={24} color={PRIMARY_BLUE} />
                </TouchableOpacity>
            </View>

            {/* ── Liste ────────────────────────────────────────────────── */}
            {loading && demandes.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={PRIMARY_BLUE} />
                </View>
            ) : (
                <FlatList
                    data={demandes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <DemandeCard item={item} onPress={() => openDetail(item)} />
                    )}
                    contentContainerStyle={s.listContainer}
                    refreshing={loading}
                    onRefresh={fetchDemandes}
                    ListEmptyComponent={<EmptyState />}
                />
            )}

            {/* ── FAB ──────────────────────────────────────────────────── */}
            <TouchableOpacity
                style={s.fab}
                onPress={openNouvelleDemande}
                activeOpacity={0.85}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            {/* ── Modal détail ─────────────────────────────────────────── */}
            <DemandeDetailModal item={selectedDemande} onClose={closeDetail} />
        </View>
    );
}
