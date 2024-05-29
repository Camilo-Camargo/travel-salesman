import { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { layout, styleSheet } from "./styles";
import fs from 'vite-plugin-fs/browser';
import "./App.css"
import { Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { ElectricCarOutlined } from "@mui/icons-material";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function existEdge(source: any, target: any, edges: any) {
    for (const edge of edges) {
        if (edge.data.source === target && edge.data.target === source) {
            return false
        }
    }
    return true

}

export default function App() {
    const nodes = useRef<Array<any>>([]);
    const edges = useRef<Array<any>>([]);

    const [graphData, setGraphData] = useState<any>({});
    const nodeRef = useRef<HTMLInputElement>(null);
    const sourceRef = useRef<HTMLInputElement>(null);
    const targetRef = useRef<HTMLInputElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);
    const [data, setData] = useState(null);
    const addNode = () => {
        nodes.current.push({ data: { id: nodeRef.current?.value } });
        setGraphData({ nodes: nodes.current, edges: edges.current });
    }
    const addEdge = () => {
        //@ts-ignore
        edges.current = ([...edges.current, { data: { source: sourceRef.current?.value, target: targetRef.current?.value, value: valueRef.current?.value } }])
        setGraphData({ nodes: nodes.current, edges: edges.current });
    }

    const fileHandle = (event: any) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const content = e.target.result;
                const response = JSON.parse(content);
                const nodes = []
                const edges = []

                for (const city of response.cities) {
                    nodes.push({ data: { id: city.name } })
                }

                for (let i = 0; i < response.matrix.length; i++) {
                    for (let j = 0; j < response.matrix.length; j++) {
                        if (response.matrix[i][j] !== 0) {
                            if (existEdge(response.cities[i].name, response.cities[j].name, edges)) {
                                edges.push({ data: { source: response.cities[i].name, target: response.cities[j].name, value: response.matrix[i][j] } })

                            }

                        }
                    }
                }
                setGraphData({ nodes: nodes, edges: edges })
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };

        reader.onerror = function(e) {
            console.error("An error occurred while reading the file:", e);
        };

        reader.readAsText(event.target.files[0]);

    }
    console.log(data)
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
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}

                            startIcon={<CloudUploadIcon />}
                        >
                            Upload file
                            <VisuallyHiddenInput type="file" onChange={fileHandle} />
                        </Button>
                        <button onClick={async () => {
                            const cities = [
                                {
                                    name: "Tunja",
                                    latitude: 5.53528,
                                    longitude: -73.36778
                                },
                                {
                                    name: "Bogota",
                                    latitude: 4.60971,
                                    longitude: -74.08175
                                }
                                ,
                                {
                                    name: "Bucaramanga",
                                    latitude: 7.12539,
                                    longitude: -73.1198
                                },
                                {
                                    name: "Medellin",
                                    latitude: 6.25184,
                                    longitude: -75.56359
                                }
                            ]
                            const matrix = [[0, 138.7, 282, 0], [138.7, 0, 428, 418], [282, 428, 0, 428], [0, 418, 428, 0]]
                            for (let i = 0; i < matrix.length; i++) {
                                for (let j = 0; j < matrix.length; j++) {
                                    console.log(matrix[i][j])
                                }

                            }

                            fs.writeFile('cities.json', JSON.stringify({ cities: cities, matrix: matrix }))
                        }}>
                            Resolve
                        </button>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </>
    );
}


