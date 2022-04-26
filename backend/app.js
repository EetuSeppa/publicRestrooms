const express = require('express')
const app = express()
const PORT = 8000
const cors = require('cors');
const morgan = require('morgan')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'publicrestrooms';
const client = new MongoClient(dbUrl);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())

app.get('/searchfromdatabase', function (req,res,next) {
		const query = req.query;
		const location = query.location;
		const city = query.city;
		const showOnlyFree = query.showOnlyFree;
		const regex = /[\{\}\[\]\'\*\^\(\)$]/;
		if(regex.test(location)||regex.test(city)) {
			return res.status(400).send();
		}
	client.connect(function(err, client) {
		if (err) {
			next(err);
		}
		let dbQuery;
		let locationRegex = `[\w ]*${location}[\w ]*`;
		let cityRegex = `[\w ]*${city}[\w ]*`;
		if (location.length !== 0 & city.length !== 0) {
			dbQuery = {"location": {$regex: locationRegex, $options: 'i'}, 
						"city": {$regex: cityRegex, $options: 'i'}};
		} else if (location.length == 0) {
			dbQuery = {"city": {$regex: cityRegex, $options: 'i'}};
		} else if (city.length == 0) {
			dbQuery = {"location": {$regex: locationRegex, $options: 'i'}};
		}
		assert.equal(null, err);
		const db = client.db(dbName);
		db.collection('restrooms').find(dbQuery).toArray(function(err,docs) {
			assert.equal(null, err);
			const priceFilter = [];
			docs.forEach(function(row){
				if(showOnlyFree === "true") {
					if (row.price === "") {
						priceFilter.push(row);
					}
				} else  {
					priceFilter.push(row);
				}
			});
			if(priceFilter.length === 0) {
				return res.status(202).send();
			}
			const data = {data: priceFilter};
			if(priceFilter.length > 0) {
				return res.status(200).send(data);
			};
		});
	});
});

app.post('/savetodatabase', function(req,res,next) {
	const body = req.body
	const sijainti = body.sijainti;
	const kaupunki = body.kaupunki;
	const price = body.hinta;
	const passRequired = body.passRequired;
	const paymentMethod = body.maksutapa;
	const regex = /[\{\}\[\]\'\*\^\(\)$]/;
	if(regex.test(sijainti)|| regex.test(kaupunki)) {
		return res.status(400).send();
	}
	client.connect(function(err, client) {
		if (err) {
			next(err);
		}
		assert.strictEqual(null, err);
		const db = client.db(dbName);

		db.collection('restrooms').insertOne({location: sijainti, city: kaupunki, price: price, passRequired: passRequired, paymentMethod:paymentMethod}, function(err, r) {	
		assert.equal(null, err);
		assert.equal(1, r.insertedCount);
		res.status(202).send();
		});
	});
});

app.use(function(err, req, res, next){ 
	res.send(err).status(err.status);
})
app.listen(PORT);
