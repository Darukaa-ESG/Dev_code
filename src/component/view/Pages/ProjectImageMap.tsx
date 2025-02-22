import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';

interface MapComponentProps {}

function MapComponent({}: MapComponentProps): JSX.Element {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;
    
        // Initialize the Mapbox map
        if (!mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/darukaa/cm3r7pog5005o01sde29w6p1c',
                center: [88.2788, 21.7306], // Set initial center to the coordinates
                zoom: 12, // Set appropriate zoom level to focus on the area
            });
        }
    
        mapRef.current.on('load', () => {
            // Add the raster source
            mapRef.current!.addSource('geotiff-source', {
                type: 'raster',
                url: 'mapbox://darukaa.bb2jhlly', // Tileset ID
                tileSize: 256,
            });
    
            // Add the raster layer
            mapRef.current!.addLayer({
                id: 'geotiff-layer',
                type: 'raster',
                source: 'geotiff-source',
                paint: {
                    'raster-opacity': 0.7, // Adjust layer opacity
                },
            });
    
            // Adjust bounds to focus on the specific location
            const bounds: [mapboxgl.LngLatLike, mapboxgl.LngLatLike] = [
                [88.2788 - 0.05, 21.7306 - 0.05], // Southwest corner [lng, lat]
                [88.2788 + 0.05, 21.7306 + 0.05], // Northeast corner [lng, lat]
            ];
    
            // Fit the map to the GeoTIFF bounds
            mapRef.current!.fitBounds(bounds, {
                padding: { top: 20, right: 20, bottom: 20, left: 20 },
                duration: 1000, // Smooth transition
            });


            
      mapRef.current?.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      mapRef.current?.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
      
        });
    
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);
    
    const [mapStyle, setMapStyle] = useState<string>("satellite-v9");
    const [opacity, setOpacity] = useState<number>(1);
    const handleOpacityChange = (opacity: number) => {
        setOpacity(opacity)
        if (mapRef.current?.getLayer('geotiff-layer')) {
          mapRef.current.setPaintProperty('geotiff-layer', 'raster-opacity', opacity);
        }
      };
    return (
        <div  style={{ position: 'relative' }}>
            <div
                ref={mapContainer}
                style={{
                    width: '100%',
                    height: '500px',
                    marginTop: '20px',
                    border: '1px solid #ccc',
                }}
            ></div>
             <div className="map-style-menu">
          <label>Map Style:</label>
          <select
            onChange={(e) => setMapStyle(e.target.value)}
            value={mapStyle}
          >
            <option value="satellite-v9">Satellite</option>
            <option value="satellite-streets-v12">Satellite Streets</option>
            <option value="streets-v12">Streets</option>
            <option value="light-v11">Light</option>
          </select>
        </div>
        <div className="opacity-slider">
          <label>Layer Opacity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
          />
        </div>
        </div>
    );
}

export default MapComponent;
