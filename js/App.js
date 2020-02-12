import React from "react";
import * as SRD from "@projectstorm/react-diagrams";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      engine: null,
      engineIsInitialized: false,
      model: null
    }
  }
  componentDidMount() {
    const engine = new SRD.DiagramEngine();
    engine.installDefaultFactories();
    const model = new SRD.DiagramModel();

    var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
    let port1 = node1.addOutPort("Out");
    node1.setPosition(100, 100);
    var node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
    let port2 = node2.addInPort("In");
    node2.setPosition(400, 100);
    let link1 = port1.link(port2);
    link1.setColor('black');
    model.addAll(node1, node2, link1);
    var node3 = new SRD.DefaultNodeModel("Node 3", "rgb(192,255,0)");
    node3.addInPort("In");
    node3.addOutPort("out");
    model.addAll(node3);
    engine.setDiagramModel(model);
    this.setState({
      engine: engine,
      model: model,
      engineIsInitialized: true
    })
  }
  render() {
    return (
      <>
      {this.state.engineIsInitialized && (
        <>
          <SRD.DiagramWidget diagramEngine={this.state.engine} model={this.state.model} />
        </>
      )}
      </>
    )
  }
}

export default App;