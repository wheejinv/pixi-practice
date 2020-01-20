import ExtendParent from "./ExtendParent.js";

const innerConst = {
	name: "innerConst Child",
};

export default class ExtendChild extends ExtendParent {
	static showName() {
		console.warn(innerConst.name);
	}
}
