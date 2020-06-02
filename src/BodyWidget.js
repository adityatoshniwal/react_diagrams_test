import * as React from 'react';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import AutoDistEngine from './engines/AutoDistEngine';
import {TableNodeModel} from './nodes/TableNode';
import { PortModelAlignment } from '@projectstorm/react-diagrams';
import DiagramEngine from './DiagramEngine';
import KeyboardAction from './commands/KeyboardAction';

export default class BodyWidget extends React.Component {
	constructor(props) {
		super(props);
		this.diagram = new DiagramEngine();
		this.autoDistEngine = new AutoDistEngine(props.engine, props.model);

		this.state = {
			relSource: null,
		}

		this.diagram.getModel().getNodes().forEach(node => {
			this.registerSelectionListener(node);
		});

		this.fileInputRef = React.createRef();
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
	addRelation(source, target, factory) {
		let newLink = source.getPort(PortModelAlignment.RIGHT).link(target.getPort(PortModelAlignment.BOTTOM), factory)
		this.props.model.addLink(newLink);
		this.forceUpdate();
	}

	onAddRelationClick() {
		this.setState({relSource: this.props.model.getSelectedEntities()[0]});
	}

	onCloneNode = () => {
		this.diagram.fireEvent(null, 'cloneNode');
	}

	onAddNewNode = () => {
		this.diagram.fireEvent(null, 'addNewNode');
	}

	onAutoDistribute = () => {
		this.diagram.fireEvent(null, 'autoDistribute');
	}
	
	onFileChange = (event) => {
		let fReader = new FileReader();
		fReader.readAsText(event.target.files[0]);
		fReader.onloadend = (event) => {
			this.diagram.fireEvent(JSON.parse(event.target.result), 'loadDiagram');
		}
	}

	onLoadDiagram = () => {
		this.fileInputRef.current.click();
	}

	onSaveDiagram = () => {
		this.diagram.fireEvent(null, 'saveDiagram');
	}

	onExportDiagramData = () => {
		this.diagram.fireEvent(null, 'exportDiagramData');
	}

	componentDidMount() {
		this.diagram.registerKeyAction([
			new KeyboardAction({
				ctrlKey: true,
				code: 'KeyN'
			}, this.onAddNewNode),
			new KeyboardAction({
				ctrlKey: true,
				code: 'KeyD'
			}, this.onCloneNode),
			new KeyboardAction({
				ctrlKey: true,
				code: 'KeyR'
			}, this.onAutoDistribute),
			new KeyboardAction({
				ctrlKey: true,
				code: 'KeyO'
			}, this.onLoadDiagram)			
		]);
	}
	render() {
		return (
			<>
			<div>
				<button onClick={this.onAutoDistribute}>Redistribute</button>
				<button onClick={this.onAddNewNode}>Add Node</button>
				<button onClick={this.onCloneNode}>Clone</button>
				{/* <button onClick={this.onAddRelationClick.bind(this)}>Add Relation</button> */}
				<button onClick={this.onSaveDiagram}>Save</button>
				<button onClick={this.onExportDiagramData}>Export data</button>
				<input className="file-input-hidden" type="file" id="fileinput" ref={this.fileInputRef} onChange={this.onFileChange}/>
				<button onClick={this.onLoadDiagram} type=''>Load data</button>
			</div>
			<CanvasWidget className="diagram-container" engine={this.diagram.getEngine()} />
			</>
		);
	}
}
