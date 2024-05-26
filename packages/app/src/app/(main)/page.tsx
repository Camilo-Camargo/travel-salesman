import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/modules/layout/map/map"), { ssr: false });

export default function Home() {
  return <></>;
}
