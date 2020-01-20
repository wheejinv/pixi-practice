const innerConst = {
	name: "innerConst Parent"
};

export default class ExtendParent {
	static showName() {
		console.warn(innerConst.name);
	}
}
