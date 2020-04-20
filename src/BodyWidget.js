import * as React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

export class BodyWidget extends React.Component {
	render() {
		return <CanvasWidget className="diagram-container" engine={this.props.engine} />;
	}
}
