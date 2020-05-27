import React from 'react';
import { 
    RightAngleLinkModel,
    RightAngleLinkWidget,
    DefaultLinkFactory,
    PortModelAlignment,
    LinkWidget,
    PointModel
} from '@projectstorm/react-diagrams';
import { Point } from '@projectstorm/geometry';

export class OneToManyLinkModel extends RightAngleLinkModel {
	constructor(props) {
		super({
			type: 'onetomany',
			width: 1.5,
            class: 'link-onetomany',
            locked: true,
			...props
		});

		this.data = {};
	}

	serializeData() {
		return {
			source: this.getSourcePort().getNode().getID(),
			target: this.getTargetPort().getNode().getID()
		}
	}

	setData(data) {
		this.data = data;
	}
}

const CustomLinkEndWidget = props => {
	const { point, rotation, tx, ty, type } = props;

	const svgForType = (type) => {
		if(type == 'many') {
			return (
				<>
					<circle className="svg-link-ele svg-otom-circle" cx="0" cy="16" r={props.width*1.75} style={{strokeWidth:props.width}} />
					<polyline className="svg-link-ele" points="-8,0 0,15 0,0 0,30 0,15 8,0" style={{fill:"none", strokeWidth:props.width}} />				
				</>
			)
		} else if (type == 'one') {
			return (
				<polyline className="svg-link-ele" points="-8,15 0,15 0,0 0,30 0,15 8,15" style={{fill:"none", strokeWidth:props.width}} />
			)			
		}
	}

	return (
		<g transform={'translate(' + point.getPosition().x + ', ' + point.getPosition().y + ')'}>
			<g transform={'translate('+tx+','+ty+')'}>
				<g style={{ transform: 'rotate(' + rotation + 'deg)' }}>
					{svgForType(type)}
				</g>
			</g>
		</g>
	);
};

class OneToManyLinkWidget extends RightAngleLinkWidget {
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

	draggingEvent(event, index) {
		let points = this.props.link.getPoints();
		// get moving difference. Index + 1 will work because links indexes has
		// length = points.lenght - 1
		let dx = Math.abs(points[index].getX() - points[index + 1].getX());
		let dy = Math.abs(points[index].getY() - points[index + 1].getY());

		// moving with y direction
		if (dx === 0) {
			points
			this.calculatePositions(points, event, index, 'x');
		} else if (dy === 0) {
			this.calculatePositions(points, event, index, 'y');
		}
		this.props.link.setFirstAndLastPathsDirection();
	}

	handleMove = function(event) {
		this.props.link.getTargetPort()
		this.draggingEvent(event, this.dragging_index);
	}.bind(this);

	render() {
		//ensure id is present for all points on the path
		let points = this.props.link.getPoints();
		let paths = [];

		// Get points based on link orientation
		let pointLeft = points[0];
		let pointRight = points[points.length - 1];
		let hadToSwitch = false;
		if (pointLeft.getX() > pointRight.getX()) {
			pointLeft = points[points.length - 1];
			pointRight = points[0];
			hadToSwitch = true;
		}
		let dy = Math.abs(points[0].getY() - points[points.length - 1].getY());

		let onePoint = this.addCustomWidgetPoint('one', this.props.link.getSourcePort(), points[0]);;
		let manyPoint = this.addCustomWidgetPoint('many', this.props.link.getTargetPort(), points[points.length-1]);

		if (!this.state.canDrag && points.length > 2) {
			// Those points and its position only will be moved
			for (let i = 1; i < points.length; i += points.length - 2) {
				if (i - 1 === 0) {
					if (this.props.link.getFirstPathXdirection()) {
						points[i].setPosition(points[i].getX(), points[i - 1].getY());
					} else {
						points[i].setPosition(points[i - 1].getX(), points[i].getY());
					}
				} else {
					if (this.props.link.getLastPathXdirection()) {
						points[i - 1].setPosition(points[i - 1].getX(), points[i].getY());
					} else {
						points[i - 1].setPosition(points[i].getX(), points[i - 1].getY());
					}
				}
			}
		}

		// If there is existing link which has two points add one
		// NOTE: It doesn't matter if check is for dy or dx
		if (points.length === 2 && dy !== 0 && !this.state.canDrag) {
			this.props.link.addPoint(
				new PointModel({
					link: this.props.link,
					position: new Point(onePoint.point.getX(), manyPoint.point.getY())
				})
			);
		}

		paths.push(this.generateCustomEndWidget(onePoint));
		for (let j = 0; j < points.length - 1; j++) {
			paths.push(
				this.generateLink(
					LinkWidget.generateLinePath(points[j], points[j + 1]),
					{
						'data-linkid': this.props.link.getID(),
						'data-point': j,
						onMouseDown: (event) => {
							if (event.button === 0) {
								this.setState({ canDrag: true });
								this.dragging_index = j;
								// Register mouse move event to track mouse position
								// On mouse up these events are unregistered check "this.handleUp"
								window.addEventListener('mousemove', this.handleMove);
								window.addEventListener('mouseup', this.handleUp);
							}
						},
						onMouseEnter: (event) => {
							this.setState({ selected: true });
							this.props.link.lastHoverIndexOfPath = j;
						}
					},
					j
				)
			);
		}
		paths.push(this.generateCustomEndWidget(manyPoint));
		

		this.refPaths = [];
		return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}

class OneToManyLinkSegment extends React.Component {
	render() {
		return (
			<path
				// className={'svg-link-ele path ' + (this.props.selected ? 'selected' : '')}
				stroke={this.props.color}
				selected={this.props.selected}
				strokeWidth={this.props.width}
				d={this.props.path}
			>
			</path>
		);
	}
}

export class OneToManyLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('onetomany');
	}

	generateModel() {
		return new OneToManyLinkModel();
	}

	generateReactWidget(event) {
		return <OneToManyLinkWidget color='#fff' width={1.5} smooth={true} link={event.model} diagramEngine={this.engine} factory={this} />;
    }
    
	generateLinkSegment(model, selected, path) {
		let seg = super.generateLinkSegment(model, selected, path);
		return seg;
		// return (
		// 	<OneToManyLinkSegment color={model.getOptions().color} width={model.getOptions().width} selected={selected} path={path}/>
		// );
	}
}