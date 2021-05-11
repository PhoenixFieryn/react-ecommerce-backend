const express = require('express');
const { body } = require('express-validator');

const firebaseController = require('../controllers/firebase.controller.js');

const router = express.Router();

router.post('/snapshot-from-userauth', firebaseController.postSnapshotFromUserAuth);

router.put(
	'/signup',
	[
		body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
		body('password').trim().not().isEmpty(),
		body('displayName').trim().not().isEmpty(),
	],
	firebaseController.putSignUp
);

router.post(
	'/sign-in-with-email-and-password',
	[
		body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
		body('password').trim().not().isEmpty(),
	],
	firebaseController.postSignInWithEmailAndPassword
);

router.get('/test', firebaseController.test);

module.exports = router;
