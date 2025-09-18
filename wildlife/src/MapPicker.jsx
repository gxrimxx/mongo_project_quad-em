import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/assets/leaflet/marker-icon-2x.png",
  iconUrl: "/assets/leaflet/marker-icon.png",
  shadowUrl: "/assets/leaflet/marker-shadow.png",
});


// Hook to detect when map container is rendered
function useContainerReady() {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setReady(true);
        }
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, ready];
}

// Click selector
function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

// Resize fix
function MapResizeFixer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  return null;
}

// Main component
export default function MapPicker({ onLocationChange, value = null }) {
  const [selected, setSelected] = useState(value ? { lat: value.lat, lng: value.lng } : null);
  const [radius, setRadius] = useState(value?.radius || 10000); // in meters
  const [containerRef, ready] = useContainerReady();

  // Keep internal state in sync with passed-in value
  useEffect(() => {
    if (value) {
      setSelected({ lat: value.lat, lng: value.lng });
      setRadius(value.radius || 10000);
    } else {
      setSelected(null);
      setRadius(10000);
    }
  }, [value]);

  const handleSelect = (latlng) => {
    setSelected(latlng);
    onLocationChange({ ...latlng, radius });
  };

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    if (selected) {
      onLocationChange({ ...selected, radius: newRadius });
    }
  };

  return (
    <div ref={containerRef} className="my-6" style={{ minHeight: "400px" }}>
      {ready ? (
        <MapContainer
          center={selected || [40, -100]}
          zoom={selected ? 7 : 4}
          style={{ height: "400px", width: "100%" }}
          className="rounded shadow"
        >
          <MapResizeFixer />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector onSelect={handleSelect} />
          {selected && (
            <>
              <Marker position={selected} />
              <Circle center={selected} radius={radius} pathOptions={{ fillOpacity: 0.1 }} />
            </>
          )}
        </MapContainer>
      ) : (
        <p className="text-muted">Loading map...</p>
      )}

      {selected && (
        <>
          <p className="mt-3 text-sm text-gray-600">
            Selected: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
          </p>

          <label htmlFor="radiusSlider" className="form-label mt-2">
            Radius: {(radius / 1000).toFixed(1)} km
          </label>
          <input
            id="radiusSlider"
            type="range"
            className="form-range"
            min="1000"
            max="100000"
            step="1000"
            value={radius}
            onChange={handleRadiusChange}
          />

          <button
            className="btn btn-outline-danger btn-sm mt-3"
            onClick={() => {
              setSelected(null);
              setRadius(10000);
              onLocationChange(null);
            }}
          >
            Clear Location
          </button>
        </>
      )}
    </div>
  );
}


