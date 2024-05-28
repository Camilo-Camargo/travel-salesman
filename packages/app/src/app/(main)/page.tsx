"use client";

import Map from "@/modules/components/map/map";
import Nav from "@/modules/components/nav/nav";
import Notification from "@/modules/components/notification/notification";
import { useEffect, useState } from "react";
import { socket } from "@/socket";

export default function PageLayout(props: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

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

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <section className="flex flex-row justify-between w-full gap-x-5">
      <div className="flex flex-col justify-center w-3/4 h-full">
        {props.children}
        <Map />
        <Nav />
      </div>
      <div className="flex flex-col justify-center w-1/4 h-full">
        <Notification />
      </div>
    </section>
  );
}
