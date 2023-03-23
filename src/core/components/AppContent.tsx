import { useApiContext } from '../contexts/ApiContext';
import { GuestNavigator } from './GuestNavigator';
import { RootNavigator } from './RootNavigator';

// Orientation.lockToPortrait();

export const AppContent = () => {
  const { isLogged } = useApiContext();

  if (isLogged == null) return null;

  return isLogged ? <RootNavigator /> : <GuestNavigator />;
};
