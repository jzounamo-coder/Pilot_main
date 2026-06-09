import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authslices';

const PRIMARY_BLUE = '#1A237E';

export default function ProfileScreen() {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);

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
                onPress={() => dispatch(logout())}
            >
                <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
                <Text style={styles.logoutText}>SE DÉCONNECTER</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { backgroundColor: 'white', padding: 30, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: PRIMARY_BLUE, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    username: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    email: { fontSize: 14, color: 'gray', marginTop: 5 },
    section: { padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: PRIMARY_BLUE, marginBottom: 15 },
    emptyBox: { height: 150, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC' },
    emptyText: { color: '#AAA', marginTop: 10 },
    logoutButton: { margin: 20, backgroundColor: '#FFEBEE', flexDirection: 'row', padding: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFCDD2' },
    logoutText: { color: '#D32F2F', fontWeight: 'bold', marginLeft: 10 }
});