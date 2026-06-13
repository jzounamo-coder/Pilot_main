import React from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { useTicketForm } from './TicketForm.hooks';
import { styles } from './TicketForm.styles';
import { FormField } from './components/FormField';

export default function TicketFormScreen() {
  const { form, handleInputChange, handleValider, handleGoBack } = useTicketForm();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.formCard}>
        <FormField
          label="Nom du client"
          value={form.nom}
          onChangeText={(txt) => handleInputChange('nom', txt)}
          placeholder="Nom complet"
        />

        <FormField
          label="ID Client"
          value={form.idClient}
          onChangeText={(txt) => handleInputChange('idClient', txt)}
          placeholder="ID Client unique"
        />

        <FormField
          label="Tel"
          value={form.tel}
          onChangeText={(txt) => handleInputChange('tel', txt)}
          placeholder="+242..."
          keyboardType="phone-pad"
        />

        <FormField
          label="Adresse"
          value={form.adresse}
          onChangeText={(txt) => handleInputChange('adresse', txt)}
          placeholder="Quartier, Rue..."
        />

        <FormField
          label="N. Abonnement"
          value={form.nAbonnement}
          onChangeText={(txt) => handleInputChange('nAbonnement', txt)}
          placeholder="Numéro abonnement"
        />

        <FormField
          label="PON"
          value={form.pon}
          onChangeText={(txt) => handleInputChange('pon', txt)}
          placeholder="Valeur PON"
        />

        <FormField
          label="PBO"
          value={form.pbo}
          onChangeText={(txt) => handleInputChange('pbo', txt)}
          placeholder="Nom PBO"
        />

        {/* Coordonnées Géographiques sur la même ligne */}
        <View style={styles.rowContainer}>
          <FormField
            label="Lat (Latitude)"
            value={form.lat}
            onChangeText={(txt) => handleInputChange('lat', txt)}
            placeholder="Latitude"
            containerStyle={styles.halfWidth}
          />
          <FormField
            label="Lnf (Longitude)"
            value={form.lnf}
            onChangeText={(txt) => handleInputChange('lnf', txt)}
            placeholder="Longitude"
            containerStyle={styles.halfWidth}
          />
        </View>

        <FormField
          label="Val PBO"
          value={form.valPbo}
          onChangeText={(txt) => handleInputChange('valPbo', txt)}
          placeholder="Valeur PBO"
        />

        <FormField
          label="Val PTO"
          value={form.valPto}
          onChangeText={(txt) => handleInputChange('valPto', txt)}
          placeholder="Valeur PTO"
        />

        <FormField
          label="Disn"
          value={form.disn}
          onChangeText={(txt) => handleInputChange('disn', txt)}
          placeholder="Distance"
        />

        <FormField
          label="EDL"
          value={form.edl}
          onChangeText={(txt) => handleInputChange('edl', txt)}
          placeholder="Etat des lieux"
        />

        <FormField
          label="NPL"
          value={form.npl}
          onChangeText={(txt) => handleInputChange('npl', txt)}
          placeholder="NPL"
        />

        <FormField
          label="NPV"
          value={form.npv}
          onChangeText={(txt) => handleInputChange('npv', txt)}
          placeholder="NPV"
        />

        <TouchableOpacity style={styles.btnValider} onPress={handleValider}>
          <Text style={styles.btnText}>VALIDER LE TICKET</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btnRetour} onPress={handleGoBack}>
          <Text style={styles.retourText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}