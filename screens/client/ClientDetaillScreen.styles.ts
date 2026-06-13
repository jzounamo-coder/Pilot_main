import { StyleSheet } from 'react-native';

export const BRAND_COLOR = '#1A237E';

export const clientDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // ── Header ───────────────────────────────────────────────────────────────
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: BRAND_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold' as const,
    },
    clientName: {
        fontSize: 22,
        fontWeight: 'bold' as const,
        color: '#333',
    },
    badgeStatus: {
        backgroundColor: '#e6f4ea',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 10,
    },
    badgeText: {
        color: BRAND_COLOR,
        fontWeight: 'bold' as const,
        fontSize: 12,
    },
    // ── Sections info ────────────────────────────────────────────────────────
    infoSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold' as const,
        color: '#868A91',
        marginBottom: 10,
    },
    label: {
        fontSize: 11,
        color: '#aaa',
        marginTop: 15,
        textTransform: 'uppercase' as const,
    },
    val: {
        fontSize: 16,
        color: '#333',
        marginTop: 5,
        fontWeight: '500' as const,
    },
    valHighlight: {
        fontSize: 16,
        marginTop: 5,
        fontWeight: 'bold' as const,
        color: BRAND_COLOR,
    },
    // ── Actions ──────────────────────────────────────────────────────────────
    actionBox: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnAction: {
        flex: 0.48,
        backgroundColor: '#444',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnActionPrimary: {
        flex: 0.48,
        backgroundColor: BRAND_COLOR,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnActionText: {
        color: '#fff',
        fontWeight: 'bold' as const,
    },
});
