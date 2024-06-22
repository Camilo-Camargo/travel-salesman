"use client";

import Map from "@/modules/components/map/map";
import Nav from "@/modules/components/nav/nav";
import Notification from "@/modules/components/notification/notification";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import L from "leaflet"

export default function PageLayout(props: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [routes, setRoutes] = useState<Array<any>>([]);
  const [selected, setSelected] = useState();

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("routes:found",
      (e) => {
        setRoutes(e);
      }
    )

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  let waypoints;
  if (selected) {
    waypoints = [];
    selected.forEach((path) => {
      waypoints.push(L.latLng(path.from.lat, path.from.lng));
    });

    const last = selected[selected.length-1].to;
    waypoints.push(L.latLng(last.lat, last.lng))
  }

  return (
    <section className="flex flex-row justify-between w-full gap-x-5">
      <div className="flex flex-col justify-center w-3/4 h-full">
        {props.children}
        { waypoints &&  <Map waypoints={waypoints}/>}
      </div>
      <div className="flex flex-col justify-center w-1/4 h-full">
        <Notification routes={routes} onChange={(v) => {
          setSelected(v);
        }} />
      </div>
    </section>
  );
}
