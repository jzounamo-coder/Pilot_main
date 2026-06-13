import { StyleSheet } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F6FA', 
    padding: 8 
  },   
  dashboard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  statBox: { 
    flex: 1, 
    alignItems: 'center', 
    borderRightWidth: 1, 
    borderRightColor: '#EEE' 
  },
  statNumber: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  statLabel: { 
    fontSize: 11, 
    color: '#999', 
    marginTop: 1 
  },
  headerActions: { 
    flexDirection: 'row', 
    marginBottom: 10, 
    alignItems: 'center', 
    paddingHorizontal: 2 
  },
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    alignItems: 'center', 
    height: 40, 
    elevation: 1 
  },
  input: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 13 
  },
  filterBtn: { 
    marginLeft: 8, 
    backgroundColor: PRIMARY_BLUE, 
    height: 40, 
    width: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    elevation: 1,
  },
  suggestionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
    marginLeft: 4
  },
  scrollSection: {
    marginBottom: 8
  },
  chip: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E4E6EB'
  },
  chipActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE
  },
  chipText: {
    fontSize: 12,
    color: '#333'
  },
  chipTextActive: {
    color: 'white',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,      
    paddingHorizontal: 12,   
    marginBottom: 8,        
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  cardContent: { 
    flex: 1 
  },
  infoSection: { 
    flex: 1 
  },
  titleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  clientName: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#333', 
    flex: 1, 
    marginRight: 5 
  },
  clientDetails: { 
    fontSize: 12, 
    color: '#666', 
    marginBottom: 1 
  },
  badge: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 4, 
    alignSelf: 'flex-start' 
  },
  badgeText: { 
    fontWeight: 'bold', 
    fontSize: 11 
  },
  statusBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 12 
  },
  statusText: { 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  routeButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#EEE',
    paddingLeft: 10,
    alignSelf: 'stretch',
  },
  routeText: { 
    fontSize: 9, 
    fontWeight: 'bold', 
    color: PRIMARY_BLUE, 
    marginTop: 1 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 40, 
    color: '#999', 
    fontSize: 13 
  }
});