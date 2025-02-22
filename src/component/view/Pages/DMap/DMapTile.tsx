import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import MapboxCompare from "mapbox-gl-compare";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import "./DMapStyle.css";
import {MAPBOX_TOKEN} from '../../../../mapboxConfig';

mapboxgl.accessToken = MAPBOX_TOKEN

const DMapTile: React.FC = () => {
  const mapContainerBefore = useRef<HTMLDivElement | null>(null);
  const mapContainerAfter = useRef<HTMLDivElement | null>(null);
  const compareContainer = useRef<HTMLDivElement | null>(null);
  const beforeMap = useRef<Map | null>(null);
  const afterMap = useRef<Map | null>(null);
  const mapboxCompareRef = useRef<InstanceType<typeof MapboxCompare> | null>(null);
  const [mapStyle, setMapStyle] = useState<string>("satellite-v9");
  const [beforeYear, setBeforeYear] = useState<string>("2020");
  const [afterYear, setAfterYear] = useState<string>("2020");
  const [opacity, setOpacity] = useState<number>(1);

  const tilesetData: Record<string, { id: string; tileset: string }> = {
    "2010": { id: "year-2010", tileset: "darukaa.buy23gzk" },
    "2015": { id: "year-2015", tileset: "darukaa.33e2agrp" },
    "2020": { id: "year-2020", tileset: "darukaa.dcplvj5p" },
    "2024": { id: "year-2024", tileset: "darukaa.9jog32ov" },
  };

  const calculateTileResolution = (zoom: number) => {
    const baseResolution = 256;
    const scale = Math.pow(2, zoom);
    return baseResolution / scale;
  };

  const fetchTilesetData = (year: string, zoom: number) => {
    const tileset = tilesetData[year]?.tileset;

    if (!tileset) {
      return Promise.resolve(null);
    }

    const resolution = calculateTileResolution(zoom);

    const url = `https://api.mapbox.com/v4/${tileset}.json?access_token=${mapboxgl.accessToken}`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => ({
        ...data,
        resolution,
        center: data.center || [0, 0], // Fallback center
      }));
  };

  const addRasterLayer = (map: Map | null, layerId: string,  tilesData: { bounds: number[]; tiles: string[]; tileSize?: number }) => {
    if (map && tilesData) {
      const { bounds, tiles, tileSize = 256 } = tilesData;

      if (!map.getSource(layerId)) {
        map.addSource(layerId, {
          type: "raster",
          tiles,
          tileSize,
          bounds,
        } as mapboxgl.RasterSourceSpecification);
      }

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "raster",
          source: layerId,
          paint: {
            "raster-opacity": opacity,
          },
        });
      }
    }
  };

  const updateLayer = (map: Map | null, layerId: string, year: string, zoom: number) => {
    if (map) {
      fetchTilesetData(year, zoom)
        .then((data) => {
          if (data) {
            const { bounds, tiles } = data;

            const source = map.getSource(layerId) as mapboxgl.RasterTileSource | undefined;
            if (source) {
              source.tiles = tiles;
              map.triggerRepaint();
            } else {
              addRasterLayer(map, layerId, data);
              if (map.getLayer(layerId)) {
                map.fitBounds(bounds, { padding: 20 });
              }
            }
          }
        })
        .catch((error) => console.error("Error fetching tileset data:", error));
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      const beforeData = await fetchTilesetData(beforeYear, 9);
      const afterData = await fetchTilesetData(afterYear, 9);
      const beforeCenter = beforeData?.center || [0, 0];
      const afterCenter = afterData?.center || [0, 0];

      beforeMap.current = new mapboxgl.Map({
        container: mapContainerBefore.current as HTMLDivElement,
        style: `mapbox://styles/mapbox/${mapStyle}`,
        center: beforeCenter,
        zoom: 9,
      });

      afterMap.current = new mapboxgl.Map({
        container: mapContainerAfter.current as HTMLDivElement,
        style: `mapbox://styles/mapbox/${mapStyle}`,
        center: afterCenter,
        zoom: 9,
      });

      // Add navigation controls
      beforeMap.current?.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      beforeMap.current?.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
      afterMap.current?.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      afterMap.current?.addControl(new mapboxgl.FullscreenControl(), "bottom-right");

      if (!mapboxCompareRef.current) {
        mapboxCompareRef.current = new MapboxCompare(
          beforeMap.current,
          afterMap.current,
          compareContainer.current as HTMLElement
        );
      }

      beforeMap.current.on("load", () => {
        if (beforeData) addRasterLayer(beforeMap.current, "before-layer", beforeData);
      });

      afterMap.current.on("load", () => {
        if (afterData) addRasterLayer(afterMap.current, "after-layer", afterData);
      });

      beforeMap.current.on("zoom", () => {
        const currentZoom = beforeMap.current?.getZoom() || 9;
        updateLayer(beforeMap.current, "before-layer", beforeYear, currentZoom);
      });

      afterMap.current.on("zoom", () => {
        const currentZoom = afterMap.current?.getZoom() || 9;
        updateLayer(afterMap.current, "after-layer", afterYear, currentZoom);
      });
    };

    initializeMap();

    return () => {
      mapboxCompareRef.current?.remove();
      mapboxCompareRef.current = null;
      beforeMap.current?.remove();
      afterMap.current?.remove();
    };
  }, [mapStyle, beforeYear, afterYear]);


  const updateOpacity = (value: number) => {
    setOpacity(value);
    beforeMap.current?.setPaintProperty("before-layer", "raster-opacity", value);
    afterMap.current?.setPaintProperty("after-layer", "raster-opacity", value);
  };

  return (
    <div style={{ position: "relative", height: "75vh", width: "100%" }}>
      <div
        id="comparison-container"
        ref={compareContainer}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          id="before"
          ref={mapContainerBefore}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "100%",
          }}
        >
          <div className="map-controls-bf">
            <label>Map Year:</label>
            <select
              onChange={(e) => {
                setBeforeYear(e.target.value);
                updateLayer(beforeMap.current, "before-layer", e.target.value, 9);
              }}
              value={beforeYear}
            >
              <option value="2010">2010</option>
              <option value="2015">2015</option>
              <option value="2020">2020</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
        <div
          id="after"
          ref={mapContainerAfter}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "100%",
          }}
        >
          <div className="map-controls-af">
            <label>Map Year:</label>
            <select
              onChange={(e) => {
                setAfterYear(e.target.value);
                updateLayer(afterMap.current, "after-layer", e.target.value, 9);
              }}
              value={afterYear}
            >
              <option value="2010">2010</option>
              <option value="2015">2015</option>
              <option value="2020">2020</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
        <div className="map-style-menu">
          <label>Map Style:</label>
          <select
            onChange={(e) => setMapStyle(e.target.value)}
            value={mapStyle}
          >
            <option value="satellite-v9">Satellite</option>
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
            onChange={(e) => updateOpacity(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default DMapTile;
