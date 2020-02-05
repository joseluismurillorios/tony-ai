import * as firebase from 'firebase/app';
import 'firebase/auth';

import { FIREBASE_CONFIG } from '../../config';

// Initialize Firebase
firebase.initializeApp(FIREBASE_CONFIG);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
// console.log(firebase);
export default firebase;
