/*
	Balances 2 sides of an album and returns the result
*/
export function balanceAlbum(songList) {
	// Can't balance with fewer than 2 songs
	if (songList.length < 2) {
		return { sideA : songList, sideB: [] };
	}

	// Convert song times to seconds for easier math
	const songsWithSeconds = songList.map(song => ({
		...song,
		totalSeconds: parseInt(song.minutes) * 60 + parseInt(song.seconds),
	}));

	// Calculate target: half the total time
	const totalTime = songsWithSeconds.reduce((sum, song) => sum + song.totalSeconds, 0);
	const sideLength = Math.floor(totalTime / 2);

	// DP table: sideLengthArray[i] = true if we can make exactly i seconds
	const sideLengthArray = Array(sideLength + 1).fill(false);
	// Track which song was used to achieve each sum (-1 = impossible)
	const songTracker = Array(sideLength + 1).fill(-1);

	// Base case: can always make 0 seconds with no songs
	sideLengthArray[0] = true;

	// For each song, see what new sums become possible
	for (let songPosition = 0; songPosition < songsWithSeconds.length; songPosition++) {
		const songTime = songsWithSeconds[songPosition].totalSeconds;

		// Go backwards to avoid using same song twice in one iteration
		for (let side = sideLength; side >= songTime; side--) {
			// If we can make (side - songTime) and haven't made side yet
			if (sideLengthArray[side - songTime] && !sideLengthArray[side]) {
				sideLengthArray[side] = true;
				songTracker[side] = songPosition;
			}
		}
	}

	// Find the best achievable sum closest to our target
	let sideASum = 0;
	for (let side = sideLength; side >= 0; side--) {
		if (sideLengthArray[side]) {
			sideASum = side;
			break;
		}
	}

	// Backtrack to find which songs create the optimal sum
	const sideAIndices = new Set();
	let currentSum = sideASum;

	while (currentSum > 0 && songTracker[currentSum] !== -1) {
		const songIndex = songTracker[currentSum];
		sideAIndices.add(songIndex);
		currentSum -= songsWithSeconds[songIndex].totalSeconds;
	}

	// Split songs: sideA gets tracked songs, sideB gets the rest
	const sideA = [];
	const sideB = [];

	songsWithSeconds.forEach((song, index) => {
		if (sideAIndices.has(index)) {
			sideA.push(song);
		} else {
			sideB.push(song);
		}
	});

	// Calculate totals and format results
	const sideATotal = sideA.reduce((sum, song) => sum + song.totalSeconds, 0);
	const sideBTotal = sideB.reduce((sum, song) => sum + song.totalSeconds, 0);

	const formatSeconds = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}min ${secs}sec`;
	};

	const result = {
		sideA: {
			songs: sideA,
			total: formatSeconds(sideATotal),
			totalSeconds: sideATotal
		},
		sideB: {
			songs: sideB,
			total: formatSeconds(sideBTotal),
			totalSeconds: sideBTotal
		},
		total: formatSeconds(sideATotal + sideBTotal)
	};

	return result;
}
