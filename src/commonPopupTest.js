var app = new PIXI.Application(1000, 500, {
    backgroundColor: 0xcccccc
});
document.body.appendChild(app.view);


let stage = app.stage;
window.app = app;
window.stage = stage;

let popupBgUrl = "popup_bg";

PIXI.loader.add(_ASSET_PATH_ + "btn_close_up.png");
PIXI.loader.add(_ASSET_PATH_ + "popup_bg.png");


// PIXI.loader.add( _ASSET_PATH_+ "/font/jackpotwheel_result.png");

PIXI.loader.load(setup);


function setup() {

    let popupBg = new PIXI.Sprite(PIXI.loader.resources[_ASSET_PATH_ + "popup_bg.png"].texture);

    let scale = getScale(popupBg);

    window.bg = popupBg;

    popupBg.scale.x = scale;
    popupBg.scale.y = scale;

    popupBg.anchor.x = 0.5;
    popupBg.anchor.y = 0.5;
    popupBg.x = app.renderer.width / 2;
    popupBg.y = app.renderer.height / 2;

    stage.addChild(popupBg);


    let btn = new PIXI.Sprite(PIXI.loader.resources[_ASSET_PATH_ + "btn_close_up.png"].texture);
    btn.x = popupBg.x + popupBg.width / 2 - btn.width;

    stage.addChild(btn);


    let shopBtn = new PIXI.Sprite(PIXI.loader.resources[_ASSET_PATH_ + "btn_close_up.png"].texture);

    shopBtn.anchor.x = 0.5;
    shopBtn.anchor.y = 0.5;

    shopBtn.x = popupBg.x;
    shopBtn.y = popupBg.y + 100;

    stage.addChild(shopBtn);


    btn.interactive = true;
    btn.buttonMode = true;

    shopBtn.interactive = true;
    shopBtn.buttonMode = true;

    btn.on("click", () => {
        console.warn("exit btn down");
    });

    shopBtn.on("click", () => {
        console.warn("shopBtn btn down");
    });


}

function getScale(popupBg) {

    let app = window.app;

    let width = app.renderer.width;
    let height = app.renderer.height;

    let widthScale = width / popupBg.width;
    let heightScale = height / popupBg.height;

    if (widthScale < 1 || heightScale < 1) {

        return widthScale < heightScale ? widthScale : heightScale;

    } else {
        return 1;
    }
}





