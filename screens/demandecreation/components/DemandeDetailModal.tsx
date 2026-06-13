import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Demande } from '../DemandeCreation.hooks';
import { demandeStyles as s, PRIMARY_BLUE, getStatusColors } from '../DemandeCreation.styles';

// ─── Ligne de détail réutilisable ─────────────────────────────────────────────

interface DetailCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ icon, label, value }) => (
    <View style={s.detailCard}>
        <View style={s.detailCardIcon}>
            <Ionicons name={icon} size={20} color={PRIMARY_BLUE} />
        </View>
        <View style={s.detailCardContent}>
            <Text style={s.detailCardLabel}>{label}</Text>
            <Text style={s.detailCardValue}>{value}</Text>
        </View>
    </View>
);

// ─── Modal ────────────────────────────────────────────────────────────────────

interface DemandeDetailModalProps {
    item: Demande | null;
    onClose: () => void;
}

const DemandeDetailModal: React.FC<DemandeDetailModalProps> = ({ item, onClose }) => {
    const statusColors = item ? getStatusColors(item.statut) : null;

    return (
        <Modal
            visible={!!item}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={s.detailOverlay}>
                <View style={s.detailContainer}>

                    {/* Header */}
                    <View style={s.detailHeader}>
                        <View>
                            <Text style={s.detailTitle}>Détail Demande</Text>
                            <Text style={s.detailSubtitle}>
                                #{item?.id?.slice(-6).toUpperCase()}
                            </Text>
                        </View>
                        <TouchableOpacity style={s.detailCloseBtn} onPress={onClose}>
                            <Ionicons name="close" size={22} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={s.detailScrollContent}
                    >
                        {/* Badge statut */}
                        {statusColors && (
                            <View style={[s.statusBadge, s.detailStatusRow, { backgroundColor: statusColors.badge }]}>
                                <View style={[s.statusDot, { backgroundColor: statusColors.dot }]} />
                                <Text style={[s.statusText, { color: statusColors.text }]}>
                                    {item?.statut}
                                </Text>
                            </View>
                        )}

                        <DetailCard icon="cube-outline"          label="PBO ID"              value={item?.pboId    || '-'} />
                        <DetailCard icon="person-outline"        label="Client ID"            value={item?.clientId || '-'} />
                        <DetailCard icon="document-text-outline" label="Raison"               value={item?.raison   || '-'} />
                        <DetailCard icon="qr-code-outline"       label="Numéro de Série (SN)" value={item?.sn       || '-'} />
                        <DetailCard icon="calendar-outline"      label="Date de demande"      value={item?.date     || '-'} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default DemandeDetailModal;
