import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useClientDetail } from './ClientDetailScreen.hooks';
import { clientDetailStyles as s } from './ClientDetaillScreen.styles';

// ─── Sous-composants ──────────────────────────────────────────────────────────

const InfoRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({
    label,
    value,
    highlight = false,
}) => (
    <>
        <Text style={s.label}>{label}</Text>
        <Text style={highlight ? s.valHighlight : s.val}>{value}</Text>
    </>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClientDetailScreen() {
    const { client, avatarLetter, handleCall, handleGoBack } = useClientDetail();

    return (
        <SafeAreaView style={s.container}>
            <ScrollView>

                {/* ── Header avatar ─────────────────────────────────────── */}
                <View style={s.header}>
                    <View style={s.avatarCircle}>
                        <Text style={s.avatarText}>{avatarLetter}</Text>
                    </View>
                    <Text style={s.clientName}>{client.name || 'Client Inconnu'}</Text>
                    <View style={s.badgeStatus}>
                        <Text style={s.badgeText}>ACTIF</Text>
                    </View>
                </View>

                {/* ── Coordonnées ───────────────────────────────────────── */}
                <View style={s.infoSection}>
                    <Text style={s.sectionTitle}>COORDONNÉES</Text>
                    <InfoRow
                        label="Téléphone"
                        value={client.phone || '+242 06 XXX XX XX'}
                    />
                    <InfoRow
                        label="Adresse / Quartier"
                        value={client.address || 'Brazzaville, Congo'}
                    />
                    <InfoRow
                        label="Email"
                        value={client.email || 'non-renseigné@mail.com'}
                    />
                </View>

                {/* ── Infos techniques ──────────────────────────────────── */}
                <View style={s.infoSection}>
                    <Text style={s.sectionTitle}>INFOS TECHNIQUES (SUR PBO)</Text>
                    <InfoRow
                        label="Numéro de Port"
                        value={`Port ${client.portNumber || 'Non assigné'}`}
                        highlight
                    />
                    <InfoRow
                        label="Offre Souscrite"
                        value={client.offre || 'Fibre Optique Résidentielle'}
                    />
                    <InfoRow
                        label="Référence Client"
                        value={client.refClient || 'SP-2026-XXXX'}
                    />
                </View>

                {/* ── Boutons d'action ──────────────────────────────────── */}
                <View style={s.actionBox}>
                    <TouchableOpacity style={s.btnAction} onPress={handleCall}>
                        <Text style={s.btnActionText}>📞 APPELER</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.btnActionPrimary} onPress={handleGoBack}>
                        <Text style={s.btnActionText}>RETOUR</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
