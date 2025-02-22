import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { Map, LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FeatureCollection } from "geojson";
import { bbox } from "@turf/turf";
import { Tipligheri, Maipith, Dwariknagar } from "../../../../mock/dummyGeoJson";
import LayerControl from "./LayerControl";
import { MAPBOX_TOKEN } from '../../../../mapboxConfig';

mapboxgl.accessToken = MAPBOX_TOKEN

const DMapAnalysis: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [boundaryData, setBoundaryData] = useState<FeatureCollection | null>(null);
  const [mapStyle, setMapStyle] = useState<string>('satellite-v9');
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [siteDropDownDetails, setSiteDropDownDetails] = useState<Record<string, null>>(
    JSON.parse(localStorage.getItem("SelectedDropDownCarbonSite") || "{}")
  );

  const [layers, setLayers] = useState<{ id: string; name: string; opacity: number }[]>([]);
  // Function to update the boundaryData based on the siteDropDownDetails
  const updateBoundaryFromLocalStorage = () => {
    let newBoundary = null;

    if (siteDropDownDetails.site_name === "Dwariknagar") {
      newBoundary = Dwariknagar;
    } else if (siteDropDownDetails.site_name === "Tipligheri") {
      newBoundary = Tipligheri;
    } else if (siteDropDownDetails.site_name === "Maipith") {
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
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [88.2625, 21.7125] as LngLatLike,
      zoom: 11,
    });

    map.current.on("load", () => {
      // Add controls
      map.current?.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
      map.current?.addControl(
        new mapboxgl.NavigationControl({ showCompass: true }),
        "bottom-right"
      );

      // Add boundary data to the map
      renderBoundary(data);
    });
  };

  // Render boundary data on the map
  const renderBoundary = (data: FeatureCollection) => {
    if (map.current) {
      // Add source and layers
      map.current.addSource("boundary-source", {
        type: "geojson",
        data,
      });

      map.current.addLayer({
        id: "boundary-fill",
        type: "fill",
        source: "boundary-source",
        paint: {
          "fill-color": "#90EE90",
          "fill-opacity": 0.3,
        },
        filter: ["==", "$type", "Polygon"],
      });

      map.current.addLayer({
        id: "boundary-outline",
        type: "line",
        source: "boundary-source",
        paint: {
          "line-color": "#006400",
          "line-width": 1.5,
          "line-opacity": 1,
        },
        filter: ["==", "$type", "Polygon"],
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

      // Added POP UP
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.current?.on("mouseenter", "boundary-fill", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });

      // Change it back to default when it leaves.
      map.current?.on("mouseleave", "boundary-fill", () => {
        map.current!.getCanvas().style.cursor = "";
        popup.remove();
      });

      // Show popup on hover
      map.current?.on("mousemove", "boundary-fill", (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        const features = e.features;
        if (!features || features.length === 0) {
          popup.remove();
          return;
        }

        const feature = features[0];
        // Populate the popup and set its coordinates based on the feature.
        popup
          .setLngLat(e.lngLat as LngLatLike)
          .setHTML(
            `
              <div>
                <strong>Name:</strong> ${feature?.properties?.Name || "Unknown"} <br/>
                <strong>Type:</strong> ${feature?.properties?.Type || "Unknown"}<br/>
                <strong>Area:</strong> ${feature?.properties?.Area || "Unknown"}<br/>
              </div>
            `
          )
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

  // Check if localStorage value has changed using setInterval
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedDetails = JSON.parse(
        localStorage.getItem("SelectedDropDownCarbonSite") || "{}"
      );
      if (JSON.stringify(updatedDetails) !== JSON.stringify(siteDropDownDetails)) {
        setSiteDropDownDetails(updatedDetails);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [siteDropDownDetails]);

  // Effect to handle siteDropDownDetails changes
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
    <div style={{ position: "relative", height: "65vh", width: "99%" }}>
      <div
        ref={mapContainer}
        style={{ position: 'absolute', top: '0px', bottom: '0px', width: '100%' }}
      ></div>
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

export default DMapAnalysis;
