import Scrolling from './scroll/Scrolling.js'
import CEventHandlerList from './scroll/CEventHandlerList.js'

class Game {
    constructor() {
        this.app = new PIXI.Application(800, 600, {
            backgroundColor: 0xcccccc
        });
        document.body.appendChild(this.app.view);

        this.stage = this.app.stage;

        window.aaa = this;

        let text = new PIXI.Text("Hello, It`s me. current Jackpot User is undefined", {
            font: "22px 'Futura'",
            padding: 10,
            lineHeight: 26,
            lineWidth: 99
        } );

        // test

        let getMeasure = function( obj ) {
            return PIXI.TextMetrics.measureText(obj._text, obj._style, obj._style.wordWrap, obj.canvas);
        };

        let txtStyle = text.style;
        txtStyle.wordWrap = true;
        txtStyle.wordWrapWidth = 263;

        this.stage.addChild( text );
        text.x = 500;
        text.y = 200;

        text.anchor.x = 0.5;
        text.anchor.y = 0.5;

        let dd = new PIXI.Text("another", {
            font: "22px 'Futura'",
            padding: 10,
            lineHeight: 26,
            lineWidth: 99
        } );
        this.stage.addChild( dd );
        dd.x = 150;
        dd.y = 200;
        dd.anchor.x = 0;
        dd.anchor.y = 0.5;

        window.eee = dd;

        let mText = getMeasure( text );
        let mDd = getMeasure( dd );

        console.dir( mText );
        console.dir( mDd );
        dd.x = text.x - mText.width / 2 - mDd.width - 10;



        // this.layer = new PIXI.Container();
        // this.stage.addChild( this.layer );
        //
        // this.mask = new PIXI.Graphics();
        // this.mask.beginFill("0x000000");
        // this.mask.drawRect(0, 0, 400,300);
        // this.mask.endFill();
        // this.mask.alpha = 0.5;
        // this.mask.interactive = true;
        // this.layer.addChild(this.mask);
        //
        // this.layer.mask = this.mask;
        //
        // this.eventHandler = new CEventHandlerList();
        //
        //
        //
        //
        // this.innerLayer = new PIXI.Container();
        // this.layer.addChild( this.innerLayer );
        //
        // let g;
        // for( let i = 0; i < 20; i++ ) {
        //     g = this.getGraphic();
        //     this.innerLayer.addChild( g );
        //     g.x = i * 100;
        // }
        //
        // this.scroll = new Scrolling( this.innerLayer, this.mask );
        // this.scroll.start( this.eventHandler );

    }

    getGraphic() {
        let g = new PIXI.Graphics();
        g.beginFill("0xa97212");
        g.drawRect(0, 0, 50,50);
        g.endFill();
        g.alpha = 0.5;

        return g;
    }
}

export default Game;
