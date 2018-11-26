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
PIXI.loader.add( _ASSET_PATH_+ "/font/welcomeback_count.fnt");
PIXI.loader.add( _ASSET_PATH_+ "/font/balance_num_test.fnt");
PIXI.loader.add( _ASSET_PATH_+ "/font/balance_num.fnt");
PIXI.loader.add( _ASSET_PATH_+ "/font/balance_num_hlr.fnt");
PIXI.loader.add( _ASSET_PATH_+ "/font/firstpurchase_count.fnt");

PIXI.loader.load(setup);


function setup() {
    let _color = 0xffffff;
    let bmFontResultFontName = 'jackpotwheel_result';
    let bmFontJackpotFontName = 'jackpotwheel_count';
    let bmJackpotPopupFontName = 'slot_jackpot_popup_amount';
    let welcomebackFontName = 'welcomeback_count';
    let balanceFontNameTest = 'balance_num_test';
    let balanceFontName = 'balance_num';
    let balanceFontHlrName = 'balance_num_hlr';
    let firstPurchaseFontName = 'firstpurchase_count';

    let _size = 30;

    let bmFontResult = new PIXI.extras.BitmapText("", { font: _size + "px " + bmFontResultFontName, tint: _color, align: 'center' });
    let bmFontJackpot = new PIXI.extras.BitmapText("", { font: _size + "px " + bmFontJackpotFontName, tint: _color, align: 'center' });
    let bmJackpotPopupFont = new PIXI.extras.BitmapText("", { font: 125 + "px " + bmJackpotPopupFontName, tint: _color, align: 'center' });
    let balanceBMFontTest = new PIXI.extras.BitmapText("", { font: 36 + "px " + balanceFontNameTest, tint: _color, align: 'center' });
    let balanceBMFont = new PIXI.extras.BitmapText("", { font: 36 + "px " + balanceFontName, tint: _color, align: 'center' });
    let balanceBMFontHlr = new PIXI.extras.BitmapText("", { font: 32 + "px " + balanceFontHlrName, tint: _color, align: 'center' });
    let firstPurchaseBmFont = new PIXI.extras.BitmapText("", { font: 32 + "px " + firstPurchaseFontName, tint: _color, align: 'center' });


    let welcomebackFont = new PIXI.extras.BitmapText("100,100", { font: 125 + "px " + welcomebackFontName, tint: _color, align: 'center' });
    stage.addChild( welcomebackFont );
    welcomebackFont.x = 200;
    welcomebackFont.y = 200;
    window.asd = welcomebackFontName;

    bmFontResult.x = 100;
    bmFontResult.y = 100;
    bmFontResult.text = "$16,200,000,000";

    window.ss = balanceBMFontTest;
    stage.addChild( balanceBMFontTest );
    balanceBMFontTest.x = 100;
    balanceBMFontTest.y = 250;

    let _balanceText = "208,123,456,789";

    balanceBMFontTest.text = _balanceText;

    // window.ss = balanceBMFontTest;
    stage.addChild( balanceBMFont );
    balanceBMFont.x = 100;
    balanceBMFont.y = 220;
    balanceBMFont.text = _balanceText;

    stage.addChild( balanceBMFontHlr );
    balanceBMFontHlr.x = 100;
    balanceBMFontHlr.y = 190;
    balanceBMFontHlr.text = _balanceText;

    bmFontJackpot.x = 100;
    bmFontJackpot.y = 0;
    bmFontJackpot.text = "$123,426,789,123";

    bmJackpotPopupFont.x = 100;
    bmJackpotPopupFont.y = 300;
    bmJackpotPopupFont.text = "$123,426,789,123";

    stage.addChild( bmFontResult );
    stage.addChild( bmFontJackpot );
    stage.addChild( bmJackpotPopupFont );

	stage.addChild( firstPurchaseBmFont );
	window.aaa = firstPurchaseBmFont;
	firstPurchaseBmFont.x = 100;
	firstPurchaseBmFont.y = 100;
	firstPurchaseBmFont.text = "208,123,456,789";

    let getBMFontInfo = function( bmFont ) {

        var data = PIXI.BitmapText.fonts[bmFont._font.name];

        console.dir( data );

        var scale = bmFont._font.size / data.size;
        var chars = [];
        var lineWidths = [];
        var pos = new PIXI.Point();
        var prevCharCode = null;
        var lastLineWidth = 0;
        var maxLineWidth = 0;
        var line = 0;
        var lastSpace = -1;
        var lastSpaceWidth = 0;
        var spacesRemoved = 0;
        var maxLineHeight = 0;


        for (var i = 0; i < bmFont.text.length; i++) {
            var charCode = bmFont.text.charCodeAt(i);

            if (/(\s)/.test(bmFont.text.charAt(i))) {
                lastSpace = i;
                lastSpaceWidth = lastLineWidth;
            }

            if (/(?:\r\n|\r|\n)/.test(bmFont.text.charAt(i))) {
                lineWidths.push(lastLineWidth);
                maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
                line++;

                pos.x = 0;
                pos.y += data.lineHeight;
                prevCharCode = null;
                continue;
            }

            if (lastSpace !== -1 && bmFont._maxWidth > 0 && pos.x * scale > this._maxWidth) {
                PIXI.utils.removeItems(chars, lastSpace - spacesRemoved, i - lastSpace);
                i = lastSpace;
                lastSpace = -1;
                ++spacesRemoved;

                lineWidths.push(lastSpaceWidth);
                maxLineWidth = Math.max(maxLineWidth, lastSpaceWidth);
                line++;

                pos.x = 0;
                pos.y += data.lineHeight;
                prevCharCode = null;
                continue;
            }

            var charData = data.chars[charCode];

            if (!charData) {
                continue;
            }

            if (prevCharCode && charData.kerning[prevCharCode]) {
                pos.x += charData.kerning[prevCharCode];
            }

            chars.push({
                texture: charData.texture,
                line: line,
                charCode: charCode,
                position: new PIXI.Point(pos.x + charData.xOffset, pos.y + charData.yOffset)
            });
            lastLineWidth = pos.x + (charData.texture.width + charData.xOffset);
            pos.x += charData.xAdvance;
            maxLineHeight = Math.max(maxLineHeight, charData.yOffset + charData.texture.height);
            prevCharCode = charCode;
        }

        lineWidths.push(lastLineWidth);
        maxLineWidth = Math.max(maxLineWidth, lastLineWidth);

        return {
            height      : maxLineHeight,
            lineWidths  : lineWidths,
            maxLineWidth: maxLineWidth
        };
    };

    getBMFontInfo( bmJackpotPopupFont );

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





