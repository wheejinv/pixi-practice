var app = new PIXI.Application(800, 600, {
    backgroundColor: 0xcccccc
});
document.body.appendChild(app.view);

window.app = app;

let loadingStart = function() {

    window.bb= this;

    let spr = PIXI.Sprite.fromImage( "loading" );
    spr.scale.x = 0.5;
    spr.scale.y = 0.5;

    spr.anchor.x = 0.5;
    spr.anchor.y = 0.5;

    spr.x = app.renderer.width / 2;
    spr.y = app.renderer.height / 2;
    app.stage.addChild( spr );


    var basicText = new PIXI.Text('Basic text in pixi');
    basicText.anchor.x = 0.5;
    basicText.anchor.y = 0.5;

    basicText.x = 400;
    basicText.y = 500;
    basicText.style.color ="0xffffff";

    app.stage.addChild(basicText);


    let loader = new PIXI.loaders.Loader();
    loader.add( _ASSET_PATH_ + "22.mov");

    loader.onProgress.add( ( ss, resource ) => {
        console.warn("asad");
        basicText.text = ss.progress + " % ...";
    });

    // loader.load( () => {
    //     console.warn("download complete");
    // });



};

(function(){

    let loader = PIXI.loader;

    loader.add( "loading", _ASSET_PATH_ + "loading_logo.png" );

    loader.load( () => {
        loadingStart();
    })



}).bind(window)();


// 안전 버전
// setInterval( () => {
//     let loader = PIXI.loader;
//     if( loader.resources.hasOwnProperty( "1" ) === false ) {
//         loader.add( "1", _ASSET_PATH_+ "/font/jackpotwheel_count.fnt");
//     }
//
//     if( loader.resources.hasOwnProperty( "2" ) === false ) {
//         loader.add( "2", _ASSET_PATH_+ "/font/jackpotwheel_result.fnt");
//     }
//
//     if( loader.resources.hasOwnProperty( "3" ) === false ) {
//         loader.add( "3", _ASSET_PATH_+ "/font/slot_jackpot_popup_amount.fnt");
//     }
//
//     loader.load( () => {
//         // loader.destroy();
//
//         console.warn("load complete");
//     });
// }, 200 );

// setInterval( () => {
//     let loader = new PIXI.loaders.Loader();
//     loader.add("1", _ASSET_PATH_ + "/font/jackpotwheel_count.fnt");
//     loader.add("2", _ASSET_PATH_ + "/font/jackpotwheel_result.fnt");
//     loader.add("3", _ASSET_PATH_ + "/font/slot_jackpot_popup_amount.fnt");
//
//     loader.load(() => {
//         loader.reset();
//
//         console.warn("load complete");
//     });
// }, 200);



