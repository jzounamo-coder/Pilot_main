import { StyleSheet } from 'react-native';

export const BRAND_COLOR = '#1A237E';

export const chatsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        backgroundColor: '#DFE5E7',
    },
    chatDetails: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold' as const,
        flex: 1,
        marginRight: 10,
        color: '#000',
    },
    time: {
        fontSize: 11,
        color: '#868A91',
    },
    lastMessage: {
        fontSize: 14,
        color: 'gray',
    },
    // ── Empty state ──────────────────────────────────────────────────────────
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 150,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold' as const,
        color: BRAND_COLOR,
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        lineHeight: 20,
    },
    // ── FAB ──────────────────────────────────────────────────────────────────
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: BRAND_COLOR,
        width: 65,
        height: 65,
        borderRadius: 32.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
});
