import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../ValidationInstallation.styles';

interface StepCardProps {
  stepNumber: number;
  title: string;
  isDone: boolean;
  children: React.ReactNode;
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  isDone,
  children,
}) => {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepCircle, isDone ? styles.stepCircleDone : null]}>
          <Text style={styles.stepNumber}>{isDone ? "✓" : stepNumber}</Text>
        </View>
        <Text style={styles.stepTitle}>{title}</Text>
      </View>
      <View style={styles.stepContent}>
        {children}
      </View>
    </View>
  );
};