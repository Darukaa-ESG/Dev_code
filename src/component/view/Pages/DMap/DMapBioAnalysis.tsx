import React, { useRef, useEffect, useState, CSSProperties } from 'react';
import mapboxgl, { Map, LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';
import { bbox } from '@turf/turf';
import { Tipligheri, Maipith, Dwariknagar } from "../../../../mock/dummyGeoJson";
import RedPinIcon from '../../../../resources/images/RedPin.svg'
import YellowPinIcon from '../../../../resources/images/YellowPin.svg';
import LayerControl from './LayerControl';
import { MAPBOX_TOKEN } from '../../../../mapboxConfig';

mapboxgl.accessToken = MAPBOX_TOKEN

const DMapBioAnalysis: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<Map | null>(null);
    const [boundaryData, setBoundaryData] = useState<FeatureCollection | null>(null);
    const siteDropDownDetails = JSON.parse(localStorage.getItem('SelectedDropDownSite') || '{}');
    const [mapStyle, setMapStyle] = useState<string>('satellite-v9');
    const [activeLayer, setActiveLayer] = useState<string | null>(null);
    const [layers, setLayers] = useState<{ id: string; name: string; opacity: number }[]>([]);
    // Read localStorage and set boundaryData
    const updateBoundaryFromLocalStorage = () => {
        let newBoundary = null;

        if (siteDropDownDetails.site_name === 'Dwariknagar') {
            newBoundary = Dwariknagar;
        } else if (siteDropDownDetails.site_name === 'Tipligheri') { // Site_G
            newBoundary = Tipligheri;
        } else if (siteDropDownDetails.site_name === 'Maipith') { // Site_H
            newBoundary = Maipith;
        }

        setBoundaryData(newBoundary);
    };

    // Initialize or reinitialize the map
    const initializeMap = (data: FeatureCollection) => {

        // Remove existing map instance
        if (map.current) {
            map.current.remove();
            map.current = null;
        }

        // Create a new map instance
        map.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLDivElement,
            style: 'mapbox://styles/darukaa/cm3sctdzd008201s83c1f4aqg',
            center: [88.2625, 21.7125] as LngLatLike,
            zoom: 11,
        });

        map.current.on('load', () => {
            // Add controls
            map.current?.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
            map.current?.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-right');
            // Add boundary data to the map
            renderBoundary(data);
        });
    };
    // Render boundary data on the map
    const renderBoundary = (data: FeatureCollection) => {
        if (map.current) {
            // Add source and layers
            map.current.addSource('boundary-source', {
                type: 'geojson',
                data,
            });
            map.current.addLayer({
                id: 'boundary-fill',
                type: 'fill',
                source: 'boundary-source',
                paint: {
                    'fill-color': '#90EE90',
                    'fill-opacity': 0.3,
                },
                filter: ['==', '$type', 'Polygon'],
            });

            map.current.addLayer({
                id: 'boundary-outline',
                type: 'line',
                source: 'boundary-source',
                paint: {
                    'line-color': '#006400',
                    'line-width': 1.5,
                    'line-opacity': 1,
                },
                filter: ['==', '$type', 'Polygon'],
            });

            map.current.addLayer({
                id: 'boundary-points',
                type: 'symbol',
                source: 'boundary-source',
                filter: ['==', '$type', 'Point'],
                layout: {
                    'icon-image': [
                        'match',
                        ['get', 'Type'],
                        'Camera', 'RedPin',
                        'AudioMoth', 'YellowPin',
                        'default-icon',
                    ],
                    'icon-size': 0.6,
                    'icon-allow-overlap': true,
                },
            });
            const polygons = data.features.filter(item => item.geometry.type === 'Polygon');

            const polygon = polygons[0]
            setLayers((prevLayers) => [
                ...prevLayers,
                {
                    id: "boundary-fill",
                    name: polygon.properties?.Name ? polygon.properties?.Name : "layer 1", // Using layer ID as name, you can customize this if needed
                    opacity: 0.7, // Default opacity
                },
            ]);

            setActiveLayer("boundary-fill");

            // Added POP UP --->
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });

            map.current?.on('mouseenter', 'boundary-points', () => {
                map.current!.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to default when it leaves.
            map.current?.on('mouseleave', 'boundary-points', () => {
                map.current!.getCanvas().style.cursor = '';
                popup.remove();
            });

            // Show popup on hover
            map.current?.on('mousemove', 'boundary-points', (e: mapboxgl.MapMouseEvent) => {
                const features = e.features ?? [];
                if (!features.length) {
                    popup.remove();
                    return;
                }

                const feature = features[0];
                // Populate the popup and set its coordinates based on the feature.
                popup
                    .setLngLat(e.lngLat as LngLatLike)
                    .setHTML(`
                                    <div>
                                    <strong>Type:</strong> ${feature?.properties?.Type || 'Unknown'} <br/>
                                    <strong>Device ID:</strong> ${feature?.properties?.Device_ID || 'Unknown'}<br/>
                        </div>
                                    `)
                    .addTo(map.current!);
            });

            // Fit map to boundary
            const siteBbox = bbox(data as unknown as FeatureCollection);
            map.current.fitBounds(siteBbox as mapboxgl.LngLatBoundsLike, {
                padding: 20,
                animate: true,
                duration: 2000,
            });
        }
    };

    // Effect to handle localStorage changes
    useEffect(() => {
        updateBoundaryFromLocalStorage();
    }, [siteDropDownDetails]);

    // Effect to initialize or reinitialize map when boundaryData updates
    useEffect(() => {
        if (boundaryData) {
            initializeMap(boundaryData);
        }
        return () => {
            setLayers([])
            setActiveLayer("")
        }
    }, [boundaryData, mapStyle]);


    const toggleLayerVisibility = (layer: string) => {
        const isLayerActive = activeLayer === layer;
        setActiveLayer(isLayerActive ? null : layer);
        if (map.current) {
            if (isLayerActive) {
                map.current.setLayoutProperty(layer, "visibility", "none");
            } else {
                map.current.setLayoutProperty(layer, "visibility", "visible");
            }
        }
    };

    const handleOpacityChange = (layerId: string, newOpacity: number) => {
        setLayers((prevLayers) =>
            prevLayers.map((layer) =>
                layer.id === layerId ? { ...layer, opacity: newOpacity } : layer
            )
        );
        if (map.current) {
            map.current?.setPaintProperty(layerId, "fill-opacity", newOpacity);
        }
    };
    return (
        <div style={{ position: "relative", height: "65vh", width: "100%" }}>
            <div ref={mapContainer}
                style={{ position: 'absolute', top: '0px', bottom: '0px', width: '100%' }}
            >
                <div style={styles.legendContainer}>
                    <div style={styles.legendItem}>
                        <img src={RedPinIcon} alt="Camera Trap Icon" style={styles.icon} />
                        <span>Camera Trap</span>
                    </div>
                    <div style={styles.legendItem}>
                        <img src={YellowPinIcon} alt="AudioMoth Icon" style={styles.icon} />
                        <span>AudioMoth</span>
                    </div>
                </div>

            </div>
            <div className="map-style-menu">
                <label style={{ marginRight: '10px' }}>Map Style:</label>
                <select onChange={(e) => setMapStyle(e.target.value)} value={mapStyle}>
                    <option value="satellite-v9">Satellite</option>
                    <option value="streets-v12">Streets</option>
                    <option value="light-v11">Light</option>
                </select>
            </div>

            <LayerControl
                layers={layers}
                activeLayer={activeLayer}
                toggleLayerVisibility={toggleLayerVisibility}
                handleOpacityChange={handleOpacityChange}
            />
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    legendContainer: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'white',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 1,
        display: 'flex', // Arrange items side by side
        alignItems: 'center',
        gap: '15px',
        width: '215px'
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '5px',
    },
    icon: {
        width: '20px',
        height: '20px',
        marginRight: '5px',
    },
};

export default DMapBioAnalysis;
