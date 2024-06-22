
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

      <div className="flex flex-col p-2 gap-2">
        {
          props.routes.map((v, k) => {
            return (
              <div className="border border-black" key={k}
                onClick={() => {
                  props.onChange(v);
                }}
              >
                {v?.map((p) => {
                  return (
                    <div>
                      {p.from.name} -> {p.to.name}
                    </div>
                  );
                })}
              </div>
            );
          })
        }
      </div>
    </section>
  );
}
