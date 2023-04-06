import Appsignal from '@appsignal/javascript';
import { ErrorBoundary } from '@appsignal/react';
import { APPSIGNAL_API_KEY } from '@env';

import { AppContent } from './core/components/AppContent';
import { ApiProvider } from './core/providers/ApiProvider';
import { DownloadsProvider } from './core/providers/DownloadsProvider';
import { PreferencesProvider } from './core/providers/PreferencesProvider';
import { SmartlookProvider } from './core/providers/SmartlookProvider';
import { SplashProvider } from './core/providers/SplashProvider';
import { UiProvider } from './core/providers/UiProvider';

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
                <SmartlookProvider>
                  <AppContent />
                </SmartlookProvider>
              </DownloadsProvider>
            </ApiProvider>
          </UiProvider>
        </PreferencesProvider>
      </SplashProvider>
    </ErrorBoundary>
  );
};
