import Map from "@/modules/layout/map/map";
import Nav from "@/modules/layout/nav/nav";

import Notification from "@/modules/layout/notification/notification";

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <section className="flex flex-row justify-between w-full">
      <div className="flex flex-col justify-center w-3/4">
        {props.children}
        <Nav />
      </div>
      <div>
        <Notification />
      </div>
    </section>
  );
}
