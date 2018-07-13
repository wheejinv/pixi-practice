class CJackpotMiniSlot extends PIXI.Container {
    constructor() {
        super();

        this.parSheet = CJackpotMiniSlot.getParSheet();

        this.arrReelInfo = [];
        for( let i =0; i < this.parSheet.reelCount; i++ ) {
            this.arrReelInfo.push( this.parSheet["reel" + i]);
        }

        this.reelContainer = new PIXI.Container();
        this.addChild( this.reelContainer );

        this.reels = [];

        this._isEnabled = true;

        this.init();
    }

    init() {
        this.initBack();
        this.initMask();
        this.initReels();
    }

    initMask() {
        let yDiff = 4;

        let mask = new PIXI.Graphics();
        mask.beginFill();
        mask.drawRect(this.x ,this.y + yDiff / 2, this.parSheet.reelSpaceX * ( this.parSheet.reelCount - 1 ) + this.parSheet.symbolWidth, this.parSheet.symbolHeight - yDiff);
        mask.endFill();
        mask.color = 0x000000;
        mask.alpha = 0.6;

        this.reelContainer.addChild( mask );

        this.reelContainer.mask = mask;
    }

    initBack() {
        this.back = PIXI.Sprite.fromImage( "back" );
        this.back.x -= 12;
        this.back.y -= 2;
        this.addChildAt( this.back, 0 );
    }

    initReels() {
        for( let i = 0; i< this.parSheet.reelCount; i++ ) {
            this.reels.push( new MiniReel( i, this.parSheet ) );
            this.reels[ i ].x = this.parSheet.reelSpaceX * i;
            this.reelContainer.addChild( this.reels[ i ] );
        }
    }

    setEnable( isEnable ) {
        this._isEnabled = isEnable;

        let tint = 0xffffff;

        if (!isEnable) {
            tint = 0xbbbbbb;
        }

        this.back.tint = tint;
        this.reels.forEach( reel => {
            reel.setTint( tint );
        })
    }

    playReel( isJackpot, isMega, spinDuration = 1, stopDuration = 0.1) {

        if( this._isEnabled === false ) {
            return;
        }

        isJackpot = isJackpot === true;

        let arrResult = this._getRandomResult();
        let isValid = isMega ? this.checkIsMegaJackpot( arrResult ) : this.checkIsSuperJackpot( arrResult );

        while( isValid !== isJackpot ) {
            arrResult = this._getRandomResult();
            isValid = isMega ? this.checkIsMegaJackpot( arrResult ) : this.checkIsSuperJackpot( arrResult );
        }

        for( let i = 0; i< this.reels.length; i++ ) {
            this.reels[ i ]._playReel( spinDuration + i * stopDuration, arrResult[ i ] );
        }
    }

    _getRandomResult() {
        let arr = [];

        let reelInfo;
        for( let i = 0; i < this.parSheet.reelCount; i++ ) {
            reelInfo = this.parSheet['reel' + i ];
            arr.push( reelInfo[ Math.floor( Math.random() * reelInfo.length ) ] );
        }

        return arr;
    }

    checkIsMegaJackpot(arrResult ) {
        let jackpotCount = 0;

        let symbolID = 0;
        let reelInfo;
        for( let i=0; i< this.arrReelInfo.length; i++ ) {
            reelInfo = this.arrReelInfo[ i ];
            symbolID = reelInfo[ arrResult[ i ] ];

            if( symbolID === this.parSheet.JackpotSymbolID ) {
                jackpotCount++;
            } else {
                break;
            }
        }

        return jackpotCount > 4;
    }

    checkIsSuperJackpot(arrResult ) {
        let jackpotCount = 0;

        let symbolID = 0;
        let reelInfo;
        for( let i=0; i< this.arrReelInfo.length; i++ ) {
            reelInfo = this.arrReelInfo[ i ];
            symbolID = reelInfo[ arrResult[ i ] ];

            if( symbolID === this.parSheet.JackpotSymbolID ) {
                jackpotCount++;
            } else {
                break;
            }
        }

        let lastReelInfo = this.arrReelInfo[4];

        return jackpotCount === 4 && lastReelInfo[arrResult[4]] !== this.parSheet.JackpotSymbolID;
    }

    static getParSheet() {
        let empty = 0;
        let real7 = 1;
        let blue7 = 2;
        let white7 = 3;

        return {
            reelSpaceX  : 39,
            symbolHeight: 30,
            symbolWidth : 36,
            reelCount: 5,
            EmptySymbolID: 0,
            JackpotSymbolID: 1,
            reel0 : [ real7, empty, blue7, empty, real7, empty, white7, empty, real7, empty ],
            reel1 : [ real7, empty, real7, empty, blue7, empty, white7, empty, real7, empty ],
            reel2 : [ real7, empty, blue7, empty, white7, empty, white7, empty, real7, empty ],
            reel3 : [ empty, blue7, empty, real7, empty, white7, empty, real7, empty, real7 ],
            reel4 : [ blue7, empty, real7, empty, white7, empty, white7, empty, real7, empty ]
        }
    }
}

class MiniReel extends PIXI.Sprite {
    constructor( reelIndex, parSheet ) {
        super();
        this._reelIndex = reelIndex;
        this.parSheet = parSheet;

        this.init();
    }

    init() {
        this.reelInfo = this.parSheet['reel' + this._reelIndex ];

        if( !this.reelInfo ) {
            console.warn( "reelInfo invalid");

        }

        this._symbolCount = this.reelInfo.length;

        let symbolCount = this.reelInfo.length;
        let symbol;

        let centerIdxY = Math.ceil( symbolCount / 2 );
        centerIdxY = centerIdxY % 2 ? centerIdxY - 1 : centerIdxY;

        this.arrSymbol = [];
        for( let i = 0; i< this.reelInfo.length; i++ ) {

            if( this.reelInfo[i] === this.parSheet.EmptySymbolID ) {
                symbol = new PIXI.Sprite();
            } else {
                symbol = PIXI.Sprite.fromImage("symbol" + this.reelInfo[i]);
            }

            this.addChild(  symbol );
            symbol.anchor.x = 0.5;
            symbol.anchor.y = 0.5;
            symbol._info = {};
            symbol._info.oriIndex = i;
            symbol.x = this.parSheet.symbolWidth / 2;
            symbol.y = this.parSheet.symbolHeight * ( i - centerIdxY ) + this.parSheet.symbolHeight / 2 - 2;
            this.arrSymbol.push( symbol );
        }

        this.REEL_HEIGHT = this.parSheet.symbolHeight * symbolCount;
        this.SPIN_COUNT = 1;

        this._viewDown = 150;
        this._curIndex = centerIdxY;

        this._blurFilterY = new PIXI.filters.BlurYFilter();
        this.filters = [ this._blurFilterY ];

        this._blurFilterY.blur = 0;

        this._tweenBlur = null;
        this._tweenSpin = null;
    }

    destroy( option ) {

        this.arrSymbol = [];

        if( this._tweenBlur ) {
            this._tweenBlur.kill();
            this._tweenBlur = null
        }

        if( this._tweenSpin ) {
            this._tweenSpin.kill();
            this._tweenSpin = null;
        }

        super.destroy( option );
    }

    _setSymbolPositionInPlay() {
        for ( let i = 0; i < this.arrSymbol.length; i++) {
            if( ( this.arrSymbol[ i ].y + this.y )  > this._viewDown ) {
                this.arrSymbol[ i ].y -= this.REEL_HEIGHT;
            }
        }
    }

    _playReel(stopDuration = 1, stopIndex) {
        if (0 > stopIndex || this._symbolCount - 1 < stopIndex) {
            console.warn("stop index error");
            return;
        }

        let moveDistanceY = this._getMoveDistance(stopIndex);
        this._curIndex = stopIndex;

        if( this._tweenBlur ) {
            this._tweenBlur.kill();
            this._tweenBlur = null
        }

        if( this._tweenSpin ) {
            this._tweenSpin.kill();
            this._tweenSpin = null;
        }

        this._tweenBlur = TweenMax.from( this._blurFilterY, stopDuration - 0.1, {
            blur: 7
        });

        this._tweenSpin = TweenMax.to(this, stopDuration, {
            y         : this.y + (this.REEL_HEIGHT * this.SPIN_COUNT + moveDistanceY),
            // ease      : Power1.easeOut,
            onUpdate  : () => {
                this._setSymbolPositionInPlay();
            },
            onComplete: () => {
                this.y %= this.REEL_HEIGHT;
                for (let i = 0; i < this.arrSymbol.length; i++) {
                    this.arrSymbol[i].y %= this.REEL_HEIGHT;
                    if (this.y === 0) {
                        this.arrSymbol[i].y += this.REEL_HEIGHT;
                    }
                }
            }
        })
    }

    setTint( tint ) {
        this.arrSymbol.forEach( symbol => {
            symbol.tint = tint;
        })
    }

    _getMoveDistance( targetIndex ) {
        return ( this._symbolCount - targetIndex + this._curIndex ) * this.parSheet.symbolHeight;
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

        loader.add( "symbol1", _ASSET_PATH_ + "icon_7.png" );
        loader.add( "symbol2", _ASSET_PATH_ + "icon_7_blue.png" );
        loader.add( "symbol3", _ASSET_PATH_ + "icon_7_white.png" );
        loader.add( "back", _ASSET_PATH_ + "ril_back.png" );

        loader.load( () => {
            this.init();
        })
    }

    init() {
        this._getParSheet();

        this.slot = new CJackpotMiniSlot( this._getParSheet() );
        this.stage.addChild( this.slot );

        this.slot.x = 50;
        this.slot.y = 300;
    }

    _getParSheet() {
        let empty = 0;
        let real7 = 1;
        let blue7 = 2;
        let white7 = 3;

        return {
            reelSpaceX  : 39,
            symbolHeight: 30,
            symbolWidth : 36,
            reelCount: 5,
            EmptySymbolID: 0,
            JackpotSymbolID: 1,
            reel0 : [ real7, empty, blue7, empty, real7, empty, white7, empty, real7, empty ],
            reel1 : [ real7, empty, real7, empty, blue7, empty, white7, empty, real7, empty ],
            reel2 : [ real7, empty, blue7, empty, white7, empty, white7, empty, real7, empty ],
            reel3 : [ empty, blue7, empty, real7, empty, white7, empty, real7, empty, real7 ],
            reel4 : [ blue7, empty, real7, empty, white7, empty, white7, empty, real7, empty ]
        }
    }

    play( isJackpot, isMega, spinDuration, stopDuration ) {
        this.slot.playReel( isJackpot, isMega, spinDuration, stopDuration );
    }
}


window.aaa = new Main();
