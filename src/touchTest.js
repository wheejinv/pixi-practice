var app = new PIXI.Application(1000, 500, {
	backgroundColor: 0xcccccc,
});
document.getElementById("parent").appendChild(app.view);
// document.body.appendChild(app.view);

var rect = new PIXI.Graphics();
rect.beginFill(0xFFFFFF)
	.drawRect(-5, -14, 257, 429)
	.endFill();

app.stage.addChild(rect);

rect.interactive = true;
rect.on('mousedown', ()=>{
	console.warn("click");
});
