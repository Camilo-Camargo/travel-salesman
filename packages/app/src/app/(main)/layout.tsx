import Map from "@/modules/layout/map/map";
import Nav from "@/modules/layout/nav/nav";
import Notification from "@/modules/layout/notification/notification";

export default async function PageLayout(props: { children: React.ReactNode }) {
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
