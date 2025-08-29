<template>
	<div id="myAlbums">
		<div class="albumList">
			<div v-for="album in albums" class="albumRow" @click="openBalancePopup(album)">
				<div class="albumTitle">{{ album.title }}</div>
				<div class="albumTotal">{{ album.total }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	import { getAlbums } from '@/db/DB';

	const emit = defineEmits([
		'showBalancePopup',
		'album',
	])
	// Populate albums
	const albums = ref([]);
	getAlbums().then((storedAlbum) => {
		if (storedAlbum.result[0]) {
			albums.value = storedAlbum.result.slice();
		}
	});

	// Open balance popup
	const openBalancePopup = (album) => {
		emit('showBalancePopup', true, 'view');
		emit('album', album);
	}
</script>

<style scoped>
#myAlbums {
	display: flex;
	justify-content: center;
	height: 100%;
}

.albumList {
	margin-top: 20px;
	width: 90%;
	height: 80%;
	border-left: 1px solid #FF746C;
	border-right: 1px solid #FF746C;
}
.albumList .albumRow {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
	border-bottom: 1px solid #343434;
	cursor: pointer;
}
.albumList .albumRow:hover {
	background-color: #FF746C80
}
.albumList .albumRow .album {
	margin-right: 5px;
	color: #949494
}

</style>