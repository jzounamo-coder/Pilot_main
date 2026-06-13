import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Demande {
    id: string;
    pboId: string;
    clientId: string;
    raison: string;
    sn: string;
    statut: string;
    date: string;
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

const formatDate = (createdAt?: string): string => {
    if (!createdAt) return '-';
    return new Date(createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const mapApiItem = (item: any): Demande => ({
    id:       item._id || item.id || Math.random().toString(),
    pboId:    item.pboId || item.idPbo || '-',
    clientId: item.clientId || item.loginId || '-',
    raison:   item.raison || item.reason || '-',
    sn:       item.sn || item.serialNumber || '-',
    statut:   item.statut || item.status || 'En attente',
    date:     formatDate(item.createdAt),
});

// ─── Hook principal ───────────────────────────────────────────────────────────

export const useDemandeCreation = () => {
    const navigation = useNavigation<any>();

    const [demandes, setDemandes]               = useState<Demande[]>([]);
    const [loading, setLoading]                 = useState(false);
    const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchDemandes = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'https://control-api-dev.speedpro.cg/api/v1/pilot/ot-recreation',
                { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
            );

            let json: any;
            try { json = JSON.parse(await response.text()); }
            catch { return; }

            const raw: any[] = json.data
                ? Array.isArray(json.data) ? json.data : [json.data]
                : [];

            setDemandes(raw.map(mapApiItem));
        } catch (error) {
            console.error('Erreur fetch demandes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh auto au focus de l'écran
    useFocusEffect(useCallback(() => { fetchDemandes(); }, []));

    // ── Navigation ────────────────────────────────────────────────────────────
    const openNouvelleDemande = () => navigation.navigate('NouvelleDemande');

    // ── Modal ─────────────────────────────────────────────────────────────────
    const openDetail  = (item: Demande) => setSelectedDemande(item);
    const closeDetail = ()              => setSelectedDemande(null);

    return {
        demandes,
        loading,
        selectedDemande,
        fetchDemandes,
        openDetail,
        closeDetail,
        openNouvelleDemande,
    };
};
