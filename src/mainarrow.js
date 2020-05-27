import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	PathFindingLinkFactory,
	DefaultLabelModel
} from '@projectstorm/react-diagrams';
import './main.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BodyWidget } from './BodyWidget';
import {AdvancedLinkFactory, AdvancedPortModel} from './custom-node-js/JSCustomLinkRightAngle';

// setup the diagram engine
const engine = createEngine();

// setup the diagram model
const model = new DiagramModel();

// // create four nodes in a way that straight links wouldn't work
// const node1 = new DefaultNodeModel('Node A', 'rgb(0,192,255)');
// const port1 = node1.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
// node1.setPosition(340, 350);

// const node2 = new DefaultNodeModel('Node B', 'rgb(255,255,0)');
// const port2 = node2.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
// node2.setPosition(240, 80);
// const node3 = new DefaultNodeModel('Node C', 'rgb(192,255,255)');
// const port3 = node3.addPort(new DefaultPortModel(true, 'in-1', 'In'));
// node3.setPosition(540, 180);
// const node4 = new DefaultNodeModel('Node D', 'rgb(192,0,255)');
// const port4 = node4.addPort(new DefaultPortModel(true, 'in-1', 'In'));
// node4.setPosition(95, 185);
// const node5 = new DefaultNodeModel('Node E', 'rgb(192,255,0)');
// node5.setPosition(250, 180);

// // linking things together (specifically using the pathfinding link)
// const link1 = port1.link(port4, pathfinding);
// const link2 = port2.link(port3, pathfinding);

// link1.addLabel(
// 	new DefaultLabelModel({
// 		label: 'I am a label!',
// 		offsetY: 20
// 	})
// );


engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());

// create some nodes
var nodea1 = new DefaultNodeModel('Source', 'rgb(0,192,255)');
let porta1 = nodea1.addPort(new AdvancedPortModel(false, 'out-1', 'Out thick'));
let porta2 = nodea1.addPort(new DefaultPortModel(false, 'out-2', 'Out default'));
nodea1.setPosition(100, 100);

var nodea2 = new DefaultNodeModel('Target', 'rgb(192,255,0)');
var porta3 = nodea2.addPort(new AdvancedPortModel(true, 'in-1', 'In thick'));
var porta4 = nodea2.addPort(new DefaultPortModel(true, 'in-2', 'In default'));
nodea2.setPosition(300, 100);

var nodea3 = new DefaultNodeModel('Source', 'rgb(0,192,255)');
nodea3.addPort(new AdvancedPortModel(false, 'out-1', 'Out thick'));
nodea3.addPort(new DefaultPortModel(false, 'out-2', 'Out default'));
nodea3.setPosition(100, 200);

var nodea4 = new DefaultNodeModel('Target', 'rgb(192,255,0)');
nodea4.addPort(new AdvancedPortModel(true, 'in-1', 'In thick'));
nodea4.addPort(new DefaultPortModel(true, 'in-2', 'In default'));
nodea4.setPosition(300, 200);

const pathfinding = engine.getLinkFactories().getFactory(PathFindingLinkFactory.NAME);

// add all to the main model
model.addAll(porta1.link(porta3), porta2.link(porta4));
model.addAll(nodea1, nodea2, nodea3, nodea4);
// model.addAll(node1, node2, node3, node4, node5, link1, link2);

// load model into engine and render
engine.setModel(model);

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(<BodyWidget engine={engine} />, document.querySelector('#application'));
});