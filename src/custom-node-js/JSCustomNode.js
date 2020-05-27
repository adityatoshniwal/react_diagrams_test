import * as React from 'react';
import { PortModelAlignment, DefaultNodeModel } from '@projectstorm/react-diagrams';
import { PortWidget } from '@projectstorm/react-diagrams';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
// import {AdvancedPortModel} from './JSCustomLinkCurves';
import {AdvancedPortModel} from './JSCustomLinkRightAngle';

/**
 * Example of a custom model using pure javascript
 */
export class CustomNodeModel extends DefaultNodeModel {
	constructor(options = {}) {
		super({
			...options,
			type: 'customnode'
		});
        this.color = options.color || { options: 'red' };

        this.addPort(new AdvancedPortModel({name:PortModelAlignment.TOP, label:'Out thick', alignment:PortModelAlignment.TOP}));
        this.addPort(new AdvancedPortModel({name:PortModelAlignment.BOTTOM, label:'Out thick', alignment:PortModelAlignment.BOTTOM}));
        this.addPort(new AdvancedPortModel({name:PortModelAlignment.LEFT, label:'Out thick', alignment:PortModelAlignment.LEFT}));
        this.addPort(new AdvancedPortModel({name:PortModelAlignment.RIGHT, label:'Out thick', alignment:PortModelAlignment.RIGHT}));
	}

	serialize() {
		return {
			...super.serialize(),
			color: this.options.color
		};
	}

	deserialize(ob, engine) {
		super.deserialize(ob, engine);
		this.color = ob.color;
	}
}


export class CustomNodeWidget extends React.Component {
    generatePort = port => {
		return (<PortWidget engine={this.props.engine} port={port} key={port.getID()} className={"port-" + port.options.alignment}>
            <div  />
        </PortWidget>);
    };
    
	render() {
		return (
			<div className="custom-node">
                {_.map(this.props.node.getPorts(), this.generatePort)}
			</div>
		);
	}
}

export class CustomNodeFactory extends AbstractReactFactory {
	constructor() {
		super('customnode');
	}

	generateModel(event) {
		return new CustomNodeModel();
	}

	generateReactWidget(event) {
		return <CustomNodeWidget engine={this.engine} node={event.model} />;
	}
}
