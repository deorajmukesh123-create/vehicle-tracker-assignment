import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

const vehicleIcon = new L.DivIcon({
  html: '<div style="font-size: 26px;">🚗</div>',
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function App() {
  const [route, setRoute] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('https://vehicle-tracker-assignment.onrender.com/api/vehicle')
      .then((res) => res.json())
      .then((data) => setRoute(data))
      .catch((err) => console.error('API Error:', err));
  }, []);

  useEffect(() => {
 if (route.length === 0) return;
  const timer = setInterval(() => {
    setIndex((prev) => (prev + 1 < route.length ? prev + 1 : 0));
  }, 2000);

  return () => clearInterval(timer);
}, [route]);

  if (route.length === 0) {
    return <h2>Loading route data...</h2>;
  }

  const currentPoint = route[index];
  const currentPos = [currentPoint.latitude, currentPoint.longitude];
  const travelledPath = route
    .slice(0, index + 1)
    .map((item) => [item.latitude, item.longitude]);

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h2>Vehicle Movement on Map</h2>
      <p>
        <b>Latitude:</b> {currentPoint.latitude} | <b>Longitude:</b>{' '}
        {currentPoint.longitude} | <b>Time:</b> {currentPoint.timestamp}
      </p>

      <MapContainer
        center={currentPos}
        zoom={16}
        style={{ height: '450px', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={currentPos} icon={vehicleIcon}>
          <Popup>Vehicle Current Location</Popup>
        </Marker>

        <Polyline positions={travelledPath} color="blue" weight={4} />
      </MapContainer>
    </div>
  );
}

export default App;