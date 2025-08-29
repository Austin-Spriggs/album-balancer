import { openDB } from 'idb';

const DB_NAME = 'Album Balancer';
const STORE_NAME = 'albums';

const dbPromise = openDB(DB_NAME, 8, {
	upgrade(db, oldVersion, newVersion, transaction) {
		let store;

		if (oldVersion < 1) {
			// First time setup
			store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
		} else {
			// Get existing store
			store = transaction.objectStore(STORE_NAME);
		}

		// Add timestamp index if upgrading to version that needs it
		if (oldVersion < 5 && !store.indexNames.contains('timestamp')) {
			store.createIndex('timestamp', 'timestamp');
		}
	}
});

/*
	Saves Album
*/
export const saveAlbum = async (album) => {
	try {
		const db = await dbPromise;

		const albumWithTimestamp = {
			...album,
			timestamp: Date.now(),
		};

		const result = await db.put(STORE_NAME, albumWithTimestamp);

		return { success: true, result: result };
	} catch (error) {
		return { success: false, result: error };
	}
}

/*
	Retrieves all albums
*/
export const getAlbums = async () => {
	try {
		const db = await dbPromise;
		const transaction = db.transaction(STORE_NAME, 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const index = store.index('timestamp');

		const result = [];

		// Opens a cursor that moves backward (Descending order)
		let cursor = await index.openCursor(null, 'next');

		// Push each db item to results
		while (cursor) {
			result.push(cursor.value);
			cursor = await cursor.continue();
		}

		return { success: true, result: result };
	} catch (error) {
		return { success: false, result: error };
	}
}