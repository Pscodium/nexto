import api from "../../../lib/api";

type Coordinates = [number, number][]

interface Area {
    coordinates: Coordinates[];
    type: string;
}

interface CreatePinProps {
    title: string;
    color: string;
    latitude: string | number;
    longitude: string | number;
    area?: Area;
    id?: number;
}

interface UpdatePinProps {
    title?: string;
    color?: string;
    latitude?: string | number;
    longitude?: string | number;
    area?: Area;
    id?: number;
}

interface UpdateAreaProps {
    coordinates: Coordinates[];
    markerId: number;
}

class MapServiceApi {
    async createPin({ color, latitude, longitude, title, area}: CreatePinProps): Promise<CreatePinProps> {
        const res = await api.post('/api/map/pin/create', {
            title: title,
            color: color,
            latitude: latitude,
            longitude: longitude,
            area: area
        });

        if (res.status !== 200) {
            throw new Error("Unexpected error creating map pin");
        }

        return res.data;
    }

    async getAllMarkers(): Promise<CreatePinProps[]> {
        const res = await api.get('/api/map/pins');

        if (res.status !== 200) {
            throw new Error("Unexpected error creating map pin");
        }

        return res.data;
    }

    async insertPolygonInMarker({ coordinates, markerId }: UpdateAreaProps) {
        const res = await api.put('/api/map/pin/'+ markerId, {
            area: {
                type: 'Polygon',
                coordinates: coordinates,
            }
        });

        if (res.status !== 200) {
            throw new Error("Unexpected error creating map pin");
        }

        return res.data;
    }

    async updateMarkerPosition({ latitude, longitude, id }: UpdatePinProps) {
        const res = await api.put('/api/map/pin/'+ id, {
            latitude: latitude,
            longitude: longitude,
            area: null
        });

        if (res.status !== 200) {
            throw new Error("Unexpected error creating map pin");
        }

        return res.data;
    }

    async deleteMarker(markerId: number) {
        const res = await api.delete('api/map/pin/'+ markerId);

        if (res.status !== 200) {
            throw new Error("Unexpected error creating map pin");
        }
    }
}

export type { Coordinates, Area, CreatePinProps };
export const mapServiceApi = new MapServiceApi();