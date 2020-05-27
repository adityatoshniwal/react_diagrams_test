import { DefaultPortModel } from '@projectstorm/react-diagrams';
import {OneToManyLinkModel} from '../links/OneToManyLink';

export default class OneToManyPortModel extends DefaultPortModel {
	createLinkModel() {
		return new OneToManyLinkModel();
	}
}