import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSongCalculator = defineStore('songCalculator', () => {
	// Song Info
	const songLength = ref('');
	const songList = ref([]);
	const totalSongTime = ref(0);

	// Formats the total calculated time back to minutes and seconds
	const totalFormattedTime = computed(() => {
		let minutes = Math.floor(totalSongTime.value / 60);
		let seconds = totalSongTime.value % 60;

		return `${minutes}min ${seconds}sec`;
	});

	// Song List Count
	const count = ref(0);

	/*
		Adds user entry to song list
	*/
	const enterSongLength = () => {
		if (songLength.value == 'clear') {
			clearList();
		}

		// Pattern to compare user entry against
		let timePattern = /^(?:[0-9]|[1-5][0-9]) (?:[0-9]|[1-5][0-9])$/;

		if (timePattern.test(songLength.value)) {
			let [minutes, seconds] = songLength.value.split(' ');
			let timeInSeconds = (parseInt(minutes) * 60) + parseInt(seconds);

			totalSongTime.value += timeInSeconds;

			songList.value.push({
				title: `Song #${count.value + 1}`,
				minutes: minutes,
				seconds: seconds,
				total: `${minutes}min ${seconds}sec`
			});
			count.value++;

			songLength.value = '';
		}
	}

	/*
		Clears the song list
	*/
	const clearList = () => {
		count.value = 0;
		totalSongTime.value = 0;
		songList.value = [];
		songLength.value = '';
	}

	// Return state variables & functions for use in scripts
	return { songList, songLength, totalFormattedTime, enterSongLength, clearList };
});
