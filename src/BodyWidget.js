import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import AutoDistEngine from './engines/AutoDistEngine';
import {TableNodeModel} from './nodes/TableNode';
import { PortModelAlignment } from '@projectstorm/react-diagrams';

export default class BodyWidget extends React.Component {
	constructor(props) {
		super(props);
		this.autoDistEngine = new AutoDistEngine(props.engine, props.model);

		this.state = {
			relSource: null,
		}

		this.onetomany = props.engine.getLinkFactories().getFactory('onetomany')

		props.model.getNodes().forEach(node => {
			this.registerSelectionListener(node);
		});
	}

	registerSelectionListener(node) {
		node.registerListener({
			eventDidFire: (e)=>{
				if(e.function == 'selectionChanged') {
					if(e.isSelected) {
						if(this.state.relSource) {
							this.addRelation(this.state.relSource, e.entity, this.onetomany);
							this.setState({relSource: null});
						}
					}
				}
				
			}
		});
	}

	unselectAll() {
		this.props.model.getSelectedEntities().forEach(node => {
			node.setSelected(false);
		});
	}
	addRelation(source, target, factory) {
		let newLink = source.getPort(PortModelAlignment.RIGHT).link(target.getPort(PortModelAlignment.BOTTOM), factory)
		this.props.model.addLink(newLink);
		this.forceUpdate();
	}

	onRedistClick() {
		this.autoDistEngine.autoDistribute();
	}
	onAddRelationClick() {
		this.setState({relSource: this.props.model.getSelectedEntities()[0]});
	}
	onAddNodeClick() {
		let newNode = new TableNodeModel({name:'Table'});
		newNode.setPosition(50, 50);
		this.unselectAll();
		newNode.setSelected(true);
		this.registerSelectionListener(newNode);
		this.props.model.addNode(newNode);
		this.forceUpdate();
	}
	onSerializeClick() {
		console.log(JSON.stringify(this.props.model.serialize(), null, 4));
	}
	onSerializeDataClick() {
		console.log(JSON.stringify(this.props.model.serializeData(), null, 4));
	}
	render() {
		return (
			<>
			<div>
				<button onClick={this.onRedistClick.bind(this)}>Redistribute</button>
				<button onClick={this.onAddNodeClick.bind(this)}>Add Node</button>
				<button onClick={this.onAddRelationClick.bind(this)}>Add Relation</button>
				<button onClick={this.onSerializeClick.bind(this)}>Serialize</button>
				<button onClick={this.onSerializeDataClick.bind(this)}>Serialize data</button>
			</div>
			<CanvasWidget className="diagram-container" engine={this.props.engine} />
			</>
		);
	}
}
