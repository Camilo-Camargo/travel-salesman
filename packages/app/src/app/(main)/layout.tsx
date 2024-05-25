import Map from "@/modules/layout/map/map";
import Nav from "@/modules/layout/nav/nav";

import Notification from "@/modules/layout/notification/notification";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <section className="flex flex-row justify-between w-full">
      <div className="flex flex-col justify-center">
        {props.children}
        <Nav />
      </div>
      <div>
        <Notification />
      </div>
    </section>
  );
}
