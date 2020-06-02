import { Action, InputType } from '@projectstorm/react-canvas-core';
import {TableNodeModel} from '../nodes/TableNode';

export default class KeyboardAction extends Action {
    constructor(key, handler) {
        super({
            type: InputType.KEY_DOWN,
            fire: ({ event })=>{
                if(this.matchesInput(event)) {
                    handler();
                }
            }
        });
        this.key = key;
    }
    
    matchesInput = (event) => {
        return event.ctrlKey == this.key.ctrlKey && event.code == this.key.code;
    }

    handleAction = (event) => {
        if(event.ctrlKey && event.code == 'KeyN') {
            event.preventDefault();
            this.engine.fireEvent(null, 'addNewNode')
        } else if(event.ctrlKey && event.code == 'KeyD') {
            event.preventDefault();
            this.engine.fireEvent(null, 'cloneNode')
        } else if(event.ctrlKey && event.code == 'KeyR') {
            event.preventDefault();
            this.engine.fireEvent(null, 'autoDistribute')
        }
    }
}