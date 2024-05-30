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

function indexNode(name: any, nodes: any): Number {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].name === name) {
            return i
        }
    }
    return 0
}
export default function App() {
    const nodes = useRef<Array<any>>([]);
    const edges = useRef<Array<any>>([]);

    const [graphData, setGraphData] = useState<any>({});
    const nameRef = useRef<HTMLInputElement>(null);
    const latitudeRef = useRef<HTMLInputElement>(null);
    const longitudeRef = useRef<HTMLInputElement>(null);
    const sourceRef = useRef<HTMLInputElement>(null);
    const targetRef = useRef<HTMLInputElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);
    const [dataNodes, setDataNodes] = useState([]);
    const [matrixNodes, setMatrixNodes] = useState([[]]);

    const addNode = () => {
        nodes.current.push({ data: { id: nameRef.current?.value } });

        setDataNodes([...dataNodes, { name: nameRef.current?.value, latitude: Number(latitudeRef.current?.value), longitude: Number(longitudeRef.current?.value) }])
        setGraphData({ nodes: nodes.current, edges: edges.current });
    }
    const addEdge = () => {
        const matrix = Array.from({ length: dataNodes.length }, () => Array(dataNodes.length).fill(0));

        for (let i = 0; i < matrixNodes.length; i++) {
            for (let j = 0; j < matrixNodes[i].length; j++) {
                matrix[i][j] = matrixNodes[i][j]
                matrix[i][j] = matrixNodes[i][j]
            }
        }

        matrix[indexNode(sourceRef.current?.value, dataNodes)][indexNode(targetRef.current?.value, dataNodes)] = Number(valueRef.current?.value)
        matrix[indexNode(targetRef.current?.value, dataNodes)][indexNode(sourceRef.current?.value, dataNodes)] = Number(valueRef.current?.value)
        setMatrixNodes(matrix)

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
                setDataNodes(response.cities)
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
            }
        };

        reader.onerror = function(e) {
        };

        reader.readAsText(event.target.files[0]);

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
                        <label>Nombre</label>
                        <input type="text" ref={nameRef} />
                        <label>Latitud</label>
                        <input type="text" ref={latitudeRef} />
                        <label>Longitud</label>
                        <input type="text" ref={longitudeRef} />
                        <button onClick={addNode}>Add node</button>
                    </div>

                    <div style={{ display: "flex", gap: 10, justifyItems: "center", alignItems: "center" }}>
                        <label >Origen</label>
                        <input ref={sourceRef} />
                        <label >Destino</label>
                        <input ref={targetRef} />
                        <label >Distancia</label>
                        <input ref={valueRef} />
                        <button onClick={addEdge}>Add edge</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Importar
                            <VisuallyHiddenInput type="file" onChange={fileHandle} />
                        </Button>
                        <button
                            onClick={() => {
                                const blob = new Blob([JSON.stringify({ cities: dataNodes, matrix: matrixNodes })], { type: 'application/json' })
                                const url = window.URL.createObjectURL(blob)
                                const link = document.createElement('a')
                                link.href = url
                                link.setAttribute('download', 'data.json')
                                link.click()
                                document.body.removeChild(link)
                            }}
                        >Exportar</button>
                    </div>
                    <button onClick={async () => {

                    }}>
                        Resolve
                    </button>
                    <div>

                    </div>
                </div>
            </div >
        </>
    );
}


