"use client";
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

export type RoutingMachineLayerProps = {
  waypoints: Array<any>;
};

const createRoutineMachineLayer = (props: RoutingMachineLayerProps) => {
  const instance = L.Routing.control({
    waypoints: props.waypoints,
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    show: true,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: false
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
