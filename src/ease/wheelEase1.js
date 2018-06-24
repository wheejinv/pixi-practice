var app = new PIXI.Application(1000, 500, {
    backgroundColor: 0x000000
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

PIXI.loader.add( _ASSET_PATH_+ "wheel_pan.png")
    .load(setup);

let DEG_TO_RAD = Math.PI / 180;

function setup() {
    let wheel = new PIXI.Sprite( PIXI.loader.resources[ _ASSET_PATH_ + "wheel_pan.png"].texture );
    stage.addChild( wheel );

    window.wheel = wheel;

    wheel.on("pointerdown", () => {
        console.warn("asd");
    });

    // wheel.scale.x = 0.7;
    // wheel.scale.y = 0.7;
    wheel.anchor.x = 0.5;
    wheel.anchor.y = 0.5;
    wheel.x = app.renderer.width / 2;
    wheel.y = app.renderer.height;

    let ease = new easeTest( wheel );

    window.ease = ease;


}

let tarRotation1 = 500 * DEG_TO_RAD;
let tarRotation2 = 2500 * DEG_TO_RAD;

class easeTest
{
    constructor( target ) {
        this.target = target;

        this.BASE_WHEEL_COUNT = 8;

        this.TARGET_ROTATION = this.BASE_WHEEL_COUNT * 360;

        this.START_INFO = {
            y: this.target.y,
            height: this.target.height
        };

        this.tl = null;
        this.tl2 = null;
    }

    _setDefault() {
        this.target.rotation = 0;
    }

    testEase() {
        let tl = new TimelineMax();
        let tr1 = new TweenMax.to( this.target, 0.3, {
            delay: 0.5,
            rotation: tarRotation1,
            startAt: {
                rotation: 0
            },
        } );
        let tr3 = new TweenMax.to( this.target, 8, {
            delay: 0.1,
            rotation: tarRotation2,
            scaleX: 10,
            // ease: CustomEase.create("custom", "M0,0 C0.053,0.105 0.03,0.378 0.25,0.426 0.359,0.449 0.526,0.751 0.622,0.798 0.769,0.87 0.854,1 1,1"),
        } );


        tl.add( tr1 )
            .add(tr3);
    }

    _setTweenType1() {

        CustomEase.create("_JWB_start", ".62,-0.54,.87,.59");
        CustomEase.create("_JWB_ing", ".09,.47,.36,.81");

        const START_ROTATION = 40;
        const BASE_WHEEL_COUNT = 8;
        const TARGET_ROTATION = BASE_WHEEL_COUNT * 360;

        const DURATION = 8;

        // TweenLite.to(graph, 1, { ease: Elastic.easeOut.config(1.5, 0.5), y: -500 });

        this.tl = new TimelineMax();
        this.tl2 = new TimelineMax();

        let start = new TweenMax.to(this.target, 0.4, {
            ease: "_JWB_start",
            pixi: {
                rotation: START_ROTATION,
            },
            startAt: {
                rotation: 0
            }
        });

        let ing = new TweenMax.to(this.target, DURATION, {
            ease: "_JWB_ing",
            pixi: {
                rotation: TARGET_ROTATION - 5,
            }
        });

        let end = new TweenMax(this.target, 0.6, {
            ease: CustomEase.create("custom", "M0,0 C0,0 0.224,0.7 0.4,0.7 0.59,0.7 0.48,0.3 0.6,0.3 0.625,0.3 0.676,0.57 0.75,0.57 0.828,0.57 0.81,0.442 0.898,0.442 0.993,0.442 1,0.512 1,0.512"),
            pixi: {
                rotation: TARGET_ROTATION + 5
            }
        });

        this.tl.add( start );
        this.tl.add( ing );
        this.tl.add( end );
        this.tl.addCallback(()=>{
            // this.tl2.add( new TweenMax.to( this.target, 0.5, {
            //     pixi: {
            //         y: this.START_INFO.y,
            //         scaleX: 1,
            //         scaleY: 1
            //     },
            //     delay: 1
            // }));
        });
        // this.tl.totalDuration( 10 );

        this.tl.pause();

        const TARGET_SCALE = 1.4;
        //
        // this.tl2.add( new TweenMax.to( this.target, 6, {
        //     pixi: {
        //         y: this.START_INFO.y + 170,
        //         scaleX: TARGET_SCALE,
        //         scaleY: TARGET_SCALE
        //     },
        //     delay: 1.5
        // }));

        this.tl2.pause();
    }

    _setTweenType2() {

        CustomEase.create("_JWB_start", ".86,-0.57,.87,.59");
        CustomEase.create("_JWB_ing", ".09,.47,.07,.96");

        const START_ROTATION = 40;
        const BASE_WHEEL_COUNT = 8;
        const TARGET_ROTATION = BASE_WHEEL_COUNT * 360;

        const DURATION = 8;

        // TweenLite.to(graph, 1, { ease: Elastic.easeOut.config(1.5, 0.5), y: -500 });

        this.tl = new TimelineMax();
        this.tl2 = new TimelineMax();

        let start = new TweenMax.to(this.target, 0.4, {
            ease: "_JWB_start",
            pixi: {
                rotation: START_ROTATION,
            },
            startAt: {
                rotation: 0
            }
        });

        let ing = new TweenMax.to(this.target, DURATION, {
            ease: "_JWB_ing",
            pixi: {
                rotation: TARGET_ROTATION - 5,
            }
        });

        let end = new TweenMax(this.target, 0.4, {
            ease: Bounce.easeOut,
            pixi: {
                rotation: TARGET_ROTATION
            }
        });

        this.tl.add( start );
        this.tl.add( ing );
        this.tl.add( end );



    }


    play( type, time ) {

        switch ( type ) {
            case 1:
                this._setTweenType1();
                break;

            case 2:
                this._setTweenType2();
                break;

            default:
                this._setTweenType1();
                break;

        }


        this.tl.restart();

        if (time ) {
            this.tl.totalDuration( time );
        }

        if( this.tl2 ) {
            this.tl2.restart();

            if (time ) {
                this.tl2.totalDuration( time );
            }
        }
    }

    // _getStartTween() {
    //     let _duration = 0.5;
    //     let
    // }

    kill() {
        TweenMax.killAll(false, true, true, true);
    }


}






