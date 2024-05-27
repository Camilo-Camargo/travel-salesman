"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

export default function Map() {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <section className="flex w-full border rounded-3xl p-5 border-gray-500 mx-5 mt-5 bg-gray-50">
      <MapContainer
        center={[5.5324313, -73.3616014]}
        zoom={13}
        className="h-[600px] w-[1400px]"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[5.5324313, -73.3616014]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </section>
  );
}
