import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../Status.styles';
import { Ticket } from '../Status.hooks';

interface TicketItemProps {
  item: Ticket;
  onPress: () => void;
}

export const TicketItem: React.FC<TicketItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.ticketRow} onPress={onPress}>
      <Image source={{ uri: item.imageUri }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.phoneText}>{item.name || item.phone}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.subLabel}>Abonné : </Text>
          <Text style={styles.subNumber}>{item.subscriberId}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};