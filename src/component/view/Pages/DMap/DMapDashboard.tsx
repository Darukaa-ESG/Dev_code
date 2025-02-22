import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import { useNavigate, useLocation } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import ProjectListData from '../../../../db.json';
import { DashMarkers } from "../../../../mock/dummyGeoJson";
import { MapFeature } from "../../../../Interface/Index";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { MAPBOX_TOKEN } from '../../../../mapboxConfig';

mapboxgl.accessToken = MAPBOX_TOKEN

const dwariknagar_tileID = "darukaa.cm4b7ujm7974l1oulbqo478ht-37gaa"
const tipligheri_tileID = "darukaa.cm4b80hbh0at71ns41l4vwheb-1zhy0"
const Maipith_tileID = "darukaa.cm4b7y0en26n31ooff4za4gpy-9kouj"

const DMapDashBoard: React.FC = () => {
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(null);
  const [layers, setLayers] = useState<{ id: string; name: string; opacity: number }[]>([]);
  const [activeLayer, setActiveLayer] = useState<string | null>(null); // Currently active layer
  const [mapStyle, setMapStyle] = useState<string>('satellite-v9');
  const [projectSiteCarbon] = useState(ProjectListData.CarbonCredit);
  const [projectSiteBioDiversity] = useState(ProjectListData.ProjectSite);
  const [projectSiteEnvReporting] = useState(ProjectListData.Environmental);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string, x: number, y: number }>({
    visible: false,
    content: '',
    x: 0,
    y: 0
  });

  const navigate = useNavigate();
  const location = useLocation();

  const fetchTilesetData = async (tilesetID: string) => {
    const url = `https://api.mapbox.com/v4/${tilesetID}.json?access_token=${mapboxgl.accessToken}`;
    const response = await fetch(url);
    return response.json();
  };

  const getAllTilesetData = async () => {
    const tileIDs = [dwariknagar_tileID, tipligheri_tileID, Maipith_tileID];

    try {
      const results = await Promise.all(tileIDs.map(fetchTilesetData));
      return [results[0], results[1], results[2]]
    } catch (error) {
      console.error("Error fetching tileset data:", error);
    }
  };


  const toggleMenu = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    // Initialize Mapbox GL JS map
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [88.58546271848877, 21.91951785100676],
      zoom: 10,
    });

    const resizeMap = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };
    mapRef.current?.on("load", async () => {
      const dataresponse = await getAllTilesetData()
      const vectorLayers = dataresponse?.flatMap(item => item.vector_layers);
      const fullscreenControl = new mapboxgl.FullscreenControl();
      mapRef.current?.addControl(fullscreenControl, "bottom-right");
      mapRef.current?.addControl(
        new mapboxgl.NavigationControl({ showCompass: true }),
        "bottom-right"
      );

      vectorLayers?.forEach((layer: { id: string; source: string; source_name: string }) => {
        const layerId = layer.id;
        mapRef.current?.addSource(layer.source, {
          type: "vector",
          url: `mapbox://${layer.source}`,
        });

        // if (DashMarkers) {
        //   DashMarkers.features.forEach((feature: Feature<Point>) => {
        //     const coordinates = feature.geometry.coordinates;
        //     new mapboxgl.Marker({ color: "red", scale: 0.5 })
        //       .setLngLat(coordinates)
        //       .addTo(mapRef.current!);
        //   });
        // }
        if (DashMarkers) {
          DashMarkers.features.forEach((feature: Feature<Geometry, GeoJsonProperties>) => {
            // Ensure the feature has the correct geometry type
            if (feature.geometry.type === "Point") {
              const coordinates = feature.geometry.coordinates as [number, number];

              new mapboxgl.Marker({ color: "red", scale: 0.5 })
                .setLngLat(coordinates)
                .addTo(mapRef.current!);
            }
          });
        }
        // Add layer to the map
        mapRef.current?.addLayer({
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
        setActiveLayer(layerId)
        setActiveLayers((prev) => (
          [...prev, layerId]
        ))

        mapRef.current?.on('mouseenter', layerId, () => {
          mapRef.current!.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to default when it leaves.
        mapRef.current?.on('mouseleave', layerId, () => {
          mapRef.current!.getCanvas().style.cursor = '';
        });

        mapRef.current?.on('click', layerId, (e) => {
          const clickedFeature = e.features?.[0];
          if (clickedFeature) {
            setSelectedFeature(clickedFeature.properties as MapFeature); // Store the properties of the clicked polygon
          }
        });

        // Add mouse events for tooltip
        mapRef.current?.on('mouseenter', layerId, (e) => {
          const features = mapRef.current?.queryRenderedFeatures(e.point, {
            layers: [layerId]
          });
          if (mapRef.current && mapRef.current.getCanvas()) {
            mapRef.current.getCanvas().style.cursor = 'pointer'; // Change cursor to pointer
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
        mapRef.current?.on('mouseleave', layerId, () => {
          setTooltip((prev) => ({ ...prev, visible: false }));
        });

      });
    })
    // Add event listener to handle window resizing
    window.addEventListener("resize", resizeMap)
    return () => {
      mapRef.current?.remove();
      window.removeEventListener("resize", resizeMap);
      setLayers([])
      setActiveLayer("")
    };
  }, [mapStyle]);

  const toggleLayerVisibility = (layer: string) => {
    const isLayerActive = activeLayers.includes(layer);
    const updatedLayers = isLayerActive
      ? activeLayers.filter((id) => id !== layer)
      : [...activeLayers, layer];

    setActiveLayers(updatedLayers);

    if (mapRef.current) {
      mapRef.current.setLayoutProperty(layer, "visibility", isLayerActive ? "none" : "visible");
    }
  };


  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>, layerId: string, newOpacity: number) => {
    // Check if the layer is active before updating opacity
    if (!activeLayers.includes(layerId)) {
      return;
    }

    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, opacity: newOpacity } : layer
      )
    );

    if (mapRef.current) {
      if (e.target.name === "Raster Layer") {
        mapRef.current.setPaintProperty(layerId, "raster-opacity", newOpacity);
      } else {
        mapRef.current?.setPaintProperty(layerId, "fill-opacity", newOpacity);
      }
    }
  };

  const handleSiteAnalysis = () => {
    const currentPath = location.pathname;
    if (!selectedFeature || !selectedFeature.Name) {
      return;
    }
    if (currentPath == "/carbonanalysis") {
      switch (selectedFeature.Name) { // Trim to remove trailing space
        case "Dwariknagar":
          // Iterate over projectSiteList and find the object with siteName "Site_B"
          projectSiteCarbon && projectSiteCarbon[0].sites?.map((site: { site_name: string }) => {
            if (site.site_name === "Dwariknagar") {
              // Set the object to localStorage
              localStorage.setItem("SelectedDropDownCarbonSite", JSON.stringify(site));
              navigate('/carbonanalysis-analysis-detail')
            }
          });
          break;
        case "Tipligheri":
          // Iterate over projectSiteList and find the object with siteName "Site_B"
          projectSiteCarbon && projectSiteCarbon[0].sites?.map((site: { site_name: string }) => {
            if (site.site_name === "Tipligheri") {
              // Set the object to localStorage
              localStorage.setItem("SelectedDropDownCarbonSite", JSON.stringify(site));
              navigate('/carbonanalysis-analysis-detail')
            }
          });
          break;
        case "Maipith":
          // Iterate over projectSiteList and find the object with siteName "Site_B"
          projectSiteCarbon && projectSiteCarbon[0].sites?.map((site: { site_name: string }) => {
            if (site.site_name === "Maipith") {
              // Set the object to localStorage
              localStorage.setItem("SelectedDropDownCarbonSite", JSON.stringify(site));
              navigate('/carbonanalysis-analysis-detail')
            }
          });
          break;

        // Add other cases if needed
        default:
          alert("No matching site found.");
          break;
      }
    }
    else if (currentPath == "/biodiversity") {
      switch (selectedFeature.Name) { // Trim to remove trailing space
        case "Dwariknagar":
          // Iterate over projectSiteList and find the object with siteName "Site_B"
          projectSiteBioDiversity && projectSiteBioDiversity[0][0].sites?.map((site: { site_name: string }) => {
            if (site.site_name === "Dwariknagar") {
              // Set the object to localStorage
              localStorage.setItem("SelectedDropDownSite", JSON.stringify(site));
              navigate('/biodiversity-analysis-detail')
            }
          });
          break;
        case "Tipligheri":
          // Iterate over projectSiteList and find the object with siteName "Site_B"
          projectSiteBioDiversity && projectSiteBioDiversity[0][0].sites?.map((site: { site_name: string }) => {
            if (site.site_name === "Tipligheri") {
              // Set the object to localStorage
              localStorage.setItem("SelectedDropDownSite", JSON.stringify(site));
              navigate('/biodiversity-analysis-detail')

            }
          });
          break;
        case "Maipith":
          // Iterate over projectSiteList and find the object with siteName "Site_B"
          projectSiteBioDiversity && projectSiteBioDiversity[0][0].sites?.map((site: { site_name: string }) => {
            if (site.site_name === "Maipith") {
              // Set the object to localStorage
              localStorage.setItem("SelectedDropDownSite", JSON.stringify(site));
              navigate('/biodiversity-analysis-detail')

            }
          });
          break;

        // Add other cases if needed
        default:
          alert("No matching site found.");
          break;

      }

    }
    else if (currentPath == "/environmentalreport") {
      switch (selectedFeature.Name) { // Trim to remove trailing space
        case "Dwariknagar":
          // Iterate over projectSiteList and find the object with siteName "Site_B"
          projectSiteEnvReporting && projectSiteEnvReporting[0].sites?.map((site: { site_name: string }) => {
            if (site.site_name === "Dwariknagar") {
              // Set the object to localStorage
              localStorage.setItem("SelectedDropDownEnvSite", JSON.stringify(site));
              navigate('/environmentalreport-analysis-detail')
            }
          });
          break;
        case "Tipligheri":
          // Iterate over projectSiteList and find the object with siteName "Site_B"
          projectSiteEnvReporting && projectSiteEnvReporting[0].sites?.map((site: { site_name: string }) => {
            if (site.site_name === "Tipligheri") {
              // Set the object to localStorage
              localStorage.setItem("SelectedDropDownEnvSite", JSON.stringify(site));
              navigate('/environmentalreport-analysis-detail')

            }
          });
          break;
        case "Maipith":
          // Iterate over projectSiteList and find the object with siteName "Site_B"
          projectSiteEnvReporting && projectSiteEnvReporting[0].sites?.map((site: { site_name: string }) => {
            if (site.site_name === "Maipith") {
              // Set the object to localStorage
              localStorage.setItem("SelectedDropDownEnvSite", JSON.stringify(site));
              navigate('/environmentalreport-analysis-detail')

            }
          });
          break;

        // Add other cases if needed
        default:
          alert("No matching site found.");
          break;
      }
    };
  }

  return (
    <div style={{ position: "relative", height: "65vh", width: "99%" }}>
      <div
        ref={mapContainer}
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      />

      <div className="map-style-menu">
        <label style={{ marginRight: '10px' }}>Map Style:</label>
        <select onChange={(e) => setMapStyle(e.target.value)} value={mapStyle}>
          <option value="satellite-v9">Satellite</option>
          <option value="streets-v12">Streets</option>
          <option value="light-v11">Light</option>
        </select>
      </div>
      {selectedFeature && (
        <div
          style={{
            position: 'absolute',
            top: '5px',
            left: '5px',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '300px',
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: '14px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Name:</strong> <span>{selectedFeature.Name}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Type:</strong> <span>{selectedFeature.Type}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Area:</strong> <span>{selectedFeature.Area}</span>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '15px',
              backgroundColor: '#005F54',  // Green color
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onClick={() => handleSiteAnalysis()}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#013731')} // Dark green on hover
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#005F54')}  // Reset to original color
          >
            Run Analysis
          </button>
        </div>
      )
      }
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
    </div >
  );
};

export default DMapDashBoard;
