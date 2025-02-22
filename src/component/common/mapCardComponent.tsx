import React, { useEffect, useRef } from 'react'
import { Box, Card, Typography } from '@mui/material'
import { MapCardComponentProps, MapComponentProps, MapContainerComponentProps} from '../../Interface/Index'
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export const MapContainerComponent: React.FC<MapContainerComponentProps> = ({ icon, handleEvent, title }) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: 'auto',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <img
                src={icon}
                alt="analysismap1"
                style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100vh',
                    objectFit: 'cover',
                    cursor: 'pointer',
                }}
                onClick={handleEvent}
            />
            <Typography
                sx={{
                    position: 'absolute',
                    top: 50,
                    left: 16,
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                }}
            >
                {title}
            </Typography>
        </Box>
    )
}

export const MapCardComponent: React.FC<MapCardComponentProps> = ({ icon, handleEvent, rightTitle, leftTitle }) => {
    return (
        <Box sx={{
            width: '100%',
            height: 'auto',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
            <img
                src={icon}
                alt="analysismap1"
                style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100vh',
                    objectFit: 'cover',
                    cursor: 'pointer',
                }}
                onClick={handleEvent}
            />
            <Card sx={{
                boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
                borderRadius: '8px',
                backgroundColor: '#fff',
                position: 'absolute',
                top: 50,
                right: 16,
                color: '#000',
                padding: '0px 15px',
            }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '16px',
                    fontWeight: 500,
                    gap: 2
                }}>
                    <Typography sx={{ marginRight: '8px' }}> {leftTitle}</Typography>
                    <Typography>{rightTitle} </Typography>
                </Box>
            </Card>
        </Box>
    )
}

export const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude }) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
  
    useEffect(() => {
      if (mapContainer.current && !mapRef.current) {
        mapRef.current = new Map({
          target: mapContainer.current as HTMLElement,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: [longitude, latitude],
            zoom: 9,
            projection: 'EPSG:4326'
          }),
        });
      }
  
      return () => {
        if (mapRef.current) {
          mapRef.current.setTarget(undefined); 
          mapRef.current = null; 
        }
      };
    }, [latitude, longitude]);
  

 return (
        <div ref={mapContainer} style={{ width: '100%', height: '300px' }} />
    )
}