class Game {
    constructor() {
        this.app = new PIXI.Application(800, 600, {
            backgroundColor: 0xcccccc
        });
        document.body.appendChild(this.app.view);

        this.stage = this.app.stage;

        PIXI.loader.add(_ASSET_PATH_ + "btn_close_up.png");
        PIXI.loader.load(this.init.bind(this));
    }

    init() {

        this.container = new PIXI.Container();
        this.stage.addChild( this.container );

        // 32 x 32
        this.aa = new PIXI.Sprite(PIXI.loader.resources[_ASSET_PATH_ + "btn_close_up.png"].texture);
        this.aa.anchor.x = 0.5;
        this.aa.anchor.y = 0.5;

        this.aa.x = 100;
        this.aa.y = 100;

        this.container.addChild( this.aa );

        this.container.interactive = true;

        this.g = new PIXI.Graphics();
        this.g.beginFill(0x0a0a0a0);
        this.g.drawRect(0, 0, 800, 600 );
        this.g.endFill();
        this.g.interactive = true;
        this.g.alpha = 0.3;
        this.container.addChild( this.g );

        this.container.on( 'mousedown', this.onTouchStart.bind( this ) );

        this.container.on( 'mousemove', this.onTouchMove.bind( this ) );

        this.container.on( 'mouseup', this.onTouchEnd.bind( this ) );

        // this.container.on( 'mouseupoutside', () => {
        //     console.warn('mouseupoutside');
        // })
        //
        // this.container.on( 'mouseout', () => {
        //     console.warn('mouseout');
        // })

        if( this._isDown === false && Math.abs( this.vx ) > 0.3 ) {

            // console.warn( this.vx );

            this.aa.x += this.vx;
            this.vx *= 0.94;

            this.boundCheck();
        }

        this.app.ticker.add( this.onUpdate.bind( this ) );
    }

    onTouchStart( e ) {
        this._isDown = true;

        this.vx = 0;

        this._prevTime = Date.now();

        this.prevMouseX = e.data.getLocalPosition( this.container ).x;
    }

    onTouchMove( e ) {
        if( !this._isDown ) {
            return;
        }

        let currentMouseX = e.data.getLocalPosition( this.container ).x;

        this.vx = currentMouseX - this.prevMouseX;

        this.elapsed = Date.now() - this._prevTime;

        this.aa.x += this.vx;

        this._prevTime = Date.now();
        this.prevMouseX = currentMouseX;
    }

    onTouchEnd( e ) {
        this._isDown = false;

        let max = 20;

        if( this.elapsed > 0 ) {
            this.vx = this.vx / this.elapsed * 10;

            if( this.vx > max ) {
                this.vx = max;
            }
        }
    }

    onUpdate( dt ) {
        if( this._isDown === false && Math.abs( this.vx ) > 0.3 ) {

            // console.warn( this.vx );

            this.aa.x += this.vx;
            this.vx *= 0.8;
        }

        this.boundCheck();
    }

    boundCheck() {


        if( this.aa.x < 30 ) {

            this.vx *= 0.5;


            let nextPosition = 30;
            if( Math.abs(this.aa.x - 30) > 0.3 ) {
                nextPosition = this.aa.x + 0.15 * ( 30 - this.aa.x );
            }

            this.aa.x = nextPosition;


            // this.rollbackTween = TweenMax.to( this.aa, 0.2, {
            //     x   : 30,
            //     ease: Power2.easeOut,
            //     onStart: () => {
            //         console.warn( "bound tween" );
            //         // this._isBoundTween = true;
            //     },
            //     onComplete: ()=> {
            //         // this._isBoundTween = false;
            //     }
            // });
        }

        if( this.aa.x > 770 ) {

            this.vx *= 0.5;

            this.rollbackTween = TweenMax.to( this.aa, 0.2, {
                x   : 770,
                ease: Power2.easeOut,
                onStart: () => {
                    this._isRollbackTweenRunning = true;
                    // console.warn( "bound tween" );
                }
            });
        }
    }

    getLocalPoint(e ) {
        return e.data.getLocalPosition( this.container );
    }
}

export default Game;