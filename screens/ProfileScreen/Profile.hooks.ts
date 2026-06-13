// Profile.hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authslices'; 

export const useProfile = () => {
  const dispatch = useDispatch();
  
  // Récupération de l'utilisateur connecté depuis le store Redux
  const user = useSelector((state: any) => state.auth.user);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    handleLogout,
  };
};