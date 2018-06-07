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
    let wheel = new PIXI.Sprite( PIXI.loader.resources[ _ASSET_PATH_ + "wheel_pan.png"].texture );
    stage.addChild( wheel );

    window.wheel = wheel;

    // wheel.scale.x = 0.7;
    // wheel.scale.y = 0.7;
    wheel.anchor.x = 0.5;
    wheel.anchor.y = 0.5;
    wheel.x = app.renderer.width / 2;
    wheel.y = app.renderer.height;

    let tl = new TimelineMax();
    let tween1 = TweenMax.to(wheel, 10, {
        pixi: {
            rotation: 360,
        },
        startAt: {
            rotation: 0
        }
    });

    tl.add( tween1 );

    for( let i = 0; i < 10; i++ ) {
        tl.addCallback( ()=> {
            console.warn( i + 1 );
        }, '' + ( i + 1))
    }


    tl.totalDuration( 50 );


}






