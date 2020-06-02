import DiagramEngine from './DiagramEngine';
import './main.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BodyWidget from './BodyWidget';

// // setup the diagram engine
const diagram = new DiagramEngine();

// const onetomany = engine.getLinkFactories().getFactory('onetomany');
// const tablefactory = engine.getNodeFactories().getFactory('table');

// var nodea1 = tablefactory.generateModel({
// 	data: {
// 		name: 'Table1',
// 		columns: [
// 			{name: 'id', displaytypname: 'smallint', is_primary_key: true},
// 			{name: 'col1', displaytypname: 'text', is_primary_key: false}
// 		]
// 	}
// });
// nodea1.setPosition(200, 200);

// var nodea2 = tablefactory.generateModel({
// 	data: null
// });
// nodea2.setPosition(500, 50);

// var nodea3 = tablefactory.generateModel({
// 	data: null
// });
// nodea3.setPosition(500, 400);

// // add all to the main model
// var link1 = nodea1.getPort(PortModelAlignment.RIGHT).link(nodea2.getPort(PortModelAlignment.BOTTOM), onetomany)
// var link2 = nodea1.getPort(PortModelAlignment.BOTTOM).link(nodea3.getPort(PortModelAlignment.TOP), onetomany)
// var link3 = nodea3.getPort(PortModelAlignment.BOTTOM).link(nodea1.getPort(PortModelAlignment.LEFT), onetomany)

// model.addAll(link1, link2, link3);
// model.addAll(nodea1, nodea2, nodea3);

// // load model into engine and render
// engine.setModel(model);

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(<BodyWidget engine={diagram} />, document.querySelector('#application'));
});