import CEventHandlerList from "./CEventHandlerList.js";

export default class Scrolling extends PIXI.Container {
    constructor( x, y, w, h, params ) {
        super();

        params = params || {};

        this._x = this.x = x;
        this._y = this.y = y;
        this._w = w;
        this._h = h;

        this.maskGraphics = new PIXI.Graphics();
        this.maskGraphics.beginFill("0x000000");
        this.maskGraphics.drawRect(0, 0, w, h);
        this.maskGraphics.endFill();
        this.maskGraphics.alpha = 0.2;
        this.maskGraphics.interactive = true;

        this.addChild(this.maskGraphics);

        this.dragging = false;
        this.pressedDown = false;
        this.timestamp = 0;
        this.callbackID = 0;

        this.targetX = 0;
        this.targetY = 0;

        this.autoScrollX = false;
        this.autoScrollY = false;

        this.inputX = 0;
        this.inputY = 0;

        this.startX = 0;
        this.startY = 0;

        this.velocityX = 0;
        this.velocityY = 0;

        this.amplitudeX = 0;
        this.amplitudeY = 0;

        this.directionWheel = 0;

        this.velocityWheelX = 0;
        this.velocityWheelY = 0;

        this.settings = {
            kineticMovement: true,
            timeConstantScroll: 325, //really mimic iOS
            horizontalScroll: true,
            verticalScroll: true,
            horizontalWheel: false,
            verticalWheel: true,
            deltaWheel: 40,
            clickXThreshold: 5,
            clickYThreshold: 5,
        };

        this.configure(params);

        this.eventHandler = new CEventHandlerList();

        this._parent = this.parent || params.stage;

        this.addChild( this.maskGraphics );
        this.maskGraphics.x = this._parent.x + this._x;
        this.maskGraphics.y = this._parent.y + this._y;

        this.mask = this.maskGraphics;
        
        this.innerContainer = new PIXI.Container();
        this.addChild( this.innerContainer );
    }


    configure(options) {
        if (options) {
            for (var property in options) {
                if (this.settings.hasOwnProperty(property) && this.settings[property] != null) {
                    this.settings[property] = options[property];
                }
            }
        }
    }
    
    getInnerContainer() {
        return this.innerContainer;
    }

    start() {

        this._beginBind = this.beginMove.bind(this);
        this._moveBind = this.moveCanvas.bind(this);
        this._endBind = this.endMove.bind(this);

        PIXI.ticker.shared.add( this.update, this );

        if (PIXI.utils.isMobile.any == true) {
            this.eventHandler.on(this.maskGraphics, 'touchstart', this._beginBind);
            this.eventHandler.on(this.maskGraphics, 'touchmove', this._moveBind);
            this.eventHandler.on(this.maskGraphics, 'touchend', this._endBind);
            this.eventHandler.on(this.maskGraphics, 'touchendoutside', this._endBind);
            this.eventHandler.on(this.maskGraphics, 'touchcancel', this._endBind);
        }
        else {
            this.eventHandler.on(this.maskGraphics, 'mousedown', this._beginBind);
            this.eventHandler.on(this.maskGraphics, 'mousemove', this._moveBind);
            this.eventHandler.on(this.maskGraphics, 'mouseup', this._endBind);
            this.eventHandler.on(this.maskGraphics, 'mouseupoutside', this._endBind);
            this.eventHandler.on(this.maskGraphics, 'mouseout', this._endBind);
        }
    }

    beginMove( event ) {
        if (this.allowScrollStopOnTouch && this.scrollTween) {
            this.scrollTween.pause();
        }

        if (this.maskGraphics.getBounds().contains(event.data.global.x, event.data.global.y)) {
            this.startedInside = true;

            this.startX = this.inputX = event.data.global.x;
            this.startY = this.inputY = event.data.global.y;
            this.pressedDown = true;
            this.timestamp = Date.now();
            this.velocityY = this.amplitudeY = this.velocityX = this.amplitudeX = 0;
        }
        else {
            this.startedInside = false;
        }
    }

    /**
     * Event triggered when the activePointer receives a DOM move event such as a mousemove or touchmove.
     * The camera moves according to the movement of the pointer, calculating the velocity.
     */
    moveCanvas( event ) {
        if (!this.pressedDown) return;

        let x = event.data.global.x;
        let y = event.data.global.y;
        let delta;

        this.now = Date.now();
        let elapsed = this.now - this.timestamp;
        this.timestamp = this.now;

        if (this.settings.horizontalScroll) {
            delta = x - this.startX; //Compute move distance
            if (delta !== 0) this.dragging = true;
            this.startX = x;
            this.velocityX = 0.8 * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityX;
            this.innerContainer.x += delta;
        }

        if (this.settings.verticalScroll) {
            delta = y - this.startY; //Compute move distance
            if (delta !== 0) this.dragging = true;
            this.startY = y;
            this.velocityY = 0.8 * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityY;
            this.innerContainer.y += delta;
        }

        this.limitMovement();
    }

    endMove( event ) {
        if (this.startedInside) {
            this.pressedDown = false;
            this.autoScrollX = false;
            this.autoScrollY = false;

            if (!this.settings.kineticMovement) return;

            this.now = Date.now();

            let isHit = this.maskGraphics.containsPoint( event.data.global );

            if( isHit ) {
                if (this.velocityX > 10 || this.velocityX < -10) {
                    this.amplitudeX = 0.8 * this.velocityX;
                    this.targetX = Math.round(this.x + this.amplitudeX);
                    this.autoScrollX = true;
                }

                if (this.velocityY > 10 || this.velocityY < -10) {
                    this.amplitudeY = 0.8 * this.velocityY;
                    this.targetY = Math.round(this.y + this.amplitudeY);
                    this.autoScrollY = true;
                }
            }
            if (!isHit) {
                this.velocityWheelXAbs = Math.abs(this.velocityWheelX);
                this.velocityWheelYAbs = Math.abs(this.velocityWheelY);
                if (this.settings.horizontalScroll && (this.velocityWheelXAbs < 0.1 || !isHit)) {
                    this.autoScrollX = true;
                }
                if (this.settings.verticalScroll && (this.velocityWheelYAbs < 0.1 || !isHit)) {
                    this.autoScrollY = true;
                }
            }

            // if (Math.abs(event.data.global.x-this.inputX) <= this.settings.clickXThreshold && Math.abs(event.data.global.y-this.inputY) <= this.settings.clickYThreshold) {
            //     for (var i=0;i<this.children.length;i++) {
            //         if (this.getChildAt(i).getBounds().contains(event.data.global.x, event.data.global.y) && this.getChildAt(i).inputEnabled && this.getChildAt(i).events.onInputUp.getNumListeners() > 0) {
            //             this.getChildAt(i).events.onInputUp.dispatch();
            //         }
            //     }
            // }
        }
    }

    scrollTo(x, y, time, easing, allowScrollStopOnTouch) {
        if (this.scrollTween) {
            this.scrollTween.pause();
        }

        x = (x > 0) ? -x : x;
        y = (y > 0) ? -y : y;
        time = time || 1000;
        allowScrollStopOnTouch = allowScrollStopOnTouch || false;

        this.allowScrollStopOnTouch = allowScrollStopOnTouch;

        this.scrollTween = TweenMax.to( this, time, {
            x: x,
            y: y,
            ease: Power2.easeOut
        });
    }

    update() {
        this.elapsed = Date.now() - this.timestamp;
        this.velocityWheelXAbs = Math.abs(this.velocityWheelX);
        this.velocityWheelYAbs = Math.abs(this.velocityWheelY);

        if (this.autoScrollX && this.amplitudeX != 0) {
            var delta = -this.amplitudeX * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (delta > 0.5 || delta < -0.5) {
                this.x = this.targetX + delta;
            }
            else {
                this.autoScrollX = false;
                //this.x = -this.targetX;
            }
        }

        if (this.autoScrollY && this.amplitudeY != 0) {

            var delta = -this.amplitudeY * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
            if (delta > 0.5 || delta < -0.5) {
                this.y = this.targetY + delta;
            }
            else {
                this.autoScrollY = false;
                //this.y = -this.targetY;
            }
        }

        if(!this.autoScrollX && !this.autoScrollY){
            this.dragging = false;
        }

        if (this.settings.horizontalWheel  && this.velocityWheelXAbs > 0.1) {
            this.dragging = true;
            this.amplitudeX = 0;
            this.autoScrollX = false;
            this.innerContainer.x += this.velocityWheelX;
            this.velocityWheelX *= 0.95;
        }

        if (this.settings.verticalWheel && this.velocityWheelYAbs > 0.1) {
            this.dragging = true;
            this.autoScrollY = false;
            this.innerContainer.y += this.velocityWheelY;
            this.velocityWheelY *= 0.95;
        }

        this.limitMovement();
    }

    stop() {

    }

    setPosition(position) {
        if (position.x) {
            this.innerContainer += position.x - this._x;
            this.maskGraphics.x = this._x = position.x;
        }
        if (position.y) {
            this.innerContainer.y += position.y - this._y;
            this.maskGraphics.y = this._y = position.y;
        }
    }

    limitMovement() {
        if (this.settings.horizontalScroll) {
            if (this.x > this._x)
                this.x = this._x;
            if (this.x < -(this.width-this._w-this._x)) {
                if (this.width > this._w) {
                    this.x = -(this.width-this._w-this._x);
                }
                else {
                    this.x = this._x;
                }
            }
        }

        if (this.settings.verticalScroll) {
            if (this.y > this._y)
                this.y = this._y;
            if (this.y < -(this.height-this._h-this._y)) {
                if (this.height > this._h) {
                    this.y = -(this.height-this._h-this._y);
                }
                else {
                    this.y = this._y;
                }
            }
        }
    }

}

