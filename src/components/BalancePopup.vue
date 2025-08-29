
<template>
	<div id="shade">
		<div id="balancePopup">
			<div class="header">
				<div class="filler"></div>
				<input v-if="props.save" v-model="myAlbumTitle" class="myAlbumTitle">
				<input v-else v-model="props.album.title" class="myAlbumTitle" readonly>
				<div class="close">
					<span class="material-symbols-outlined closeBtn" @click="closePopup">close</span>
				</div>
			</div>

			<div id="albumSides">
				<div class="sideA">
					<div class="header">Side A</div>
					<div class="sideList">
						<div class="songRow" v-for="song in myAlbum.sideA.songs">
							<div class="songTitle" :title="`${song.title}`">{{ song.title }}</div>
							<div class="songTotal">{{ song.total }}</div>
						</div>
					</div>
					<div class="sideTotal">Side A: {{ myAlbum.sideA.total }}</div>
				</div>
				<div class="sideB">
					<div class="header">Side B</div>
					<div class="sideList">
						<div class="songRow" v-for="song in myAlbum.sideB.songs">
							<div class="songTitle" title="{{ song.title }}">{{ song.title }}</div>
							<div class="songTotal">{{ song.total }}</div>
						</div>
					</div>
					<div class="sideTotal">Side B: {{ myAlbum.sideB.total }}</div>
				</div>
			</div>

			<div id="save">
				<button v-if="props.save" class="saveBtn" @click="saveMyAlbum">Save Album</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	import { useSongCalculator } from '@/stores/stores';

	import { balanceAlbum } from '@/helper/balanceAlbum';
	import { saveAlbum } from '@/db/DB';

	import { v4 as uuid4 } from 'uuid';

	import JSConfetti from 'js-confetti';

	const props = defineProps({
		save: Boolean,
		view: Boolean,
		album: Object,
	});
	// Emits
	const emit = defineEmits([
		'showBalancePopup',
		'activeTab'
	])

	// Pinia Stores
	const songStore = useSongCalculator();

	// Cool confetti library
	const confetti = new JSConfetti();

	// Album Title
	const myAlbumTitle = ref('Album Title');

	// Result of album balancing -> Save | View
	const result = props.save ? balanceAlbum(songStore.songList) : props.album;

	// Album name with result for storing
	const myAlbum = {
		id: uuid4(),
		title: myAlbumTitle.value,
		sideA: result.sideA,
		sideB: result.sideB,
		total: result.total
	};

	/*
		Closes Balancer Popup
	*/
	const closePopup = () => {
		emit('showBalancePopup', false);
	}

	/*
		Saves Album to IndexDB
	*/
	const saveMyAlbum = async () => {

		const cleanedAlbum = {
			...myAlbum,
			title: myAlbumTitle.value
		};

		const albumSaved = await saveAlbum(cleanedAlbum);

		if (albumSaved.success) {
			confetti.addConfetti();

			setTimeout(() => {
				songStore.clearList();
				emit('activeTab', 'My Albums')
				closePopup();
			}, 1000);
		}
	}
</script>

<style scoped>
/*
	Shade
*/
#shade {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	z-index: 1;
	background-color: rgb(0, 0, 0, 0.25);
}
/*
	Balance Popup
*/
#balancePopup {
	position: absolute;
	display: flex;
	flex-direction: column;
	height: 50dvh;
	width: 42dvh;
	border: 1px solid #343434;
	border-radius: 10px;
	background-color: #efefef;
	z-index: 2;
}

.header {
	display: flex;
}
.header .filler {
	flex: 1;
	margin-right: 20px;
}
.header .myAlbumTitle {
	border: none;
	background-color: #efefef;
	text-decoration: underline;
	font-size: 20px;
	margin: 25px auto;
	text-align: center;
}
.header .myAlbumTitle:focus {
	outline: none;
}

.header .close {
	flex: 1;
	text-align: end;
	margin: 20px 25px 0 0;
}
.header .close .closeBtn {
	cursor: pointer;
}

/*
	Album Sides A & B
*/
#albumSides {
	display: flex;
	height: 90%;
}

.sideA {
	border-radius: 0 0 0 10px;
}
.sideB {
	border-radius: 0 0 10px 0;
}
.sideA, .sideB {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 50%;
}
.sideA .header,
.sideB .header {
	text-decoration: underline;
	margin-bottom: 10px;
}
.sideA .sideList {
	border-right: 1px solid black;
}
.sideA .sideList,
.sideB .sideList {
	width: 100%;
	height: 30dvh;
	overflow-y: auto;
	margin-bottom: 10px;
}
.sideA .sideList .songRow,
.sideB .sideList .songRow {
	display: flex;
	justify-content: space-between;
	padding: 5px 10px;
	border-bottom: 1px solid rgb(0, 0, 0, 0.35);
}
.sideA .songRow .songTitle,
.sideB .songRow .songTitle {
	margin-left: 5px;
	max-width: 150px;
	text-wrap: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
}
.sideA .songRow .songTotal,
.sideB .songRow .songTotal {
	margin-right: 5px;
}

/*
	Save
*/
#save {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}

.saveBtn {
	font-size: larger;
	padding: 6px 10px;
	border-radius: 8px;
	border: none;
	background-color: #50C878;
	color: white;
}
.saveBtn:hover {
	transform: scale(1.1);
	transition: 0.5s ease ;
}

@media (max-width: 375px) {
	.sideA .sideList,
	.sideB .sideList {
		height: 20dvh;
	}
	.sideA .songRow .songTitle,
	.sideB .songRow .songTitle {
		max-width: 55px;
	}
	.sideA .songRow .songTotal,
	.sideB .songRow .songTotal {
		max-width: 55px;
		text-wrap: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}
}
@media (min-width: 376px) and (max-width: 450px) {
	.sideA .sideList,
	.sideB .sideList {
		height: 25dvh;
	}
	.sideA .songRow .songTitle,
	.sideB .songRow .songTitle {
		max-width: 60px;
	}
}
</style>