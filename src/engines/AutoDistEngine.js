import {DagreEngine, PathFindingLinkFactory} from '@projectstorm/react-diagrams';

export default class AutoDistEngine {
	constructor(engine, model) {
        this.engine = engine;
        this.model = model;
		this.auto_engine = new DagreEngine({
			graph: {
				rankdir: 'RL',
				marginx: 25,
				marginy: 25,
				nodesep: 200,
			},
			includeLinks: true
		});
	}

	autoDistribute = () => {
		this.auto_engine.redistribute(this.model);
		this.engine
			.getLinkFactories()
			.getFactory(PathFindingLinkFactory.NAME)
			.calculateRoutingMatrix();
		this.engine.repaintCanvas();
	};
}