import {
	DefaultLinkFactory,
	DefaultPortModel,
	RightAngleLinkWidget,
	RightAngleLinkModel,
	PathFindingLinkModel,
	PathFindingLinkWidget,
	PathFindingLinkFactory,
} from '@projectstorm/react-diagrams';
import { LinkWidget, PointModel, PortModelAlignment } from '@projectstorm/react-diagrams-core';
import * as React from 'react';
import { Point } from '@projectstorm/geometry';

export class AdvancedLinkModel extends PathFindingLinkModel {
	constructor() {
		super({
			type: 'advanced',
			width: 2,
			color: '#fff',
		});
	}
}

export class AdvancedPortModel extends DefaultPortModel {
	createLinkModel() {
		return new AdvancedLinkModel();
	}
}

const CustomLinkEndWidget = props => {
	const { point, rotation, tx, ty, type } = props;

	const svgForType = (type) => {
		if(type == 'many') {
			return (
				<>
					<circle cx="0" cy="16" r={props.width*1.75} style={{fill:props.color, strokeWidth:props.width}} />
					<polyline points="-8,0 0,15 0,0 0,30 0,15 8,0" style={{fill:"none", stroke:props.color, strokeWidth:props.width}} />				
				</>
			)
		} else if (type == 'one') {
			return (
				<polyline points="-8,15 0,15 0,0 0,30 0,15 8,15" style={{fill:"none", stroke:props.color, strokeWidth:props.width}} />
			)			
		}
	}

	return (
		<g className="arrow" transform={'translate(' + point.getPosition().x + ', ' + point.getPosition().y + ')'}>
			<g transform={'translate('+tx+','+ty+')'}>
				<g style={{ transform: 'rotate(' + rotation + 'deg)' }}>
					{svgForType(type)}
				</g>
			</g>
		</g>
	);
};


export class AdvancedLinkWidget extends PathFindingLinkWidget {
	constructor(props) {
		super(props);
	}

	endPointTranslation(alignment, offset) {
		let degree = 0;
		let tx = 0, ty = 0;
		switch(alignment) {
			case PortModelAlignment.BOTTOM:
				degree = 0;
				ty = -offset;
				break;
			case PortModelAlignment.LEFT:
				degree = 90;
				tx = offset
				break;
			case PortModelAlignment.TOP:
				degree = 180;
				ty = offset;
				break;
			case PortModelAlignment.RIGHT:
				degree = -90;
				tx = -offset;
				break;							
		}
		return [degree, tx, ty];
	}

	addCustomWidgetPoint(type, endpoint, point) {
		let offset = 30;
		const [rotation, tx, ty] = this.endPointTranslation(endpoint.options.alignment, offset);
		if(!point) {
			point = this.props.link.point(
				endpoint.getX()-tx, endpoint.getY()-ty, {'one': 1, 'many': 2}[type]
			);
		} else {
			point.setPosition(endpoint.getX()-tx, endpoint.getY()-ty);
		}
		
		return {
			type: type,
			point: point,
			rotation: rotation,
			tx: tx,
			ty: ty
		}		
	}
	
	generateCustomEndWidget({type, point, rotation, tx, ty}) {
		return (
			<CustomLinkEndWidget
				key={point.getID()}
				point={point}
				rotation={rotation}
				tx={tx}
				ty={ty}
				type={type}
				colorSelected={this.props.link.getOptions().selectedColor}
				color={this.props.link.getOptions().color}
				width={this.props.width}
			/>
		);
	}

	render() {
		this.refPaths = [];
		//ensure id is present for all points on the path
		var points = this.props.link.getPoints();
		var paths = [];

		// first step: calculate a direct path between the points being linked
		const directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));

		const routingMatrix = this.props.factory.getRoutingMatrix();
		// now we need to extract, from the routing matrix, the very first walkable points
		// so they can be used as origin and destination of the link to be created
		const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
		if (smartLink) {
			const { start, end, pathToStart, pathToEnd } = smartLink;

			// second step: calculate a path avoiding hitting other elements
			const simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd);

			paths.push(
				//smooth: boolean, extraProps: any, id: string | number, firstPoint: PointModel, lastPoint: PointModel
				this.generateLink(this.props.factory.generateDynamicPath(simplifiedPath), '0')
			);
		}
		return <>{paths}</>;
	}
}

export class AdvancedLinkFactory extends PathFindingLinkFactory {
	constructor() {
		PathFindingLinkFactory.NAME = 'advanced';
		super('advanced');
	}

	generateModel() {
		return new AdvancedLinkModel();
	}

	generateReactWidget(event) {
		return <AdvancedLinkWidget color='#fff' width={2} smooth={true} link={event.model} diagramEngine={this.engine} factory={this} />;
	}
}
