import { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { layout, styleSheet } from "./styles";
import "./App.css"

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

let isCharacter = false;



export default function App() {
  const nodes = useRef<Array<any>>([]);
  const edges = useRef<Array<any>>([]);

  const [graphData, setGraphData] = useState<any>({});
  const nodeRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const [dataAPI, setDataAPI] = useState<{
    phases: any,
    solution: any,
    way: Array<Array<any>>
  }>();

  const addNode = () => {
    nodes.current.push({ data: { id: nodeRef.current?.value } });
    setGraphData({ nodes: nodes.current, edges: edges.current });
  }
  const addEdge = () => {
    //@ts-ignore
    edges.current = ([...edges.current, { data: { source: sourceRef.current?.value, target: targetRef.current?.value, value: valueRef.current?.value } }])
    setGraphData({ nodes: nodes.current, edges: edges.current });
  }

  return (
    <>
      <div>
        <CytoscapeComponent
          elements={CytoscapeComponent.normalizeElements(graphData)}
          pan={{ x: 200, y: 200 }}
          style={{ width: "100%", height: "100vh" }}
          minZoom={0.1}
          autounselectify={false}
          boxSelectionEnabled={true}
          layout={layout}
          stylesheet={styleSheet}
        />
      </div>

      <div style={{
        position: "absolute", top: 0, width: "50vw", flexDirection: "column", justifyItems: "center", alignItems: "center", padding: "20px", boxSizing: "border-box", background: "#FBFCFD", minHeight: "100vh"
      }}>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div style={{ display: "flex", justifyContent: "center", fontSize: "25px" }}>
            <h1 style={{ color: "#4a56a6" }}>Admin</h1>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
            <label>Name</label>
            <input type="text" ref={nodeRef} />
            <button onClick={addNode}>Add node</button>
          </div>

          <div style={{ display: "flex", gap: 10, justifyItems: "center", alignItems: "center" }}>
            <label >source</label>
            <input ref={sourceRef} />
            <label >target</label>
            <input ref={targetRef} />
            <label >Value</label>
            <input ref={valueRef} />
            <button onClick={addEdge}>Add edge</button>
          </div>

          <div>
            <button onClick={async () => {
              console.log(nodes.current)
              console.log(edges.current)
              const phases: any = {};

              const offset = 'a'.charCodeAt(0);

              function findPhases(nodes) {
                const keys = Object.keys(nodes).sort();
                const lastNode = keys[keys.length - 1]
                phases[0] = 1;

                for (const node in nodes) {
                  for (const key in nodes[node]) {
                    phases[key] = phases[node] + 1;
                  }
                }
                delete phases[parseInt(lastNode) + 1];
              }

              let dict: any = {};
              for (let edge of edges.current) {
                const data = edge.data;
                isCharacter = isLetter(data.source);
                let sourceOffset = 0;
                let targetOffset = 0;


                if (isCharacter) {
                  sourceOffset = data.source.charCodeAt(0) - offset;
                  targetOffset = data.target.charCodeAt(0) - offset;
                } else {
                  sourceOffset = parseInt(data.source);
                  targetOffset = parseInt(data.target)
                }

                if (!(sourceOffset in dict)) {
                  dict[sourceOffset] = {};
                }

                dict[sourceOffset][targetOffset] = parseInt(data.value);
              }

              findPhases(dict);
              const dataJson = await (await fetch("http://localhost:8000/data", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  nodes: JSON.stringify(dict),
                  phases: JSON.stringify(phases),
                })
              })).json();

              const way = JSON.parse(dataJson.way);
              const solution = JSON.parse(dataJson.solution);
              setDataAPI({
                way: way,
                solution: solution,
                phases: phases
              });
            }}>
              Resolve
            </button>
          </div>
          <div>

            {
              dataAPI?.way &&

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h2>Best way</h2>
                {
                  dataAPI.way.map((value) => {
                    return (

                      <div style={{ display: "flex", justifyItems: "center", alignItems: "center", gap: "5px" }}>
                        {
                          value.map((path, index) => {
                            let nodeLabel: any = 0;
                            if (isCharacter) {
                              nodeLabel = String.fromCharCode('a'.charCodeAt(0) + parseInt(path));
                            } else {
                              nodeLabel = parseInt(path);
                            }
                            return (
                              <>
                                <span style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "5px",
                                  background: "#DBDDED",
                                  borderRadius: "100px",
                                  width: "30px",
                                  height: "30px",
                                }}>{nodeLabel}</span>
                                {
                                  value.length - 1 != index && <span>{" -> "}</span>
                                }
                              </>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
              </div>
            }


          </div>

          <div>

            <table style={{ display: "flex", flexDirection: "column-reverse", gap: 20, border: "1px  solid", padding: "10px"}}>
              {
                dataAPI?.phases && Object.keys(dataAPI.phases).sort().map((key) => {
                  const phase = dataAPI.phases[key];
                  const phases: any = {};
                  for (const key in dataAPI.solution) {
                    const item = dataAPI.solution[key];
                    if (item.phase == phase) {
                      phases[key] = item;
                    }
                  }

                  const targetSet = new Set();
                  Object.keys(phases).map((node) => {
                    const target = phases[node]['f(s,x)'];
                    Object.keys(target).map((targetKey) => {
                      targetSet.add(targetKey);
                    })
                  })

                  return (
                    <>
                      <tr style={{ display: "flex", justifyContent: "space-between" }}>
                        {Object.keys(phases).map((node) => {
                          console.log(phases);
                          const phase = phases[node];
                          return (
                            <>
                              <td>{node}</td>
                              {
                                [...targetSet].map((target) => {
                                  return <td>{phase['f(s,x)'][target]}</td>
                                })
                              }
                              <td>{phase['f*(s)']}</td>
                              <td>{phase['x*']}</td>
                            </>)

                        })}
                      </tr>


                      <tr style={{ display: "flex", justifyContent: "space-between", background: "rgb(219, 221, 237)"}}>
                        <th>{"s"}</th>
                        {

                          [...targetSet].map((target) => {
                            //@ts-ignore
                            return (<th>{target}</th>);
                          })
                        }
                        <th>{`f${phase}(s)`}</th>
                        <th>{`x${phase}`}</th>
                      </tr>
                      <caption style={{borderBottom: "1px solid"}}>Phase {phase}</caption>
                    </>
                  );
                })
              }
            </table>
          </div>
        </div>
      </div>
    </>
  );
}


