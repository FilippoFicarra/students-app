import Smartlook, {
  SmartlookRenderingMode,
} from 'react-native-smartlook-analytics';

import Appsignal from '@appsignal/javascript';
import { ErrorBoundary } from '@appsignal/react';
import { APPSIGNAL_API_KEY, SMARTLOOK_API_KEY } from '@env';

import { AppContent } from './core/components/AppContent';
import { ApiProvider } from './core/providers/ApiProvider';
import { DownloadsProvider } from './core/providers/DownloadsProvider';
import { PreferencesProvider } from './core/providers/PreferencesProvider';
import { SplashProvider } from './core/providers/SplashProvider';
import { UiProvider } from './core/providers/UiProvider';

Smartlook.instance.preferences
  .setProjectKey(SMARTLOOK_API_KEY)
  .then(() =>
    Smartlook.instance.state.setRenderingMode(
      SmartlookRenderingMode.NoRendering,
    ),
  )
  .then(() => Smartlook.instance.preferences.eventTrackingDisableAll())
  .then(() => Smartlook.instance.start());

const appsignal = new Appsignal({
  key: APPSIGNAL_API_KEY,
});

export const App = () => {
  return (
    <ErrorBoundary instance={appsignal}>
      <SplashProvider>
        <PreferencesProvider>
          <UiProvider>
            <ApiProvider>
              <DownloadsProvider>
                <AppContent />
              </DownloadsProvider>
            </ApiProvider>
          </UiProvider>
        </PreferencesProvider>
      </SplashProvider>
    </ErrorBoundary>
  );
};
