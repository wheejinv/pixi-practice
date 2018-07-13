class Reel extends PIXI.Sprite {
    constructor( constObj ) {
        super();

        this.CONST = constObj;

        let symbol, symbolCount = this.CONST.symbolCount;

        let centerIdxY = Math.ceil( symbolCount / 2 );
        centerIdxY = centerIdxY % 2 ? centerIdxY - 1 : centerIdxY;

        this.arrSymbol = [];
        for( let i = 0; i< symbolCount; i++ ) {
            symbol = PIXI.Sprite.fromImage( "symbol" + ( 1 + i % 4 ) );
            this.addChild(  symbol );
            symbol.anchor.x = 0.5;
            symbol.anchor.y = 0.5;
            symbol._info = {};
            symbol._info.oriIndex = i;
            symbol.x = this.CONST.symbolWidth / 2;    //
            symbol.y = this.CONST.symbolHeight * ( i - centerIdxY ) + this.CONST.symbolHeight / 2
            this.arrSymbol.push( symbol );
        }

        this.REEL_HEIGHT = this.CONST.symbolHeight * symbolCount;
        this.SPIN_COUNT = 3;

        this._viewUp = -250;
        this._viewDown = 300;
        this._curIndex = centerIdxY;
        this._upIndex = 0;
        this._downIndex = 0;

        this.init();
    }

    init() {
        // this._setSymbolVisible();


    }

    _changeSymPosition() {
        let sym, i;

        for (i = 0; i < this.arrSymbol.length; i++) {
            sym = this.arrSymbol[i];
            if ( ( this._viewUp + this.y ) > sym.y ) {
                // sym.visible = false;
            } else if (this._viewDown + this.y < sym.y) {
                sym.y -= this.REEL_HEIGHT;
                // sym.visible = false;
            }
        }

        // 오름차순
        let arrVisibleSymbol = this.arrSymbol.filter(obj => obj.visible).sort((a, b) => a - b);

        if( arrVisibleSymbol.length === 0 ) return;

        this._upIndex = arrVisibleSymbol[0]._info.oriIndex;
        this._downIndex = arrVisibleSymbol[arrVisibleSymbol.length - 1]._info.oriIndex;

        console.warn( "this._upIndex : ", this._upIndex, "this._downIndex : ", this._downIndex );
    }

    _playReel( stopDuration = 1, stopIndex ) {

        if( 0 > stopIndex || this.CONST.symbolCount - 1 < stopIndex ) {
            console.warn( "stop index error");
            return;
        }

        let moveDistanceY = this._getMoveDistance( stopIndex );

        TweenMax.to( this, stopDuration, {
            y: this.y + ( this.REEL_HEIGHT * this.SPIN_COUNT + moveDistanceY ),
            onUpdate: () => {
                for ( let i = 0; i < this.arrSymbol.length; i++) {
                    if( this._viewDown + this.y > this.arrSymbol[ i ].y) {
                        this.arrSymbol[ i ].y -= this.REEL_HEIGHT;

                    }
                }
            },
            onComplete: ()=> {
                this.y %= this.REEL_HEIGHT;
            }
        })
    }

    _getMoveDistance( targetIndex ) {
        return ( this.CONST.symbolCount - targetIndex + this._curIndex ) * this.CONST.symbolHeight;
    }
}

class MiniSlot extends PIXI.Container {
    constructor( reelCount = 5) {
        super();

        this.CONST = {
            reelCount: reelCount,
            reelSpaceX: 150,
            symbolCount : 10,
            symbolHeight: 200,
            symbolWidth: 120
        };

        let mask = new PIXI.Graphics();
        mask.beginFill();
        mask.drawRect(this.x ,this.y, this.CONST.reelSpaceX * reelCount, this.CONST.symbolHeight );
        mask.endFill();
        mask.color = 0x000000;
        mask.alpha = 0.6;
        this.addChild( mask );

        this.reelContainer = new PIXI.Container();
        this.addChild( this.reelContainer );

        this.reels = [];

        this.setReels();
    }

    setReels() {
        for( let i = 0; i< this.CONST.reelCount; i++ ) {
            this.reels.push( new Reel( this.CONST ) );
            this.reels[ i ].x = this.CONST.reelSpaceX * i;
            this.reelContainer.addChild( this.reels[ i ] );
        }
    }

    playReel() {
        for( let i = 0; i< this.reels.length; i++ ) {
            this.reels[ i ]._playReel( 3 + i * 0.3, Math.floor( 10 * Math.random() ) );
        }
    }
}

class Main {
    constructor() {
        this.app = new PIXI.Application(800, 900, {
            backgroundColor: 0xcccccc
        });
        document.body.appendChild(this.app.view);

        this.stage = this.app.stage;

        this.loadResource();
    }

    loadResource() {
        let loader = PIXI.loader;

        loader.add( "symbol1", _ASSET_PATH_ + "1111.png" );
        loader.add( "symbol2", _ASSET_PATH_ + "2222.png" );
        loader.add( "symbol3", _ASSET_PATH_ + "3333.png" );
        loader.add( "symbol4", _ASSET_PATH_ + "4444.png" );

        loader.load( () => {
            this.init();
        })
    }

    init() {
        this.slot = new MiniSlot();
        this.stage.addChild( this.slot );

        this.slot.x = 50;
        this.slot.y = 300;
    }

    play() {
        this.slot.playReel();
    }

}


window.aaa = new Main();
