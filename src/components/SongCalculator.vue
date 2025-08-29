<template>
	<div id="songCalc">
		<div class="songList">
			<div v-for="song in songStore.songList" :key="song.count" class="songRow">
				<input class="songTitle"
					v-model="song.title"
				/>
				{{ song.total }}
			</div>
		</div>
	</div>

	<div class="totalTime">
		Total Time: {{ songStore.totalFormattedTime }}
	</div>

	<div class="songControl">
		<input type="text"
			class="songEnter"
			v-model="songStore.songLength"
			@keyup.enter="songStore.enterSongLength"
			placeholder="Format: 3 24 (3min 24sec)"
		>
		<button @click="songStore.clearList" class="clearList">Clear List</button>
		<button @click="balanceAlbum" class="balance">Balance</button>
	</div>
</template>

<script setup>
	import { useSongCalculator } from '@/stores/stores';

	const emit = defineEmits([
		'showBalancePopup',
	]);

	const songStore = useSongCalculator();

	const balanceAlbum = () => {
		if (songStore.songList.length > 1) {
			emit('showBalancePopup', true, 'save');
		}
	}
</script>

<style scoped>
#songCalc {
	display: flex;
	flex-direction: column;
	width: 90%;
	height: 44dvh;
	margin: 20px auto 10px;
	border-left: 1px solid #FF746C;
	border-right: 1px solid #FF746C;
}

.songList {
	flex: 1;
	overflow-y: auto;
}
.songList .songRow {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
}
.songList .songRow:not(:only-child) {
	border-bottom: 1px solid rgb(0, 0, 0, 0.5);
}
.songList .songRow:nth-child(even),
.songList .songRow:nth-child(even) input {
	background-color: #efefef;
}
.songList .songRow .songTitle {
	border: none;
	text-decoration: underline;
	font-size: 18px;
	width: 20dvh;
}
.songList .songRow .songTitle:focus {
	outline: none;
}

.totalTime {
	text-align: right;
	margin-right: 20px;
	margin-bottom: 10px;
}

.songControl {
	display: flex;
	flex-direction: column;
	gap: 10px;
	justify-content: center;
	padding: 0 10px;
}
.songControl .songEnter {
	font-size: 16px;
	text-align: center;
	padding: 5px;
	border: 1px solid #343434;
	border-radius: 5px;
}
.songControl .songEnter:focus {
	outline: none;
	box-shadow: 0 0 5px 0 #343434;
}
.songControl button {
	height: 2.5em;
	color: #fff;
	border: none;
	border-radius: 8px;
	font-weight: bold;
}
.songControl .clearList {
	background-color: #FF746C;
}
.songControl .balance {
	background-color: #50C878;
}

@media (max-width: 375px) {
	#songCalc {
		height: 30dvh;
	}
}
@media (min-width: 376px) and (max-width: 450px) {
	#songCalc {
		height: 40dvh;
	}
}
</style>