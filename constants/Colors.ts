const tintColorLight = '#0C6157';
const tintColorDark = '#fff';

// On définit notre noir transparent ici pour pouvoir le réutiliser
const TRANSPARENT_BLACK = 'rgba(0, 0, 0, 0.5)'; 

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: TRANSPARENT_BLACK, // Icône non sélectionnée en noir transparent
    tabIconSelected: tintColorLight,
    buttonBackground: TRANSPARENT_BLACK, // Pour tes futurs boutons
  },
  dark: {
    // On force les mêmes valeurs que le mode light pour éviter les changements de couleur imprévus
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: TRANSPARENT_BLACK,
    tabIconSelected: tintColorLight,
    buttonBackground: TRANSPARENT_BLACK,
  },
};