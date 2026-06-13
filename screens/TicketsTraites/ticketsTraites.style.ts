import { StyleSheet, Platform } from 'react-native';

export const PRIMARY_BLUE = '#1A237E';
export const BACKGROUND_COLOR = '#F5F6FA';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BACKGROUND_COLOR 
  },
  searchSection: { 
    paddingHorizontal: 16, 
    paddingTop: 12, 
    paddingBottom: 4 
  },
  searchWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    height: 46, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1 
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 14 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modalContent: { 
    width: '90%', 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    elevation: 10 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: PRIMARY_BLUE 
  },
  dropdownItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  itemText: { 
    fontSize: 15, 
    color: '#333' 
  },
  itemTextActive: { 
    fontSize: 15, 
    color: PRIMARY_BLUE, 
    fontWeight: 'bold' 
  },
  listContainer: { 
    paddingHorizontal: 16, 
    paddingTop: 10, 
    paddingBottom: 30 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  clientInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  iconCircle: { 
    width: 36, height: 36, 
    borderRadius: 18, 
    backgroundColor: PRIMARY_BLUE, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  clientNom: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#111' 
  },
  clientTel: { 
    fontSize: 12, 
    color: '#666' 
  },
  badge: { 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 6 
  },
  badgeNomme: { 
    backgroundColor: '#E8F5E9' 
  },
  badgeNonNomme: { 
    backgroundColor: '#FFF3E0' 
  },
  badgeText: { 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  badgeTextNomme: { 
    color: '#2E7D32' 
  },
  badgeTextNonNomme: { 
    color: '#E65100' 
  },
  cardBody: { 
    backgroundColor: '#F9FAFB', 
    padding: 12, 
    borderRadius: 8 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 4, 
    alignItems: 'center' 
  },
  infoLabel: { 
    fontSize: 12, 
    color: '#888' 
  },
  infoValue: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  highlightValue: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: PRIMARY_BLUE 
  },
  cardFooter: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 12 
  },
  dateText: { 
    fontSize: 11, 
    color: '#999', 
    marginLeft: 4 
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 40 
  },
  detailButton: { 
    flexDirection: 'row', 
    backgroundColor: PRIMARY_BLUE, 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  detailButtonText: { 
    color: 'white', 
    marginLeft: 4, 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  detailModalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  detailModalContainer: { 
    backgroundColor: 'white', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    paddingTop: 20, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, 
    maxHeight: '80%' 
  },
  detailModalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 14, 
    borderBottomWidth: 1, 
    borderColor: '#EFEFEF' 
  },
  detailModalTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: PRIMARY_BLUE 
  },
  detailModalSubtitle: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 2 
  },
  detailCloseBtn: { 
    padding: 6, 
    backgroundColor: '#F5F6FA', 
    borderRadius: 10 
  },
  clientDetailCard: { 
    marginHorizontal: 16, 
    marginTop: 16, 
    backgroundColor: 'white', 
    borderRadius: 14, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#EAEAEA', 
    borderLeftWidth: 4, 
    borderLeftColor: PRIMARY_BLUE, 
    elevation: 1 
  },
  clientDetailHeader: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  clientDetailAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#E8EAF6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  clientDetailAvatarText: { 
    color: PRIMARY_BLUE, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  clientDetailNom: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#111' 
  },
  clientDetailSub: { 
    fontSize: 12, 
    color: '#888', 
    fontStyle: 'italic', 
    marginTop: 2 
  },
  clientDetailDivider: { 
    height: 1, 
    backgroundColor: '#F5F5F5', 
    marginVertical: 12 
  },
  clientDetailRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  clientDetailVal: { 
    marginLeft: 4, 
    fontSize: 13, 
    color: '#444', 
    flex: 1 
  },
});