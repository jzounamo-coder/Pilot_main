import React from 'react';
import { Modal, Image, View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ImageViewing({ images, imageIndex, visible, onRequestClose }: any) {
  if (!visible) return null;
  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent animationType="fade">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onRequestClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Image
          source={images[imageIndex]}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 40, right: 20, zIndex: 10, padding: 10 },
  closeText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  image: { width: '100%', height: '80%' },
});
