require('dotenv').config();

const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

const config = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
};

const createUserProfileDocument = (userAuth, additionalData) => {
	return new Promise((resolve, reject) => {
		if (!userAuth) reject(new Error('No userAuth obj found'));

		const userRef = firestore.doc(`users/${userAuth.uid}`);

		userRef.get()
			.then((snapShot) => {
				if (!snapShot.exists) {
					const { displayName, email } = userAuth;
					const createdAt = new Date();

					return userRef.set({
						displayName,
						email,
						createdAt,
						...additionalData,
					});
				}

				resolve(userRef);
			})
			.then(() => {
				resolve('User created successfully');
			})
			.catch((error) => {
				reject(error);
			});
	});
};

const addCollectionAndDocuments = (collectionKey, objectsToAdd) => {
	return new Promise((resolve, reject) => {
		try {
			const collectionRef = firestore.collection(collectionKey);

			const batch = firestore.batch();

			objectsToAdd.forEach((obj) => {
				const newDocRef = collectionRef.doc();
				batch.set(newDocRef, obj);
			});

			resolve(batch.commit());
		} catch (error) {
			reject(error);
		}
	});
};

const convertCollectionsSnapshotToMap = (collections) => {
	const transformedCollection = collections.docs.map((doc) => {
		const { title, items } = doc.data();
		return {
			routeName: encodeURI(title.toLowerCase()),
			id: doc.id,
			title,
			items,
		};
	});

	return transformedCollection.reduce((accumulator, collection) => {
		accumulator[collection.title.toLowerCase()] = collection;
		return accumulator;
	}, {});
};

const getCurrentUser = (user) => {
	return new Promise((resolve, reject) => {
		const unsubscribe = auth.onAuthStateChanged((userAuth) => {
			unsubscribe();
			resolve(userAuth);
		}, reject);
	});
};

if (firebase.apps.length === 0) {
	firebase.initializeApp(config);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

module.exports = {
	googleProvider,
	signInWithGoogle,
	firebase,
	auth,
	firestore,
	createUserProfileDocument,
	addCollectionAndDocuments,
	convertCollectionsSnapshotToMap,
	getCurrentUser,
};
