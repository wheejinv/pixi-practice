import d from '/src/Example.js';

console.warn( "d : ", d );

var app = new PIXI.Application(1000, 500, {
    backgroundColor: 0xcccccc
});
document.body.appendChild(app.view);


let stage = app.stage;
window.app = app;
window.stage = stage;

PIXI.loader.add( _ASSET_PATH_+ "/font/jackpotwheel_count.fnt");
PIXI.loader.add( _ASSET_PATH_+ "/font/jackpotwheel_result.fnt");
PIXI.loader.add( _ASSET_PATH_+ "/font/slot_jackpot_popup_amount.fnt");

PIXI.loader.load(setup);


function setup() {
    let _color = 0xffffff;
    let bmFontResultFontName = 'jackpotwheel_result';
    let bmFontJackpotFontName = 'jackpotwheel_count';
    let bmJackpotPopupFontName = 'slot_jackpot_popup_amount';

    let _size = 30;

    let bmFontResult = new PIXI.extras.BitmapText("", { font: _size + "px " + bmFontResultFontName, tint: _color, align: 'center' });
    let bmFontJackpot = new PIXI.extras.BitmapText("", { font: _size + "px " + bmFontJackpotFontName, tint: _color, align: 'center' });
    let bmJackpotPopupFont = new PIXI.extras.BitmapText("", { font: 125 + "px " + bmJackpotPopupFontName, tint: _color, align: 'center' });

    bmFontResult.x = 100;
    bmFontResult.y = 100;
    bmFontResult.text = "$16,200,000,000";

    window.ss = bmFontResult;

    bmFontJackpot.x = 100;
    bmFontJackpot.y = 0;
    bmFontJackpot.text = "$123,426,789,123";

    bmJackpotPopupFont.x = 100;
    bmJackpotPopupFont.y = 300;
    bmJackpotPopupFont.text = "$123,426,789,123";

    stage.addChild( bmFontResult );
    stage.addChild( bmFontJackpot );
    stage.addChild( bmJackpotPopupFont );


    let text = new PIXI.Text("1231231", {
        font: "22px 'Futura'",
        padding: 10,
        lineHeight: 26,
        lineWidth: 99
    } );

    window.text = text;

    text.x = 0;
    stage.addChild( text );
}





