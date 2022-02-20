import React, { useState, useEffect } from 'react';
import './App.css';
import { Vega } from 'react-vega';
import * as Realm from "realm-web";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import GraphComponent from "./graph-component"

import Module from "./quick_example.js";
import dormans from './dormans-grammar.json';


let graphs: any;
export async function connectToDatabase(setState: any, state: any) {
    const app: Realm.App = new Realm.App({ id: "application-0-puupx" });
    const uri = "mongodb+srv://admin:admin@graphuser.ihbgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    /* console.log("asds"); */
    // Create an anonymous credential
    const credentials = Realm.Credentials.anonymous();
    try {
        // Authenticate the user
        const user: Realm.User = await app.logIn(credentials);
        const mongodb = await user.mongoClient("mongodb-atlas");
        const collGraphs = await mongodb.db("graph_database").collection("graphs");
        graphs = await collGraphs.find();
        /* console.log(temp.id); */
        /* var values = [];
         * for (graph in graphs){
         * } */
        setState({ module: state.module, graphs: graphs, trained_graphs: state.trained_graphs, x: state.x, y: state.y, mode: state.mode, original_graph: null, trained_graph: null, selection: state.selection });

        /* console.log(graphs[0]); */

        // `App.currentUser` updates to match the logged in user
        /* console.log(user.id === app.currentUser.id) */
        return user;
    } catch (err) {
        console.error("Failed to log in", err);
    }

}
function App() {
    const temp: any = null;
    const graphs_s: any = null;
    const trained_graphs: any = null;
    const [state, setState] = useState({ module: temp, graphs: graphs_s, trained_graphs: trained_graphs, x: "leniency", y: "mission_linearity", mode: 1, original_graph: null, trained_graph: null, selection: null });
    const signalListnerso = { "brush": handleHover, "select": handleSelect };
    const signalListnersT = { "brush": handleHover, "select": handleSelectT };

    function returnSpec(graphs: any, trained: boolean) {
        if (graphs) {
            var single: any = {}
            var signalListners: any = {}
            if (trained) {
                single = {
                    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                    "description": "Google's stock price over time.",
                    "data": {
                        "values": graphs
                    },
                    "width": 400,
                    "height": 400,
                    "mark": { "type": "point", "filled": true, "size": 100 },
                    "params": [{ "name": "select", "select": "single" }],
                    "encoding": {
                        "x": {
                            "field": state.x, "type": "quantitative"
                            , "scale": { "domain": [0, 1] },
                        },
                        "y": {
                            "field": state.y, "type": "quantitative"
                            , "scale": { "domain": [0, 1] },
                        },
                        "color": {
                            "condition": { "param": "select", "type": "ordinal" },
                            "value": "grey"
                        }

                    },

                    "selection":
                    {
                        "select": {
                            "type": "single"
                        }
                    }

                }
                signalListners = signalListnersT
            } else {
                single = {
                    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                    "description": "Google's stock price over time.",
                    "data": {
                        "values": graphs
                    },
                    "width": 400,
                    "height": 400,
                    "mark": { "type": "point", "filled": true, "size": 100 },
                    "params": [{ "name": "select", "select": "single" }],
                    "encoding": {
                        "x": {
                            "field": state.x, "type": "quantitative",
                            "scale": { "domain": [0, 1] }

                        },
                        "y": {
                            "field": state.y, "type": "quantitative",
                            "scale": { "domain": [0, 1] }

                        },
                        "scale": { "domain": [0, 1] },
                        "color": {
                            "condition": { "param": "select", "type": "ordinal" },
                            "value": "grey"
                        }

                    },

                    "selection":
                    {
                        "select": {
                            "type": "single"
                        }
                    }

                }

                signalListners = signalListnerso
            }

            const spec: any = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Google's stock price over time.",
                "data": {
                    "values": graphs
                },
                "width": 400,
                "height": 400,
                "mark": { "type": "point", "filled": true, "size": 100 },
                "params": [{ "name": "brush", "select": "interval" }],
                "encoding": {
                    "x": {
                        "field": state.x, "type": "quantitative",
                        "scale": { "domain": [0, 1] }

                    },
                    "y": {
                        "field": state.y, "type": "quantitative",
                        "scale": { "domain": [0, 1] }
                    },
                    "scale": { "domain": [0, 1] },
                    "color": {
                        "condition": { "param": "brush", "type": "ordinal" },
                        "value": "grey"
                    }

                },

                /* "selection": { */
                /* "select": {
            *   "type": "single", */
                /* "encodings": ["x", "y"] */
                /* }
                } */

            }
            if (state.mode === 0) {

                return <Vega spec={spec} signalListeners={signalListners} />
            } else if (state.mode === 1) {

                return <Vega spec={single} signalListeners={signalListners} />
            }
        } else {
            return <div> Not loaded</div>
        }

    }
    useEffect(() => {
        /* connectToDatabase(setState, state); */
        const mod = Module().then((prop: any) => {
            var zk = prop.generate_n(JSON.stringify(dormans), 10);
            var grphs = [];
            /* console.log("zk", zk.size()) */
            for (var i = 0; i < zk.size(); i++) {

                var sk = zk.get(i);
                var nodes: any = [];
                var edges = [];
                var map: any = {};

                for (var h = 0; h < sk.nodes.size(); h++) {
                    var node = sk.nodes.get(h);
                    /* console.log("whait")
* console.log(node.chain_str);
* console.log(node); */
                    var node_cp = {
                        inder: h, id: node.id, abbrev: node.abbrev, label: node.label
                    }
                    /* console.log(node.id); */
                    map[node.id] = h;
                    /* node.id = i; */
                    nodes.push(node_cp);
                    node.delete();

                }
                sk.nodes.delete();
                for (var es = 0; es < sk.edges.size(); es++) {
                    /* var edge = {"from": sk.edges.get(i).from, "to" :sk.edges.get(i).to} */
                    var temp_ed = sk.edges.get(es);
                    var edge = { "from": map[temp_ed.from], "to": map[temp_ed.to] }
                    /* console.log("edge") */
                    /* console.log(edge) */
                    edges.push(edge);
                    temp_ed.delete();

                }
                sk.edges.delete();

                var k: any = { "nodes": nodes, "edges": edges }
                /* for (var j=0; j<k.edges.size();j++){
                 *     console.log(k.edges.get(j));
                 * } */
                /* console.log("chain_str", k["chain_str"]); * / */
                k.chain_str = sk["chain_str"]
                k.map_linearity = sk["map_linearity"];
                k.leniency = sk["leniency"];
                k.mission_linearity = sk["mission_linearity"];
                k.path_redundancy = sk["path_redundancy"];
                sk.delete();
                grphs.push(k);
            }
            zk.delete();
            setState({ module: prop, graphs: grphs, trained_graphs: state.trained_graphs, x: state.x, y: state.y, mode: state.mode, original_graph: state.original_graph, trained_graph: state.trained_graph, selection: state.selection });
        });
    }, []);

    useEffect(() => {
        /* console.log("sad"); */
        /* console.log("mad");
         * console.log(state.graphs); */
        /* Module().then(function(mymod: any) {

* });
* console.log(Module); */


    }, [state]);
    function handleSelectT(name: any, value: any) {
        var trained_graph = state.graphs[value._vgsid_ - 1]
        setState({ module: state.module, graphs: state.graphs, trained_graphs: state.trained_graphs, x: state.x, y: state.y, mode: state.mode, original_graph: state.original_graph, trained_graph: trained_graph, selection: state.selection });
    }
    function handleSelect(name: any, value: any) {
        var sk = state.graphs[value._vgsid_ - 1]
        setState({ module: state.module, graphs: state.graphs, trained_graphs: state.trained_graphs, x: state.x, y: state.y, mode: state.mode, original_graph: sk, trained_graph: state.trained_graph, selection: state.selection });
    }

    function handleHover(name: any, value: any) {
        setState({ module: state.module, graphs: state.graphs, trained_graphs: state.trained_graphs, x: state.x, y: state.y, mode: state.mode, original_graph: state.original_graph, trained_graph: state.trained_graph, selection: value });
    }
    function handleChange(e: any) {

        setState({ module: state.module, graphs: state.graphs, trained_graphs: state.trained_graphs, x: state.x, y: state.y, mode: e.target.value, original_graph: state.original_graph, trained_graph: state.trained_graph, selection: state.selection });

    }
    function handleChangex(e: any) {

        setState({ module: state.module, graphs: state.graphs, trained_graphs: state.trained_graphs, x: e.target.value, y: state.y, mode: state.mode, original_graph: state.original_graph, trained_graph: state.trained_graph, selection: state.selection });

    }
    function handleChangey(e: any) {

        setState({ module: state.module, graphs: state.graphs, trained_graphs: state.trained_graphs, x: state.x, y: e.target.value, mode: state.mode, original_graph: state.original_graph, trained_graph: state.trained_graph, selection: state.selection });

    }

    function handleTrain(e: any) {
        if (state.selection && state.module) {
            var vec: any = new state.module.StringList();
            var value = state.selection;
            const keyss = Object.keys(state.selection);
            for (var i = 0; i < state.graphs.length; i++) {
                if (state.graphs[i][keyss[0]] > value[keyss[0]][0] && state.graphs[i][keyss[0]] < value[keyss[0]][1]) {
                    if (state.graphs[i][keyss[1]] > value[keyss[1]][0] && state.graphs[i][keyss[1]] < value[keyss[1]][1]) {
                        vec.push_back(state.graphs[i].chain_str)
                    }
                }
            }
            var zk: any = state.module.generate_n_learnt_chains(JSON.stringify(dormans), 10, vec);
            vec.delete();
            var grphs = [];
            for (var j = 0; j < zk.size(); j++) {

                var sk = zk.get(j);
                var nodes: any = [];
                var edges = [];
                var map: any = {};


                var sk_nodes = sk.nodes;
                for (var h = 0; h < sk_nodes.size(); h++) {
                    var node = sk_nodes.get(h);
                    /* console.log(node); */
                    var node_cp = {
                        inder: h, id: node.id, abbrev: node.abbrev, label: node.label
                    }
                    /* console.log(node_cp) */
                    map[node_cp.id] = h;
                    nodes.push(node_cp);
                    node.delete();
                }
                sk_nodes.delete();
                var sk_edges = sk.edges;
                for (var es = 0; e < sk_edges.size(); es++) {
                    var temp_ed = sk_edges.get(es);
                    var edge = { "from": map[temp_ed.from], "to": map[temp_ed.to] }
                    edges.push(edge);
                    temp_ed.delete();

                }
                sk_edges.delete();

                var k: any = { "nodes": nodes, "edges": edges }
                k.chain_str = sk["chain_str"]
                k.map_linearity = sk["map_linearity"];
                k.leniency = sk["leniency"];
                k.mission_linearity = sk["mission_linearity"];
                k.path_redundancy = sk["path_redundancy"];
                grphs.push(k);
                sk.delete();
            }

            zk.delete();
            setState({ module: state.module, graphs: state.graphs, trained_graphs: grphs, x: state.x, y: state.y, mode: state.mode, original_graph: state.original_graph, trained_graph: state.trained_graph, selection: state.selection });
        }

    }
    function renderGraph(graph: any) {

        if (graph == null) {
            return <div></div>

        }
        return <GraphComponent graph={graph} height={900} manipulate={false} />


    }
    return (
        <div className="App">
            <div className="sidebar">
                <Box sx={{ minWidth: 120 }} className="menu">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Mode</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={state.mode}
                            label="Mode"
                            onChange={handleChange}
                        >
                            <MenuItem value={0}>Train</MenuItem>
                            <MenuItem value={1}>Analyze</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 120 }} className="menu">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">X-Axis</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={state.x}
                            label="Mode"
                            onChange={handleChangex}
                        >
                            <MenuItem value={"leniency"}>Leniency</MenuItem>
                            <MenuItem value={"mission_linearity"}>Mission Linearity</MenuItem>
                            <MenuItem value={"map_linearity"}>Map Linearity</MenuItem>
                            <MenuItem value={"path_redundancy"}>Path Redundancy</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box className="menu" sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Y-Axis</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={state.y}
                            label="Mode"
                            onChange={handleChangey}
                        >
                            <MenuItem value={"leniency"}>Leniency</MenuItem>
                            <MenuItem value={"mission_linearity"}>Mission Linearity</MenuItem>
                            <MenuItem value={"map_linearity"}>Map Linearity</MenuItem>
                            <MenuItem value={"path_redundancy"}>Path Redundancy</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button className="button" onClick={handleTrain} variant="contained">Train</Button>
            </div>
            <div className="charts">
                {returnSpec(state.graphs, false)}
                {returnSpec(state.trained_graphs, true)}
            </div>
            <div className="graphs">
                {renderGraph(state.original_graph)}
                {renderGraph(state.trained_graph)}
            </div>
        </div>
    );
}

export default App;
