const express = require('express');

const { validationResult } = require('express-validator');

const firebaseUtils = require('../utils/firebase.utils');
const { error } = require('../utils/error.utils');

exports.postSnapshotFromUserAuth = (req, res, next) => {
	const { userAuth } = req.body;
	firebaseUtils
		.createUserProfileDocument(userAuth)
		.then((userRef) => {
			const userSnapshot = userRef.get();
			res.status(200).json({
				message: 'Got snapshot from userAuth',
				userSnapshot: {
					id: userSnapshot.id,
					...userSnapshot.data,
				},
			});
		})
		.catch((err) => {
			error(next, err);
		});
};

exports.postSignInWithEmailAndPassword = (req, res, next) => {
	const { email, password } = req.body;
	firebaseUtils.auth
		.signInWithEmailAndPassword(email, password)
		.then(({ user }) => {
			res.status(200).json({ message: 'Authorized email sign in.', user });
		})
		.catch((err) => {
			error(next, err);
		});
};

exports.putSignUp = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const err = new Error('Validation failed.');
		err.statusCode = 422;
		err.data = errors.array();
		error(next, err);
	}

	const { displayName, email, password } = req.body;

	firebaseUtils.auth
		.createUserWithEmailAndPassword(email, password)
		.then(({ user }) => {
			return firebaseUtils.createUserProfileDocument(user, { displayName });
		})
		.then((response) => {
			res.status(201).json({
				message: response,
			});
		})
		.catch((err) => {
			error(next, err);
		});
};

exports.test = (req, res, next) => {
	console.log('Firebase Test');

	res.status(200).json({ message: 'Firebase test successful.' });
};
