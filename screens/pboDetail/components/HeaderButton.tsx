import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { styles } from '../pboDetail.style';

interface HeaderButtonProps {
  isEditing: boolean;
  pboUpdating: boolean;
  onPress: () => void;
}

export const HeaderButton = React.memo(({ isEditing, pboUpdating, onPress }: HeaderButtonProps) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.headerButton, pboUpdating && { opacity: 0.7 }]}
    disabled={pboUpdating}
  >
    {pboUpdating ? (
      <ActivityIndicator size="small" color="white" />
    ) : (
      <Text style={styles.headerButtonText}>{isEditing ? "VALIDER" : "MODIFIER"}</Text>
    )}
  </TouchableOpacity>
));