let promise = new Promise( (resolve, reject) => {
    reject("Asd");
});

promise.then(result => {
        console.warn("then");
    }, result => {
        console.warn(result)
    }
)
