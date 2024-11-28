import { ErrorBoundary } from './components/error-boundary';
import GoogleMapComponent from './components/google-map';
import { MapProvider } from './providers/map-provider';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <ErrorBoundary>
        <MapProvider>
          <GoogleMapComponent />
        </MapProvider>
      </ErrorBoundary>
    </main>
  );
}
