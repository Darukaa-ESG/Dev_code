import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import MapboxCompare from "mapbox-gl-compare";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import "./DMapStyle.css";
import { dwariknagar_tileID, Maipith_tileID, tipligheri_tileID } from "./tilesId";
import { DashMarkers } from "../../../../../src/mock/dummyGeoJson";
import { MAPBOX_TOKEN } from '../../../../mapboxConfig';

mapboxgl.accessToken = MAPBOX_TOKEN;

const DMapTile: React.FC = () => {
  const mapContainerBefore = useRef<HTMLDivElement | null>(null);
  const mapContainerAfter = useRef<HTMLDivElement | null>(null);
  const compareContainer = useRef<HTMLDivElement | null>(null);
  const beforeMap = useRef<Map | null>(null);
  const afterMap = useRef<Map | null>(null);
  const mapboxCompareRef = useRef<InstanceType<typeof MapboxCompare> | null>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string, x: number, y: number }>({
    visible: false,
    content: '',
    x: 0,
    y: 0
  });
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleMenu = () => {
    setIsExpanded((prev) => !prev);
  };
  const [selectedFeature, setSelectedFeature] = useState<Record<string, unknown> | null>(null);
  const [layers, setLayers] = useState<{ id: string; name: string; opacity: number }[]>([]);
  const [mapStyle, setMapStyle] = useState<string>("satellite-v9");
  const [beforeYear, setBeforeYear] = useState<string>("2020");
  const [afterYear, setAfterYear] = useState<string>("2020");
  const [opacity,] = useState<number>(1);


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

  const fetchData = async (tilesetID: string) => {
    const url = `https://api.mapbox.com/v4/${tilesetID}.json?access_token=${mapboxgl.accessToken}`;
    const response = await fetch(url);
    return response.json();
  };

  const getAllTilesetData = async () => {
    const tileIDs = [dwariknagar_tileID, tipligheri_tileID, Maipith_tileID];

    try {
      const results = await Promise.all(tileIDs.map(fetchData));
      return [results[0], results[1], results[2]]
    } catch (error) {
      console.error("Error fetching tileset data:", error);
    }
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

  const addRasterLayer = (map: Map | null, layerId: string, tilesData: { bounds: number[]; tiles: string[]; tileSize?: number }) => {
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

        setLayers((prevLayers) => {
          // Check if the layerId already exists in the prevLayers array
          if (!prevLayers.some(layer => layer.id === layerId)) {
            return [
              ...prevLayers,
              {
                id: layerId,
                name: "Raster", // Using layer ID as name, you can customize this if needed
                opacity: 0.7, // Default opacity
              },
            ];
          }
          return prevLayers; // Return unchanged if layerId already exists
        });

        setActiveLayers((prev) => {
          // Add layerId only if it's not already in activeLayers
          if (!prev.includes(layerId)) {
            return [...prev, layerId];
          }
          return prev; // Return unchanged if layerId already exists
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

      beforeMap.current.on("load", async () => {
        const dataresponse = await getAllTilesetData()

        const vectorLayers = dataresponse?.flatMap(item => item.vector_layers);

        if (beforeData) addRasterLayer(beforeMap.current, "rasterID", beforeData);

        vectorLayers?.forEach((layer) => {
          const layerId = layer.id;
          beforeMap.current?.addSource(layer.source, {
            type: "vector",
            url: `mapbox://${layer.source}`,
          });

          if (DashMarkers) {
            DashMarkers.features.forEach((feature) => {
              const pointFeature = feature as GeoJSON.Feature<GeoJSON.Point>;
              const coordinates = pointFeature.geometry.coordinates;
              new mapboxgl.Marker({ color: "red", scale: 0.5 })
                .setLngLat(coordinates as [number, number])
                .addTo(beforeMap.current!);
            });
          }

          // Add layer to the map
          beforeMap.current?.addLayer({
            id: layerId,
            type: "fill",
            source: layer.source,
            "source-layer": layerId,
            paint: {
              "fill-color": '#90EE90', // Layer color
              "fill-opacity": 0.7, // Default opacity (can be changed later)
            },
          });

          // Add layer to state
          setLayers((prevLayers) => [
            ...prevLayers,
            {
              id: layerId,
              name: layer.source_name, // Using layer ID as name, you can customize this if needed
              opacity: 0.7, // Default opacity
            },
          ]);
          setActiveLayers((prev) => (
            [...prev, layerId]
          ))

          beforeMap.current?.on('mouseenter', layerId, () => {
            beforeMap.current!.getCanvas().style.cursor = 'pointer';
          });

          // Change it back to default when it leaves.
          beforeMap.current?.on('mouseleave', layerId, () => {
            beforeMap.current!.getCanvas().style.cursor = '';
          });

          beforeMap.current?.on('click', layerId, (e) => {
            const clickedFeature = e.features?.[0] as mapboxgl.MapboxGeoJSONFeature;
            if (clickedFeature) {
              setSelectedFeature(clickedFeature.properties); // Store the properties of the clicked polygon
            }
          });

          // Add mouse events for tooltip
          beforeMap.current?.on('mouseenter', layerId, (e) => {

            const features = beforeMap.current?.queryRenderedFeatures(e.point, {
              layers: [layerId]
            });
            if (beforeMap.current && beforeMap.current.getCanvas()) {
              beforeMap.current.getCanvas().style.cursor = 'pointer'; // Change cursor to pointer
            }

            if (features && features.length) {
              const feature = features[0];
              const properties = feature.properties;

              // Check if properties are not null or undefined
              if (properties) {
                const content = Object.entries(properties)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("<br/>");

                setTooltip({
                  visible: true,
                  content,
                  x: e.point.x,
                  y: e.point.y,
                });
              }
            }
          });

          // Hide tooltip when mouse leaves
          beforeMap.current?.on('mouseleave', layerId, () => {
            setTooltip((prev) => ({ ...prev, visible: false }));
          });

        });
      });

      afterMap.current.on("load", async () => {
        const dataresponse = await getAllTilesetData()

        const vectorLayers = dataresponse?.flatMap(item => item.vector_layers);

        if (afterData) addRasterLayer(afterMap.current, "rasterID", afterData);
        vectorLayers?.forEach((layer) => {
          const layerId = layer.id;
          afterMap.current?.addSource(layer.source, {
            type: "vector",
            url: `mapbox://${layer.source}`,
          });

          if (DashMarkers) {
            DashMarkers.features.forEach((feature) => {
              const pointFeature = feature as GeoJSON.Feature<GeoJSON.Point>;
              const coordinates = pointFeature.geometry.coordinates;
              new mapboxgl.Marker({ color: "red", scale: 0.5 })
                .setLngLat(coordinates as [number, number])
                .addTo(afterMap.current!);

            });
          }
          // Add layer to the map
          afterMap.current?.addLayer({
            id: layerId,
            type: "fill",
            source: layer.source,
            "source-layer": layerId,
            paint: {
              "fill-color": '#90EE90', // Layer color
              "fill-opacity": 0.7, // Default opacity (can be changed later)
            },
          });

          // Add layer to state
          setLayers((prevLayers) => {
            // Check if the layerId already exists in the prevLayers array
            if (!prevLayers.some(layer => layer.id === layerId)) {
              return [
                ...prevLayers,
                {
                  id: layerId,
                  name: layer.source_name, // Using layer ID as name, you can customize this if needed
                  opacity: 0.7, // Default opacity
                },
              ];
            }
            return prevLayers; // Return unchanged if layerId already exists
          });

          setActiveLayers((prev) => {
            // Add layerId only if it's not already in activeLayers
            if (!prev.includes(layerId)) {
              return [...prev, layerId];
            }
            return prev; // Return unchanged if layerId already exists
          });

          afterMap.current?.on('mouseenter', layerId, () => {
            afterMap.current!.getCanvas().style.cursor = 'pointer';
          });

          // Change it back to default when it leaves.
          afterMap.current?.on('mouseleave', layerId, () => {
            afterMap.current!.getCanvas().style.cursor = '';
          });

          afterMap.current?.on('click', layerId, (e) => {
            const clickedFeature = e.features?.[0];
            if (clickedFeature) {
              setSelectedFeature(clickedFeature.properties); // Store the properties of the clicked polygon
            }
          });

          // Add mouse events for tooltip
          afterMap.current?.on('mouseenter', layerId, (e) => {
            const features = afterMap.current?.queryRenderedFeatures(e.point, {
              layers: [layerId]
            });
            if (afterMap.current && afterMap.current.getCanvas()) {
              afterMap.current.getCanvas().style.cursor = 'pointer'; // Change cursor to pointer
            }
            if (features && features.length) {
              const feature = features[0];
              const properties = feature.properties;
              // Check if properties are not null or undefined
              if (properties) {
                const content = Object.entries(properties)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("<br/>");

                setTooltip({
                  visible: true,
                  content,
                  x: e.point.x,
                  y: e.point.y,
                });
              }
            }
          });

          // Hide tooltip when mouse leaves
          afterMap.current?.on('mouseleave', layerId, () => {
            setTooltip((prev) => ({ ...prev, visible: false }));
          });

        });
      });

      afterMap.current.on("zoom", () => {
        const currentZoom = afterMap.current?.getZoom() || 9;
        updateLayer(afterMap.current, "rasterID", beforeYear, currentZoom);
      });

      afterMap.current.on("zoom", () => {
        const currentZoom = afterMap.current?.getZoom() || 9;
        updateLayer(afterMap.current, "rasterID", afterYear, currentZoom);
      });
    };

    initializeMap();

    return () => {
      mapboxCompareRef.current?.remove();
      mapboxCompareRef.current = null;
      beforeMap.current?.remove();
      afterMap.current?.remove();
      setLayers([])
      setActiveLayers([])
    };
  }, [mapStyle, beforeYear, afterYear]);

  const toggleLayerVisibility = (layer: string) => {
    const isLayerActive = activeLayers.includes(layer);
    const updatedLayers = isLayerActive
      ? activeLayers.filter((id) => id !== layer)
      : [...activeLayers, layer];

    setActiveLayers(updatedLayers);
    if (beforeMap.current) {
      beforeMap.current.setLayoutProperty(layer, "visibility", isLayerActive ? "none" : "visible");
    }
    if (afterMap.current) {
      afterMap.current.setLayoutProperty(layer, "visibility", isLayerActive ? "none" : "visible");
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLElement>, layerId: string, newOpacity: number) => {
    // Check if the layer is active before updating opacity
    const target = e.target as HTMLInputElement;
    if (!activeLayers.includes(layerId)) {
      return;
    }

    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, opacity: newOpacity } : layer
      )
    );

    if (beforeMap.current) {
      if (target.name === "Raster") {
        beforeMap.current.setPaintProperty(layerId, "raster-opacity", newOpacity);
      } else {
        beforeMap.current?.setPaintProperty(layerId, "fill-opacity", newOpacity);
      }
    }

    if (afterMap.current) {
      if (target.name === "Raster") {
        afterMap.current.setPaintProperty(layerId, "raster-opacity", newOpacity);
      } else {
        afterMap.current?.setPaintProperty(layerId, "fill-opacity", newOpacity);
      }
    }
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
        <div className="layer-controls">
          <div className="menu-header" onClick={toggleMenu} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h4 style={{ margin: 0 }}>Layers</h4>
            <button
              style={{
                background: "none",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                padding: "0",
              }}
            >
              {isExpanded ? "−" : "+"}
            </button>
          </div>

          {isExpanded && (
            <div className="menu-content">

              {layers.map((layer) => (
                <div key={layer.id} className="layer-item">

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <input
                      type="checkbox"
                      id={`layer-${layer.id}`}
                      checked={activeLayers.includes(layer.id)}
                      name={layer.name}
                      onChange={() => toggleLayerVisibility(layer.id)}
                    />
                    <label htmlFor={`layer-${layer.id}`}>{layer.name}</label>
                  </div>
                  <div >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      name={layer.name}
                      value={layer.opacity}
                      onChange={(e) =>
                        handleOpacityChange(e, layer.id, parseFloat(e.target.value))
                      }
                      disabled={!activeLayers.includes(layer.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Tooltip */}
        {
          tooltip.visible && (
            <div
              style={{
                position: 'absolute',
                left: tooltip.x + 10,
                top: tooltip.y + 10,
                backgroundColor: 'white',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 2,
                pointerEvents: 'none', // Makes sure tooltip does not interfere with other map elements
              }}
              dangerouslySetInnerHTML={{ __html: tooltip.content }}
            />
          )
        }

      </div>
    </div>
  );
};

export default DMapTile;
