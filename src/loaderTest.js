class LoaderTest {
    constructor() {
        this.app = new PIXI.Application(800, 600, {
            backgroundColor: 0xcccccc
        });
        document.body.appendChild(this.app.view);

        this.stage = this.app.stage;

        this.init();
    }

    init() {
        this._initText();
        this._loadImgResource();
    }

    _initText() {
        this.basicText = new PIXI.Text('Basic text in pixi');
        this.basicText.anchor.x = 0.5;
        this.basicText.anchor.y = 0.5;
        this.basicText.x = 400;
        this.basicText.y = 500;
        this.basicText.style.color ="0xffffff";

        this.app.stage.addChild( this.basicText );
    }

    _loadImgResource() {

        // let loader = PIXI.loader;

        let arrFile = [
            '1111.png',
            '2222.png',
            '3333.png',
            '4444.png',
            'BGrotate.jpg',
            'bkg-grass.jpg',
            'btn_close_up.png'
        ];

        console.warn( arrFile.toString() );

        arrFile = arrFile.map( item => {
            return _ASSET_PATH_ + item;
        })

        console.warn( arrFile.toString() );



        let loader = new PIXI.loaders.Loader();
        loader.add( arrFile );

        loader.onProgress.add( ( ss, resource ) => {
            console.warn(ss.progress);
            this.basicText.text = ss.progress + " % ...";
        });

        loader.load( ()=> {
            console.warn("load complete");
        });
    }
}

window.aaa = new LoaderTest();


