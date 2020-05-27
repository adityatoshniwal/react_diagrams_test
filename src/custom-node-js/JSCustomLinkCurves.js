import {
	DefaultNodeModel,
	DefaultLinkFactory,
	DefaultPortModel,
	DefaultLinkWidget,
	DefaultLinkModel,
} from '@projectstorm/react-diagrams';
import { PortModelAlignment } from '@projectstorm/react-diagrams-core';
import { BezierCurve } from '@projectstorm/geometry';
import * as React from 'react';

export class AdvancedLinkModel extends DefaultLinkModel {
	constructor() {
		super({
			type: 'advanced',
			width: 2,
			color: '#fff',
			curvyness: 75,
		});
	}

	getBezierPath(sourcePoint, targetPoint) {
		const curve = new BezierCurve();
		curve.setSource(sourcePoint.getPosition());
		curve.setTarget(targetPoint.getPosition());
		curve.setSourceControl(
			sourcePoint
				.getPosition()
				.clone()
		);
		curve.setTargetControl(
			targetPoint
				.getPosition()
				.clone()
		);

		if (this.sourcePort) {
			curve.getSourceControl().translate(...this.calculateControlOffset(this.getSourcePort()));
		}

		if (this.targetPort) {
			curve.getTargetControl().translate(...this.calculateControlOffset(this.getTargetPort()));
		}
		return curve;
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
					<polyline points="-8,0 0,15 0,0 0,15 8,0" style={{fill:"none", stroke:props.color, strokeWidth:props.width}} />				
				</>
			)
		} else if (type == 'one') {
			return (
				<polyline points="-8,15 0,15 0,0 0,15 8,15" style={{fill:"none", stroke:props.color, strokeWidth:props.width}} />
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


export class AdvancedLinkWidget extends DefaultLinkWidget {
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
		let offset = 15;
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
		const points = this.props.link.getPoints();
		var paths = [];
		this.refPaths = [];
		let onePoint = null;
		let manyPoint = null;
		if(points.length >= 4) {
			onePoint = this.addCustomWidgetPoint('one', this.props.link.getSourcePort(), points[1]);
			manyPoint = this.addCustomWidgetPoint('many', this.props.link.getTargetPort(), points[points.length-2]);
		} else {
			onePoint = this.addCustomWidgetPoint('one', this.props.link.getSourcePort());
			manyPoint = this.addCustomWidgetPoint('many', this.props.link.getTargetPort());
		}
		const curve = this.props.link.getBezierPath(onePoint.point, manyPoint.point);

		paths.push(this.generateCustomEndWidget(onePoint));
		paths.push(this.generateCustomEndWidget(manyPoint));
		paths.push(this.generateLink(curve.getSVGCurve(),{},'0'));

		return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('advanced');
	}

	generateModel() {
		return new AdvancedLinkModel();
	}

	generateReactWidget(event) {
		return <AdvancedLinkWidget color='#fff' width={2} link={event.model} diagramEngine={this.engine} />;
	}
}
