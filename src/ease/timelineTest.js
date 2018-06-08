var app = new PIXI.Application(1000, 500, {
    backgroundColor: 0x000000
});
document.body.appendChild(app.view);

let stage = app.stage;
window.app = app;
window.stage = stage;

PIXI.loader.add( _ASSET_PATH_+ "wheel_pan.png")
    .load(setup);

let DEG_TO_RAD = Math.PI / 180;

function setup() {
    let wheelObj = new PIXI.Sprite( PIXI.loader.resources[ _ASSET_PATH_ + "wheel_pan.png"].texture );
    stage.addChild( wheelObj );

    window.wheel = wheelObj;

    // wheel.scale.x = 0.7;
    // wheel.scale.y = 0.7;
    wheelObj.anchor.x = 0.5;
    wheelObj.anchor.y = 0.5;
    wheelObj.x = app.renderer.width / 2;
    wheelObj.y = app.renderer.height;

    CustomEase.create( 'aaa', ".44,.08,.92,.49");
    CustomEase.create( 'bbb', ".06,.62,.1,.94");


    const rotationStep1 = -14.5;
    const rotationDiff = 3;

    const tarRotation = 4 * 360 + 180;

    let tl = new TimelineMax();

    let start = new TweenMax.to(wheelObj, 1.5, {
        pixi: {
            rotation: ( wheelObj.rotation % 360 ) + rotationStep1
        }

    });

    tl.add( start );

    let ing2 = TweenMax.to(wheelObj, 22, {
        ease: CustomEase.create("custom", "M0,0 C0.128,0.092 0.225,0.159 0.292,0.292 0.346,0.4 0.384,0.716 0.468,0.808 0.558,0.906 0.722,0.98 1,1"),
        pixi: {
            rotation: tarRotation - rotationDiff
        }
    });

    tl.add( ing2 );

    let end = new TweenMax(wheelObj, 1.2, {
        ease: CustomEase.create("custom", "M0,0 C0,0 0.224,0.7 0.4,0.7 0.59,0.7 0.48,0.3 0.6,0.3 0.625,0.3 0.676,0.57 0.75,0.57 0.828,0.57 0.81,0.442 0.898,0.442 0.993,0.442 1,0.512 1,0.5"),
        pixi: {
            rotation: tarRotation + rotationDiff
        }
    });

    tl.add( end );



}






