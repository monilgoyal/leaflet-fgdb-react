import { MapContainer, TileLayer, GeoJSON, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
import { colorbrewer } from './color';
import Worker from './file.worker';


//create function to show fearures and property => pass as onEachFeature props in GeoJSON component 
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(Object.keys(feature.properties).map(function (k) {
      return k + ": " + feature.properties[k];
    }).join("<br />"), {
      maxHeight: 200
    });
  }
}

//create function to add points on layer => pass as pointToLayer props in GeoJSON component 
const pointToLayer = (feature, latlng) => {
  return <CircleMarker opacity={1}
    fillOpacity={0.7}
    color={color(feature)}
    latlng={latlng}
  />

}

//create function to show different colors on different feature
function color(s) {
  return colorbrewer.Spectral[11][Math.abs(JSON.stringify(s).split("").reduce(function (a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
  }, 0)) % 11];
}
const customcolor = (f) => {
  return {
    opacity: 1,
    fillOpacity: 0.7,
    radius: 6,
    color: color(f)
  };
}

function App() {
  const [overlay, setOverlay] = useState({});

  useEffect(() => {
    //demo.gdb.zip is available in public folder
    const messageWorker = new Worker();
    const message = {
      convert: location.protocol + '//' + location.host + '/demo.gdb.zip',
    };
    messageWorker.postMessage(message);
    messageWorker.onerror = (err) => {
      console.error(err)
      setOverlay({});
    };
    messageWorker.onmessage = (e) => {
      if (e.data) {
        setOverlay(e.data.result);
      } else {
        setOverlay({});
      }
    };
  }, []);

  return (
    <>
      <MapContainer center={[42.3560069, -71.0458374]} zoom={11} style={{ height: '100vh', width: '100wh' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {JSON.stringify(overlay) !== JSON.stringify({}) &&
          Object.keys(overlay).map((key, index) => (
            <GeoJSON data={overlay[key]} key={index} onEachFeature={onEachFeature} style={customcolor} pointToLayer={pointToLayer} />
          ))
        }
      </MapContainer>
    </>
  );
}

export default App;
