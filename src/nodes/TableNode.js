import * as React from 'react';
import { PortModelAlignment, DefaultNodeModel } from '@projectstorm/react-diagrams';
import { PortWidget } from '@projectstorm/react-diagrams';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import OneToManyPortModel from '../ports/OneToManyPortModel';

const TYPE = 'table';

export class TableNodeModel extends DefaultNodeModel {
	constructor({data, ...options}) {
		super({
			...options,
			type: TYPE
		});

		this._data = {
			name: 'NewTable',
			columns: [],
			...data
		};

		this.addPort(new OneToManyPortModel({name:PortModelAlignment.TOP, label:'TOP', alignment:PortModelAlignment.TOP}));
		this.addPort(new OneToManyPortModel({name:PortModelAlignment.BOTTOM, label:'BOTTOM', alignment:PortModelAlignment.BOTTOM}));
		this.addPort(new OneToManyPortModel({name:PortModelAlignment.LEFT, label:'LEFT', alignment:PortModelAlignment.LEFT}));
		this.addPort(new OneToManyPortModel({name:PortModelAlignment.RIGHT, label:'RIGHT', alignment:PortModelAlignment.RIGHT}));
	}

	addColumn(col) {
		this._data.columns.push(col);
	}

	setData(data) {
		this._data = data;
	}

	getData() {
		return this._data;
	}

	serializeData() {
		return this.getData();
	}

	serialize() {
		return {
			...super.serialize(),
			data: this.getData()
		};
	}
}

class TableNodeWidget extends React.Component {
	constructor(props) {
		super(props)
	}

	generateColumn(col, posn) {
		return (
			<tr key={posn}>
				<td>{col.name}</td>
				<td>{col.displaytypname}</td>
			</tr>
		)
	}

	generatePort = port => {
		return (<PortWidget engine={this.props.engine} port={port} key={port.getID()} className={"port-" + port.options.alignment}>
            <div  />
        </PortWidget>);
	};
	
	onAddClick = () => {
		this.props.node.addColumn({name: 'newcol', displaytypname: 'smallint', is_primary_key: false});
		this.forceUpdate();
	}
    
	render() {
		let node_data = this.props.node.getData();
		return (
			<div className={"table-node " + (this.props.node.isSelected() ? 'selected': '') }>
                {_.map(this.props.node.getPorts(), this.generatePort)}
				<div className="table-name">{node_data.name}</div>
				<div className="table-cols">
					<table>
						<tbody>
							{_.map(node_data.columns, this.generateColumn)}
						</tbody>
					</table>
				</div>
				<button onClick={this.onAddClick.bind(this)}>Add column</button>
			</div>
		);
	}
}

export class TableNodeFactory extends AbstractReactFactory {
	constructor() {
		super(TYPE);
	}

	generateModel(event) {
		return new TableNodeModel(event.initialConfig);
	}

	generateReactWidget(event) {
		return <TableNodeWidget engine={this.engine} node={event.model} />;
	}
}
