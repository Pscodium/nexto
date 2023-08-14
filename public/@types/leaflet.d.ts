/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as L from 'leaflet';
import { Marker } from 'leaflet';

type LayerType = 'marker' | 'polygon';


declare module 'leaflet' {
  namespace L {
    interface MarkerOptions {
      area?: any;
    }

    interface Marker<P = any> {
      area?: any;
    }
  }

  namespace L {
    interface LeafletEvent {
      layerType?: LayerType;
    }
  }
}