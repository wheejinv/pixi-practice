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
        mask.drawRect(this.x ,this.y + yDiff / 2, this.parSheet.reelSpaceX * ( this.parSheet.reelCount - 1 ) + this.parSheet.symbolWidth, this.parSheet.originSymbolHeight - yDiff);
        // mask.drawRect(this.x ,this.y + yDiff / 2, this.parSheet.reelSpaceX * ( this.parSheet.reelCount - 1 ) + this.parSheet.symbolWidth, this.parSheet.symbolHeight - yDiff);
        mask.endFill();
        mask.color = 0x000000;
        mask.alpha = 0.6;

        this.reelContainer.addChild( mask );

        // this.reelContainer.mask = mask;
    }

    initBack() {
        this.back = PIXI.Sprite.fromImage( "back" );
        this.back.x -= 12;
        this.back.y -= 2;
        this.addChildAt( this.back, 0 );
    }

    initReels() {
        for( let i = 0; i< this.parSheet.reelCount; i++ ) {
            let miniReel = new MiniReel( i, this.parSheet );
            miniReel.x = this.parSheet.reelSpaceX * i;
            this.reelContainer.addChild( miniReel );

            this.reels.push( miniReel );
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

    playReel( isJackpot, isMega, spinDuration = 0.4, stopDuration = 0.02, spinCount = 1, bounceDuration=0.05, bounceMultiplier=0.2 ) {

        if( this._isEnabled === false ) {
            return;
        }

        isJackpot = isJackpot === true;

        let arrResult;

        if ( isJackpot && isMega ) {
            arrResult = this._getMegaJackpotResult();
        } else if ( isJackpot && isMega == false) {
            arrResult = this._getSuperJackpotResult();
        } else {
            arrResult = this._getRandomResult();
        }

        for( let i = 0; i< this.reels.length; i++ ) {
            this.reels[ i ]._playReel( spinDuration + i * stopDuration, arrResult[ i ], spinCount, bounceDuration, bounceMultiplier );
        }
    }

    _getMegaJackpotResult() {
        let arr = [];

        let reelInfo;
        for( let i = 0; i < this.parSheet.reelCount; i++ ) {
            reelInfo = this.parSheet['reel' + i ];
            arr.push( 0 );
        }
        return arr;
    }

    _getSuperJackpotResult() {
        let arr = [];

        let reelInfo;
        for( let i = 0; i < this.parSheet.reelCount; i++ ) {
            reelInfo = this.parSheet['reel' + i ];
            if ( i == 4)
            {
                arr.push( 1 );
            } else {
                arr.push( 0 );
            }
        }
        return arr;
    }

    _getRandomResult() {
        let arr = [];

        let red7Count = 0;
        let reelInfo;
        let index = 0;
        for( let i = 0; i < this.parSheet.reelCount; i++ ) {
            reelInfo = this.parSheet['reel' + i ];
            index = Math.floor( Math.random() * 4 );
            if ( red7Count >= 3) {
                index = 1;
            }
            arr.push( index );
            if ( index  == 0 ) {
                red7Count++;
            }
        }

        return arr;
    }

    static getParSheet() {
        let empty = 0;
        let red7 = 1;
        let blue7 = 2;
        let white7 = 3;

        return {
            reelSpaceX  : 39,
            originSymbolHeight:30,
            symbolHeight: 20,
            symbolWidth : 36,
            reelCount: 5,
            EmptySymbolID: 0,
            JackpotSymbolID: 1,
            reel0 : [ red7, empty, blue7, empty, red7, empty, blue7, empty],
            reel1 : [ red7, empty, white7, empty, red7, empty, white7, empty],
            reel2 : [ red7, empty, blue7, empty, red7, empty, blue7, empty],
            reel3 : [ red7, empty, white7, empty, red7, empty, white7, empty],
            reel4 : [ red7, empty, blue7, empty, red7, empty, blue7, empty]
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
            symbol.y = this.parSheet.symbolHeight * ( i - centerIdxY ) + this.parSheet.symbolHeight / 2 - 2 + 5;
            this.arrSymbol.push( symbol );
        }

        this.REEL_HEIGHT = this.parSheet.symbolHeight * symbolCount;
        this.SPIN_COUNT = 1;

        this._viewDown = 150;
        this._curIndex = centerIdxY;

        this._tweenSpin = null;
    }

    destroy( option ) {

        this.arrSymbol = [];

        if( this._tweenSpin ) {
            this._tweenSpin.kill();
            this._tweenSpin = null;
        }

        super.destroy( option );
    }

    _setSymbolPositionInPlay() {
        let len = this.arrSymbol.length;
        for ( let i = 0; i < len; i++) {
            let symbol = this.arrSymbol[ i ];
            if( ( symbol.y + this.y )  > this._viewDown ) {
                symbol.y -= this.REEL_HEIGHT;
            }
        }
    }

    _playReel(spinDuration = 1, stopIndex, spinCount, bounceDuration, bounceMultiplier) {
        if (0 > stopIndex || this._symbolCount - 1 < stopIndex) {
            console.warn("stop index error");
            return;
        }

        this.bounceDuration = bounceDuration;
        this.bounceMultiplier = bounceMultiplier;

        let moveDistanceY = this._getMoveDistance(stopIndex);
        this._curIndex = stopIndex;

        if( this._tweenSpin ) {
            this._tweenSpin.kill();
            this._tweenSpin = null;
        }

        this.spinDuration =  spinDuration;
        this.distance = this.REEL_HEIGHT*spinCount + moveDistanceY;

        this._tweenSpin = TweenMax.to(this, spinDuration, {
            y         : this.y + this.distance,
            onUpdate  : () => {
                this._setSymbolPositionInPlay();
            },
            onComplete: () => {
                this._doLastMove();
            }
        })
    }

    _doLastMove() {
        let _distance = this.parSheet.symbolHeight*this.bounceMultiplier;
        let spinStopTime = this.spinDuration*_distance/this.distance;

        let nextY = this.y + _distance;
        let lastY = nextY - _distance;

        let timeline = new TimelineMax();
        // Last elastic Move
        timeline.to(this, spinStopTime, {paused:false, y:nextY, ease:Bounce.easeOut})
            .to(this, this.bounceDuration, {paused:false, y:lastY, ease:Bounce.easeOut})
            .eventCallback("onComplete", () => {
                let moved = this.y;
                this.y = 0;
                let len = this.arrSymbol.length;
                for (let i = 0; i < len; i++) {
                    this.arrSymbol[i].y += moved;
                }

            }, []);
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
        this.slot = new CJackpotMiniSlot();
        this.stage.addChild( this.slot );

        this.slot.x = 200;
        this.slot.y = 300;
    }

    play( spinDuration, stopIndex, spinCount, bounceDuration, bounceMultiplier ) {

        this.spinDuration = spinDuration || 0.4;
        this.stopDuration = stopIndex || 0.02;
        this.spinCount = spinCount || 1;
        this.bounceDuration = bounceDuration || 0.05;
        this.bounceMultipiler = bounceMultiplier || 0.2;

        this.slot.playReel( Math.random() < 0.5 , Math.random() < 0.5, this.spinDuration, this.stopDuration, this.spinCount, this.bounceDuration, this.bounceMultipiler  );
    }
}


window.aaa = new Main();
