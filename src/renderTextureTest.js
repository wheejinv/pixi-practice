class RenderTextureTest {
    constructor() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            forceCanvas: true
        });
        document.body.appendChild(this.app.view);
        this.stage = this.app.stage;



        this.loadAsset();
    }

    loadAsset() {
        PIXI.loader.add( 't1', _ASSET_PATH_ + "/bkg-grass.jpg");
        PIXI.loader.add( 't2', _ASSET_PATH_ + "/BGrotate.jpg");
        PIXI.loader.load( this.init.bind( this ) )
    }

    init( loader, resources ) {
        this._initSpr( resources );
        this._initRenderTexture();
    }

    _initSpr( resources ) {
        this.brush = new PIXI.Graphics();
        this.brush.beginFill(0xffffff);
        this.brush.drawCircle(0, 0, 50);
        this.brush.endFill();

        // this.bg = new PIXI.Sprite( resources["t1"].texture );
        // this.stage.addChild( this.bg );
        // this.bg.width = this.app.screen.width;
        // this.bg.height = this.app.screen.height;

        this.imgToReveal = new PIXI.Sprite( resources["t2"].texture );
        this.stage.addChild( this.imgToReveal );
        this.imgToReveal.width = this.app.screen.width;
        this.imgToReveal.height = this.app.screen.height;
    }

    _initRenderTexture() {
        this.renderTexture = PIXI.RenderTexture.create( this.app.screen.width, this.app.screen.height );

        this.renderTextureSprite = new PIXI.Sprite(this.renderTexture);
        this.stage.addChild( this.renderTextureSprite );

        this.imgToReveal.mask = this.renderTextureSprite;

        this.app.stage.interactive = true;
        this.app.stage.on('pointerdown', this.pointerDown.bind( this ) );
        this.app.stage.on('pointerup', this.pointerUp.bind( this ) );
        this.app.stage.on('pointermove', this.pointerMove.bind( this ) );

        this.dragging = false;
    }

    pointerDown( event ) {
        this.dragging = true;
        this.pointerMove( event );
    }

    pointerUp( event ) {
        this.dragging = false;
    }

    pointerMove( event ) {
        if( this.dragging ) {
            this.brush.position.copy( event.data.global );
            this.app.renderer.render(this.brush, this.renderTexture, false, null, false );
        }
    }
}

window.aaa = new RenderTextureTest();