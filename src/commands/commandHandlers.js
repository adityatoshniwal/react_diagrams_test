export default function commandHandlers(diagram) {
    return {
        addNewNode: () => {
            let newNode = diagram.getNewNode({name:'Table'});
            newNode.setPosition(50, 50);
            diagram.clearSelection();
            newNode.setSelected(true);
            diagram.getModel().addNode(newNode);
            diagram.repaint();
        },
        cloneNode: () => {
            const selected = diagram.getSelectedNodes();
            if(selected.length == 1) {
                let newNode = selected[0].clone();
                let {x, y} = newNode.getPosition();

                newNode.setPosition(x+20, y+20);
                diagram.clearSelection();
                newNode.setSelected(true);
                diagram.getModel().addNode(newNode);
                diagram.repaint();
            }
        },
        autoDistribute: () => {
            diagram.dagreDistributeNodes();
        },
        saveDiagram: () => {
            let diagBlob = new Blob([JSON.stringify(diagram.serialize())], {type : 'text/json'}),
                url = window.URL.createObjectURL(diagBlob),
                link = document.createElement('a');

            document.body.appendChild(link);

            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(respBlob, 'digram.pgerd');
            } else {
                link.setAttribute('href', url);
                link.setAttribute('download', 'digram.pgerd');
                link.click();
            }
            document.body.removeChild(link);
        },
        loadDiagram: (data) => {
            diagram.initializeModel(data);
        },
        exportDiagramData: () => {
            console.log(diagram.serializeData());
        }
    }
}