module.exports = app => {
    app.get('/', (req, res) =>{
        res.render('index.html');
    });

    app.get('/app', (req, res) => {
		res.render('app2.html');
	});
};
