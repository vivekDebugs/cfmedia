import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyD4LI7TNYG72oRkjL0B1XObsdS0zY4vuNY',
	authDomain: 'cloudflare-posts.firebaseapp.com',
	projectId: 'cloudflare-posts',
	storageBucket: 'cloudflare-posts.appspot.com',
	messagingSenderId: '555109130892',
	appId: '1:555109130892:web:723198f6c4cd5c95b751a9',
}

let app: FirebaseApp
if (getApps.length === 0) {
	app = initializeApp(firebaseConfig)
} else {
	app = getApp()
}

const storage = getStorage(app)

export { app, storage }
