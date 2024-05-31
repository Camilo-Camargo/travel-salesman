
export type NotificationProps = {
  routes?: [],
  onChange?: (v: any) => void
};

export default function Notification(props: NotificationProps) {

  return (
    <section className="flex flex-col gap-2 p-5">
      <div className="flex flex-col justify-center border rounded-3xl p-5 border-gray-500 bg-gray-50">
        <h1>Notification</h1>
      </div>

      <div className="flex flex-col p-2 border border-black rounded">
        {
          props.routes.map((v, k) => {
            return (
              <div key={k} onClick={() => {
                  props.onChange(v);
              }}>
                {v?.paths?.map((p) => {
                  return (
                    <div>
                      {p.from.name} -> {p.to.name}
                    </div>
                  );
                })}
                <p>price: {v.price}</p>
                <p>distance: {v.distance}</p>
              </div>
            );
          })
        }
      </div>
    </section>
  );
}
