import createEngine from '@projectstorm/react-diagrams';
import KeyboardAction from './commands/KeyboardAction';
import './main.css';
import {TableNodeFactory, TableNodeModel } from './nodes/TableNode';
import { OneToManyLinkFactory } from './links/OneToManyLink';
import ERDModel from './ERDModel';
import commandHandlers from './commands/commandHandlers';
import {DagreEngine, PathFindingLinkFactory} from '@projectstorm/react-diagrams';

export default class DiagramEngine {
    constructor() {
        this.initializeEngine();
        this.initializeModel();   
    }

    initializeEngine() {
        this.engine = createEngine();
		this.dagre_engine = new DagreEngine({
			graph: {
				rankdir: 'RL',
				marginx: 25,
				marginy: 25,
				nodesep: 200,
			},
			includeLinks: true
		});

        this.engine.registerListener(commandHandlers(this));
        this.engine.getNodeFactories().registerFactory(new TableNodeFactory());
        this.engine.getLinkFactories().registerFactory(new OneToManyLinkFactory());
    }

    initializeModel(data) {
        this.model = new ERDModel();
        if(data) {
            this.model.deserializeModel(data, this.engine);
        }
        this.engine.setModel(this.model);
    }

    getEngine = () => this.engine;

    getModel = () => this.getEngine().getModel();

    getNewNode = (initData) => this.getEngine().getNodeFactories().getFactory('table').generateModel({data:initData});

    serialize = () => this.getModel().serialize()

    serializeData = () => this.getModel().serializeData()

    deserializeModel = data => {

        this.getModel().deserialize(data)
    }

    repaint = () => {
        this.getEngine().repaintCanvas();
    }

    clearSelection = () => {
        this.getEngine()
            .getModel()
            .clearSelection();
    }

    getSelectedNodes = () =>
        this.getEngine()
            .getModel()
            .getSelectedEntities()
            .filter(entity => entity instanceof TableNodeModel);

    // this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyN' });
    fireAction = event =>
        this.getEngine().getActionEventBus().fireAction({
            event: {
                ...event,
                key: '',
                preventDefault: () => {},
                stopPropagation: () => {},
            },
        });
    
    fireEvent = (data, eventName) => {
        this.getEngine().fireEvent(data, eventName);
    }

    dagreDistributeNodes = () => {
        this.dagre_engine.redistribute(this.getModel());
        this.getEngine()
            .getLinkFactories()
            .getFactory(PathFindingLinkFactory.NAME)
            .calculateRoutingMatrix();
        this.repaint();
    };

    registerKeyAction = (actions) => {
        if(Array.isArray(actions)) {
            actions.forEach((action)=>{
                this.getEngine().getActionEventBus().registerAction(action);
            });
        } else {
            this.getEngine().getActionEventBus().registerAction(actions);
        }
    }
}