import React, { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames'; // [cite: 4]

interface IconButtonProps {
    children: ReactNode; 
    onPress?: () => void; // [cite: 7, 8]
}

export const IconButton: React.FC<IconButtonProps> = ({ children, onPress }) => (
    <TouchableOpacity onPress={onPress} style={tw`p-2`}> {/* [cite: 8] */}
        {children}
    </TouchableOpacity>
);