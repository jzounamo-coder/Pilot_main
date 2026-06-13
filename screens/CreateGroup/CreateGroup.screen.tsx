import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCreateGroup } from './CreateGroup.hooks';
import { styles, PRIMARY_BLUE } from './CreateGroup.styles';

export default function CreateGroupScreen() {
  const {
    groupName,
    setGroupName,
    filteredContacts,
    contactsCount,
    loading,
    searchText,
    handleSearch,
    handleToggleContact,
    handleBackWithAlert,
    handleConfirmCreate
  } = useCreateGroup();

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View style={[styles.groupHeader, { backgroundColor: PRIMARY_BLUE }]}>
        <TouchableOpacity onPress={handleBackWithAlert} style={{ marginRight: 20 }}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Nouveau groupe</Text>
          <Text style={{ color: 'white', fontSize: 14 }}>
            {loading ? 'Chargement...' : `${contactsCount} utilisateurs SpeedPro`}
          </Text>
        </View>
      </View>

      {/* Champs de saisie & Recherche */}
      <View style={{ padding: 15 }}>
        <TextInput 
          placeholder="Nom du groupe..." 
          style={{ fontSize: 18, borderBottomWidth: 1.5, borderBottomColor: PRIMARY_BLUE, paddingBottom: 5, marginBottom: 15 }} 
          value={groupName} 
          onChangeText={setGroupName} 
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10 }}>
          <Ionicons name="search" size={20} color="gray" />
          <TextInput 
            placeholder="Rechercher un membre..." 
            style={{ flex: 1, padding: 10 }} 
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Liste des contacts */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator color={PRIMARY_BLUE} size="large" />
        </View>
      ) : (
        <FlatList 
          data={filteredContacts} 
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleToggleContact(item.id)} 
              style={[styles.contactItem, item.selected && { backgroundColor: '#E8EAF6' }]}
            >
              <View style={[styles.avatarBase, { backgroundColor: item.selected ? PRIMARY_BLUE : '#ccc' }]}>
                {item.selected ? (
                  <Ionicons name="checkmark" size={24} color="white" />
                ) : (
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.name[0].toUpperCase()}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: item.selected ? 'bold' : 'normal' }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>{item.number}</Text>
              </View>
            </TouchableOpacity>
          )} 
        />
      )}

      {/* Bouton Flottant (FAB) de confirmation */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: PRIMARY_BLUE }]} onPress={handleConfirmCreate}>
        <Ionicons name="checkmark-done" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}