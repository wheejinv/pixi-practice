let DEG_TO_RAD = Math.PI / 180;
let RAD_TO_DEG = 180 / Math.PI;

const CONST = {
	PIN_DISTANCE: 100,
	SECTOR_COUNT: 12,
	SECTOR_DEGREE: 30,
	HOOK_DISTANCE: 256, // 원 중앙에서 휠의 징박힌 위치까지의 거리
	HIT_RANGE: 30,
	pinStartV: 300,
	pinStartA: 500,
}

export default class PinWheel {
	constructor() {
		var app = new PIXI.Application(1024, 768, {
			backgroundColor: 0xeeeeee,
		});
		document.body.appendChild(app.view);

		app.renderer.view.className = "pixiCanvas";
		app.renderer.view.style.position = "absolute";
		// app.renderer.view.style.display = "block";
		app.renderer.view.style.top = "100px";
		// app.renderer.view.style.left = "100px";
		// app.renderer.autoResize = true;


		let stage = app.stage;
		window.app = app;
		window.stage = stage;

		PIXI.loader
			.add(_ASSET_PATH_ + "rainbow_wheel.png")
			.add(_ASSET_PATH_ + "arrow_down.png")
			.load(() => {
				// PIXI.loader.reset();
				console.warn("loader reset");

				this.init();
			});
	}

	init() {
		this.wheel = new PIXI.Sprite(PIXI.loader.resources[_ASSET_PATH_ + "rainbow_wheel.png"].texture);
		stage.addChild(this.wheel);

		this.pin = new PIXI.Sprite(PIXI.loader.resources[_ASSET_PATH_ + "arrow_down.png"].texture);
		stage.addChild(this.pin);

		this.pin.anchor.x = 0.5;

		this.pin.scale.x = 0.2;
		this.pin.scale.y = 0.2;
		this.pin.x = 300;
		this.pin.y = 15;

		const STATE = {
			NORMAL: 0
		}

		Object.defineProperty(this.pin, "state", {
			get: function () {
				if( !this._state) {
					this._state = STATE.NORMAL;
				}
				return this._state;
			},
			set: function(a) {
				this._state = a;
			}
		});

		window.wheel = this.wheel;
		window.pin = this.pin;

		this.wheel.interactive  = true;
		this.wheel.anchor.x = 0.5;
		this.wheel.anchor.y = 0.5;

		this.wheel.scale.x = 0.5;
		this.wheel.scale.y = 0.5;

		this.wheel.x = 300;
		this.wheel.y = 350;

		this.wheel.rotation = 15 * DEG_TO_RAD;

		this.pinA = this.pinV = 0;
		this.pinMinV = 40;
		this.bounce = 0;

		this.wheel.on("pointerdown", () => {
			this.wheelSpin();
		});
	}

	wheelSpin() {
		if (this.tl) {
			this.tl.kill();
			this.tl = null;
		}

		// rotation 은 radian
		this.wheel.rotation = 15 * DEG_TO_RAD;

		this.arrAnchor = [];

		for( let i = 0; i < CONST.SECTOR_COUNT; i++ ) {
			this.arrAnchor.push( i * 30)
		}

		this.tl = new TimelineMax();

		let rotationTween = new TweenMax.to(this.wheel, 7, {
			pixi: {
				rotation: 375
			},
			onUpdate: this.updateWheel.bind(this)
		})

		this.tl.add(rotationTween);

		this.hookHitMaxDegrees = [6.8, 8.5];
	}

	updateWheel() {
		let curPinPosition = this.pin.getGlobalPosition();
		curPinPosition.x += Math.cos(-this.pin.rotation - 90 * DEG_TO_RAD) * CONST.PIN_DISTANCE;
		curPinPosition.y -= Math.sin(-this.pin.rotation - 90 * DEG_TO_RAD) * CONST.PIN_DISTANCE;

		let result = this.checkCollision(curPinPosition);
		if (result) {
			let targetPos = new PIXI.Point(result.x + CONST.HIT_RANGE, result.y);
			let diffX = Math.abs(curPinPosition.x - targetPos.x);
			let diffY = Math.abs(curPinPosition.y - targetPos.y);

			let targetPinRotation = -1 * Math.atan2(diffY, diffX);
			this.pin.rotation = targetPinRotation;
			this.pinV = CONST.pinStartV;
			this.pinA = CONST.pinStartA;
			this.bounce = 0;
		} else {

		}

		// let curDegreePerSector = Math.abs(this.wheel.rotation * RAD_TO_DEG % 30);


	}

	checkCollision(pinPosition) {
		let normalizedCurWheelDegree = this.wheel.rotation * RAD_TO_DEG % 360;

		// console.warn(`normalizedCurWheelDegree: ${normalizedCurWheelDegree}`);

		for (let i = 0; i < CONST.SECTOR_COUNT; i++ ) {
			let wheelDotPos = this.wheel.getGlobalPosition();
			wheelDotPos.x -= Math.cos(DEG_TO_RAD * (CONST.SECTOR_DEGREE * i + normalizedCurWheelDegree)) * CONST.HOOK_DISTANCE;
			wheelDotPos.y += Math.sin(DEG_TO_RAD * (CONST.SECTOR_DEGREE * i + normalizedCurWheelDegree)) * CONST.HOOK_DISTANCE;

			// console.warn(i, pos.x, pos.y);
			if (this.getDistance(pinPosition, wheelDotPos) < CONST.HIT_RANGE) {
				return wheelDotPos;
			}
		}

		return null;

	}

	getDistance(pos1, pos2) {
		let diffX = pos1.x - pos2.x;
		let diffY = pos1.y - pos2.y;

		return Math.sqrt(diffX * diffX + diffY * diffY);
	}
}
