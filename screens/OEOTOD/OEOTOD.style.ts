import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 10 },
  
  headerActions: { 
    flex: 1,
    flexDirection: 'row', 
    paddingHorizontal: 5, 
    paddingVertical: 10, 
    alignItems: 'center',
    paddingBottom: 5
  },
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    alignItems: 'center', 
    height: 45, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: { flex: 1, marginLeft: 10 },
  filterBtn: { 
    marginLeft: 10, 
    backgroundColor: PRIMARY_BLUE, 
    padding: 10, 
    borderRadius: 10,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },

  // ── STYLES POUR LE FILTRAGE HORIZONTAL EN CASSIER ──
  suggestionsContainer: { 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 10, 
    marginHorizontal: 5, 
    marginBottom: 10, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestionTitle: { fontSize: 11, fontWeight: 'bold', color: '#555', marginBottom: 6, marginLeft: 4 },
  scrollSection: { marginBottom: 2 },
  chip: { backgroundColor: '#F0F2F5', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E4E6EB' },
  chipActive: { backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE },
  chipText: { color: '#333', fontSize: 13 },
  chipTextActive: { color: 'white', fontWeight: 'bold' },

  // ── STYLES DES CARTES ──
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoSection: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  clientDetails: { fontSize: 13, color: '#666', marginBottom: 2 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 45,
    alignItems: 'center',
  },
  badgeText: { fontWeight: '900', fontSize: 14 },
  actionButton: { marginLeft: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  listContainer: { paddingBottom: 20, paddingTop: 5 }
});