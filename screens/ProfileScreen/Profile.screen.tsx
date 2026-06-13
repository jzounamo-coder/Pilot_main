// Profile.screen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Profile.styles';
import { useProfile } from './Profile.hooks';

export default function ProfileScreen() {
  // On récupère les données et actions depuis notre hook externe
  const { user, handleLogout } = useProfile();

  return (
    <ScrollView style={styles.container}>
      {/* Header Profil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color="white" />
        </View>
        <Text style={styles.username}>{user?.username || "Utilisateur SpeedPro"}</Text>
        <Text style={styles.email}>{user?.email || "non-renseigné@speedpro.com"}</Text>
      </View>

      {/* Section Favoris */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Discussions favorites</Text>
        <View style={styles.emptyBox}>
          <Ionicons name="star-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
        </View>
      </View>

      {/* Bouton Déconnexion */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
        <Text style={styles.logoutText}>SE DÉCONNECTER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}