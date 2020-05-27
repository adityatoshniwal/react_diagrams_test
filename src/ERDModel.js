import { DiagramModel } from '@projectstorm/react-diagrams';

export default class ERDModel extends DiagramModel {
    constructor(options) {
        super(options);
    }

    serializeData() {
        let node_data = {}, link_data = {};
        
        this.getNodes().map((node)=>{
            node_data[node.getID()] = node.serializeData(); 
        });

        this.getLinks().map((link)=>{
            link_data[link.getID()] = {
                source: link.getSourcePort().getNode().getID(),
                target: link.getTargetPort().getNode().getID(),
                ...link.serializeData()
            }
        });

        return {
            'diagram-nodes': node_data,
            'diagram-links': link_data
        };
    }

    deserializeData() {
        console.log('deserdta');
    }
 }