import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import IconManipulator from './icon.manipulator.service';


class MapIconService {

    customIcon(hex: string) {

        const svgStr = ReactDOMServer.renderToStaticMarkup(<IconManipulator color={hex}/>);

        const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

        const customIcon = new L.Icon({
            iconUrl: svgUrl,
            iconSize: [36, 48],
            iconAnchor: [16, 37],
            popupAnchor: [-100, -55]
        });
        return customIcon;
    }

}
export const MapIcon = new MapIconService();