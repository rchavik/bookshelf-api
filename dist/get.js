'use strict';

var Howhap = require('howhap');
module.exports = function (req, res, urlPieces, model, config) {
	var promise = model;

	if (model.hasTimestamps.indexOf(config.deletedAttribute)) {
		promise = promise.where(config.deletedAttribute, null);
	}

	// Get individual record
	if (urlPieces.length > 1) {
		promise = promise.fetch();
	}
	// Get all records
	else {
			promise = promise.fetchAll();
		}

	return promise.then(function (results) {
		if (!results) {
			var err = new Howhap(config.errors.RECORD_NOT_FOUND, {
				model: urlPieces[0],
				id: urlPieces[1]
			});
			res.status(err.status).json(err.toJSON());
		} else {
			res.json(results.toJSON());
		}
	}).catch(function (err) {
		var error = new Howhap(config.errors.UNKNOWN, {
			error: err.toString()
		});
		res.status(error.status).json(error.toJSON());
	}).then(function () {
		return Promise.resolve({
			urlPieces: urlPieces,
			model: model
		});
	});
};