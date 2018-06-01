this.resolvePromise;


let promise = new Promise( (resolve, reject) => {
    this.resolvePromise = resolve;
});


promise.then( result => {
    console.warn( "then");
});




setTimeout( () => {
    this.resolvePromise();
    console.warn( 'resolve' );
});