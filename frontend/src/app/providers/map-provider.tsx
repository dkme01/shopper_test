'use client';

import { Libraries, useJsApiLoader } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

const libraries = ['places', 'drawing', 'geometry'];

export function MapProvider({ children }: { children: ReactNode }) {

  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_API_KEY as string,
    libraries: libraries as Libraries,
  });

  if (loadError) return <p>Encountered error while loading google maps</p>

  if (!scriptLoaded) {
    return (
      <div className="flex size-full  justify-center p-8">
        <Loader2 className="h-6 w-6 m-auto animate-spin" />
      </div>
    );
  }

  return children;
}
