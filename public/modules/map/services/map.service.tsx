/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
import L, { LatLngExpression } from 'leaflet';
import { Component } from 'react';
import 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { WindowSizeProps } from '../../../components/hooks/useWindowSize';
import { MapIcon } from './map.icon.service';
import { Area, CreatePinProps, mapServiceApi } from './map.service.api';


interface MapContainerProps {
    headerHeight: number;
    windowSize: WindowSizeProps;
    pinColor: string;
}

class Map extends Component<MapContainerProps> {
    public map!: L.Map;
    public height: number;
    private drawnItems: L.FeatureGroup<any>;
    private canDrawPolygon: boolean;
    private drawControl!: L.Control;
    public windowSize: WindowSizeProps;
    private markers: Array<L.Marker<any> | any> = [];
    private initialized: boolean = false;
    private color: string;

    constructor(props: MapContainerProps) {
        super(props);
        this.windowSize = props.windowSize;
        this.color = props.pinColor;
        this.drawnItems = L.featureGroup();
        this.canDrawPolygon = false;
        this.height = props.windowSize.height ? props.windowSize.height - props.headerHeight : window.innerHeight - props.headerHeight;
        this.initialized = false;
    }

    createPolygonFromGeoJSON(geoJSON: Area) {
        let polygon;

        if (geoJSON) {
            const coordinates: any[] = [];
            geoJSON.coordinates[0].forEach(function (coordinate: any) {
                coordinates.push({
                    lat: coordinate[1],
                    lng: coordinate[0]
                });
            });
            polygon = L.polygon([coordinates]);
        }

        return polygon;
    }

    createMarkerFromPosition(latlng: any[] | L.LatLngLiteral) {
        let marker;
        if (latlng) {
            marker = L.marker(latlng as L.LatLngLiteral, {
                icon: MapIcon.customIcon(this.color)
            });
        }
        return marker;
    }

    focusMarker(zoom?: number) {
        if (this.drawnItems.hasLayer(this.markers[this.markers.length - 1])) {
            this.map.setView(this.markers[this.markers.length - 1].getLatLng(), zoom);
        }
    }

    async createMaker(layer: L.Marker<any> | undefined) {
        console.log(this.color);
        const data = await mapServiceApi.createPin({
            color: this.color,
            title: 'pin test',
            latitude: String(layer?.getLatLng().lat),
            longitude: String(layer?.getLatLng().lng)
        });

        const draw = this.createMarkerFromPosition([data.latitude, data.longitude]) as any;
        if (data.area) {
            const polygon = this.createPolygonFromGeoJSON(data.area);
            draw.area = polygon;
            this.drawnItems.addLayer(polygon as L.Layer);
        }
        draw.markerId = data.id;
        draw.color = data.color;

        this.drawnItems.addLayer(draw as L.Layer);
        this.markers.push(draw);
        this.canDrawPolygon = true;
        this.focusMarker(18);
        this.refreshControls();
    }

    buildMarker(data: CreatePinProps) {
        const draw = this.createMarkerFromPosition([data.latitude, data.longitude]) as any;
        if (data.area) {
            const polygon = this.createPolygonFromGeoJSON(data.area);
            draw.area = polygon;
            this.drawnItems.addLayer(polygon as L.Layer);
        }
        draw.markerId = data.id;

        this.drawnItems.addLayer(draw as L.Layer);
        this.markers.push(draw);
        this.canDrawPolygon = true;
        this.focusMarker(18);
        this.refreshControls();
    }

    async getMarkers() {
        const data = await mapServiceApi.getAllMarkers();

        for (const pin of data) {
            const draw = this.createMarkerFromPosition([pin.latitude, pin.longitude]) as any;
            if (pin.area) {
                const polygon = this.createPolygonFromGeoJSON(pin.area);
                draw.area = polygon;
                this.drawnItems.addLayer(polygon as L.Layer);
            }
            draw.markerId = pin.id;
            draw.color = pin.color;
            this.drawnItems.addLayer(draw as L.Layer);
            this.markers.push(draw);
            this.canDrawPolygon = false;
            this.centerMap();
            this.refreshControls();
        }
    }

    centerMap() {
        if (this.map) {
            this.map.fitBounds(this.drawnItems.getBounds());
        }
    }

    async updateAreaInfo(layer: L.Polygon<any> | L.Layer | L.Marker | any) {
        const coordinates: any[] = [];

        for (let i = 0; i < this.markers.length; i++) {
            if (this.markers[i].area && this.markers[i].area === layer) {
                this.drawnItems.removeLayer(this.markers[i]);
                const markerId = this.markers[i].markerId;
                layer._latlngs[0].forEach(function (position) {
                    coordinates.push([position.lng, position.lat]);
                });

                coordinates.push(coordinates[0]);
                this.markers.splice(i, 1);

                const data = await mapServiceApi.insertPolygonInMarker({
                    coordinates: [coordinates],
                    markerId: markerId
                });

                this.updateMarkerPolygon(data);
            }
        }
    }

    async updateMarkerInfo(layer: L.Layer | any) {
        const indexToEdit = this.markers.indexOf(layer);

        if (indexToEdit !== -1) {
            this.markers.splice(indexToEdit, 1);
        }

        const data = await mapServiceApi.updateMarkerPosition({ latitude: layer._latlng.lat, longitude: layer._latlng.lng, id: layer.markerId });

        this.buildMarker(data);
    }

    async deleteMarker(layer: L.Layer | any) {
        await mapServiceApi.deleteMarker(layer.markerId);
    }


    updateMarkerPolygon(layer: CreatePinProps) {
        const draw = this.createMarkerFromPosition([layer.latitude, layer.longitude]) as any;
        if (layer.area) {
            const polygon = this.createPolygonFromGeoJSON(layer.area);
            draw.area = polygon;
            this.drawnItems.addLayer(polygon as L.Layer);
        }
        draw.markerId = layer.id;
        this.drawnItems.addLayer(draw);
        this.markers.push(draw);
        this.canDrawPolygon = false;
        this.focusMarker();
        this.refreshControls();
    }

    mapEvents() {
        this.map.on(L.Draw.Event.CREATED, (e: any) => {
            const layer = e.layer;
            if (e.layerType === 'marker') {
                const toBeMarker = this.createMarkerFromPosition([layer.getLatLng().lat, layer.getLatLng().lng]);
                this.createMaker(toBeMarker);
            }
            if (e.layerType === 'polygon') {
                this.markers[this.markers.length - 1].area = layer;
                this.updateAreaInfo(this.markers[this.markers.length - 1].area);
            }
            this.refreshControls();
        });

        this.map.on(L.Draw.Event.EDITED, (e: any) => {
            Object.keys(e.layers._layers).forEach((layer: any) => {
                const item = e.layers._layers[layer];
                if (!item.markerId) {
                    this.drawnItems.removeLayer(item);
                    this.updateAreaInfo(item);
                    this.refreshControls();
                    for (let i = 0; i < this.markers.length; i++) {
                        if (this.markers[i].area === item) {
                            console.log(this.markers[i]);
                            this.drawnItems.removeLayer(this.markers[i]);
                        }
                    }
                    return;
                }
                if (item.area) {
                    this.drawnItems.removeLayer(item.area);
                }
                this.updateMarkerInfo(item);
                this.drawnItems.removeLayer(item);
            });
            this.refreshControls();
        });

        this.map.on(L.Draw.Event.DELETED, (e: any) => {
            Object.keys(e.layers._layers).forEach((layer) => {
                this.drawnItems.removeLayer(e.layers._layers[layer]);
                const indexToRemove = this.markers.indexOf(e.layers._layers[layer]);
                if (!e.layers._layers[layer].markerId) {
                    for (var i = 0; i < this.markers.length; i++) {
                        if (this.markers[i].area === e.layers._layers[layer]) {
                            this.updateMarkerInfo(this.markers[i]);
                            this.canDrawPolygon = true;
                        }
                    }
                    if (indexToRemove !== -1) {
                        this.markers.splice(indexToRemove, 1);
                    }
                    return;
                }

                if (e.layers._layers[layer].area) {
                    this.drawnItems.removeLayer(e.layers._layers[layer].area);
                }
                if (indexToRemove !== -1) {
                    this.markers.splice(indexToRemove, 1);
                }
                this.canDrawPolygon = false;
                this.deleteMarker(e.layers._layers[layer]);
            });
            this.refreshControls();
        });
    }

    refreshControls() {
        const drawOptions: L.Control.DrawOptions = {
            marker: {
                icon: MapIcon.customIcon(this.color)
            },
            polyline: false,
            circlemarker: false,
            polygon: !this.canDrawPolygon ? false : {
                allowIntersection: true
            },
            circle: false,
            rectangle: false
        };
        var editOptions: L.Control.EditOptions | undefined = {
            featureGroup: this.drawnItems
        };

        if (this.drawControl && this.drawControl.options) {
            this.map.removeControl(this.drawControl);
        }

        this.drawControl = new L.Control.Draw({
            position: "topleft",
            draw: drawOptions,
            edit: editOptions
        });

        this.map.addControl(this.drawControl);
    }

    componentDidMount() {
        if (typeof window === 'object') {
            const center = [51.505, -0.09] as LatLngExpression;

            this.map = L.map('map', {
                zoom: 4,
                zoomControl: false,
                center: [-14.00, -50.00]
            });

            L.marker(center).addTo(this.map);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

            this.map.addLayer(this.drawnItems);

            this.mapEvents();
            this.refreshControls();
            if (!this.initialized) {
                this.getMarkers();
                this.initialized = true;
            }
        }
    }

    componentWillUnmount() {
        this.map.remove();
    }

    render() {
        return <div id="map" style={{ height: this.height, width: "100%" }} />;
    }
}

export default Map;