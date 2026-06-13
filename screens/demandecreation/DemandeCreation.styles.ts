import { StyleSheet, Platform } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';
export const LIGHT_BLUE = '#E8EAF6';
export const BACKGROUND = '#F8F9FA';

// ── Helpers statut ────────────────────────────────────────────────────────────
export const getStatusColors = (statut: string) => ({
    badge: statut === 'En attente' ? '#FFF8E1' : '#E8F5E9',
    dot:   statut === 'En attente' ? '#F59E0B' : '#10B981',
    text:  statut === 'En attente' ? '#92400E' : '#065F46',
});

export const demandeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND,
    },

    // ── Header premium ────────────────────────────────────────────────────────
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
    headerTextContainer: {
        flex: 1,
    },
    headerSubtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        textTransform: 'uppercase' as const,
        fontWeight: '600' as const,
        letterSpacing: 0.8,
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold' as const,
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

    // ── Liste ─────────────────────────────────────────────────────────────────
    listContainer: {
        padding: 16,
        paddingBottom: 100,
    },

    // ── Carte demande ─────────────────────────────────────────────────────────
    demandeCard: {
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY_BLUE,
    },
    demandeCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    demandeIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: LIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    demandeInfo: {
        flex: 1,
    },
    demandePboId: {
        fontSize: 14,
        fontWeight: 'bold' as const,
        color: PRIMARY_BLUE,
    },
    demandeClientId: {
        fontSize: 12,
        color: '#555',
        marginTop: 2,
    },
    demandeRaison: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
        fontStyle: 'italic' as const,
    },
    demandeCardRight: {
        alignItems: 'flex-end' as const,
        marginLeft: 8,
    },
    demandeDate: {
        fontSize: 10,
        color: '#AAA',
        marginTop: 4,
    },

    // ── Badge statut ──────────────────────────────────────────────────────────
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold' as const,
    },

    // ── Empty state ───────────────────────────────────────────────────────────
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
        fontWeight: '600' as const,
    },

    // ── FAB ───────────────────────────────────────────────────────────────────
    fab: {
        position: 'absolute',
        bottom: 28,
        right: 24,
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: PRIMARY_BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: PRIMARY_BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },

    // ── Modal détail ──────────────────────────────────────────────────────────
    detailOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    detailContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingTop: 20,
        maxHeight: '80%',
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: '#111',
    },
    detailSubtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    detailCloseBtn: {
        padding: 6,
        backgroundColor: '#F5F6FA',
        borderRadius: 10,
    },
    detailScrollContent: {
        padding: 20,
    },
    detailStatusRow: {
        alignSelf: 'flex-start' as const,
        marginBottom: 16,
    },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    detailCardIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: LIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailCardContent: {
        flex: 1,
    },
    detailCardLabel: {
        fontSize: 11,
        color: '#888',
        fontWeight: '600' as const,
        textTransform: 'uppercase' as const,
        letterSpacing: 0.5,
    },
    detailCardValue: {
        fontSize: 15,
        fontWeight: '700' as const,
        color: '#111',
        marginTop: 2,
    },
});
