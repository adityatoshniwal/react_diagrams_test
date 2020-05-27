import * as React from 'react';
import {DagreEngine, PathFindingLinkFactory} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

export default class DagreWidget extends React.Component {
	constructor(props) {
		super(props);
		this.engine = new DagreEngine({
			graph: {
				rankdir: 'LR',
				marginx: 25,
				marginy: 25,
				nodesep: 200,
			},
			includeLinks: true
		});
	}

	autoDistribute = () => {
		this.engine.redistribute(this.props.model);

		// only happens if pathfing is enabled (check line 25)
		this.reroute();
		this.props.engine.repaintCanvas();
	};

	componentDidMount() {
		setTimeout(() => {
			// this.autoDistribute();
		}, 500);
	}

	reroute() {
		this.props.engine
			.getLinkFactories()
			.getFactory(PathFindingLinkFactory.NAME)
			.calculateRoutingMatrix();
	}

	render() {
		return (
            <>
            <button onClick={this.autoDistribute}>redistribute</button>
            <CanvasWidget className="diagram-container" engine={this.props.engine} />
            </>
		);
	}
}