import React, { useState } from "react";

interface  LC{
    layers:{ id: string; name: string; opacity: number }[]
    activeLayer:string | null
    toggleLayerVisibility:(id:string)=>void
     handleOpacityChange:(id:string, opacity:number)=>void
}
const LayerControl:React.FC<LC> = ({ layers, activeLayer, toggleLayerVisibility, handleOpacityChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleMenu = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
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
                  checked={activeLayer === layer.id}
                  onChange={() => toggleLayerVisibility(layer.id)}
                />
                <label htmlFor={`layer-${layer.id}`}>{layer.name}</label>
                {/* <label htmlFor={`layer-${layer.id}`}>Site boundaries</label> */}
              </div>
              <div >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={layer.opacity}
                  onChange={(e) =>
                    handleOpacityChange(layer.id, parseFloat(e.target.value))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerControl;

