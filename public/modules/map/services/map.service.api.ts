import { Api } from "../../../lib/api";

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

class MapServiceApi extends Api {
    async createPin({ color, latitude, longitude, title, area}: CreatePinProps): Promise<CreatePinProps> {
        await this.getToken();
        const res = await this.api.post('/api/map/pin/create', {
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
        await this.getToken();
        const res = await this.api.get('/api/map/pins');

        if (res.status !== 200) {
            throw new Error("Unexpected error creating map pin");
        }

        return res.data;
    }

    async insertPolygonInMarker({ coordinates, markerId }: UpdateAreaProps) {
        await this.getToken();
        const res = await this.api.put('/api/map/pin/'+ markerId, {
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
        await this.getToken();
        const res = await this.api.put('/api/map/pin/'+ id, {
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
        await this.getToken();
        const res = await this.api.delete('api/map/pin/'+ markerId);

        if (res.status !== 200) {
            throw new Error("Unexpected error creating map pin");
        }
    }
}

export type { Coordinates, Area, CreatePinProps };
export const mapServiceApi = new MapServiceApi();