<template>
	<div id="container">
		<BalancePopup v-if="showPopup"
			:save="save"
			:view="view"
			:album="album"
			@showBalancePopup="showBalancePopup"
			@activeTab="(tab) => activeTab = tab"
		/>
		<h1>Album Balancer</h1>
		<div id="balancer">
			<div class="tabs">
				<button class="tabHeader" v-for="tab in tabs"
					:class= "{ active: activeTab == tab }"
					@click="setActiveTab(tab)"
				>
					{{ tab }}
				</button>
			</div>

			<div class="content">
				<SongCalculator v-if="activeTab == 'Song Calc'"
					@showBalancePopup="showBalancePopup"
				/>
				<MyAlbums v-if="activeTab == 'My Albums'"
					@showBalancePopup="showBalancePopup"
					@album="setAlbum"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue';

	import SongCalculator from './components/SongCalculator.vue';
	import BalancePopup from './components/BalancePopup.vue';
	import MyAlbums from './components/MyAlbums.vue';

	// tabs for the balancer
	const tabs = ['Song Calc', 'My Albums'];
	const activeTab = ref('Song Calc');

	// defines how the balance popup should open
	const showPopup = ref(false);
	const save = ref(false);
	const view = ref(false);

	// album to send to popup from when viewing from My Albums
	const album = ref({});

	// sets active tab to be viewed by user
	const setActiveTab = (tab) => {
		activeTab.value = tab;
	}

	/*
		Shows / hides balance popup
	*/
	const showBalancePopup = (show, action) => {
		// show popup
		showPopup.value = show == true ? true : false;

		// Determines wether save or view version of popup is loaded
		save.value = action == 'save' ? true : false;
		view.value = action == 'view' ? true : false;
	}

	/*
		Sets album prop
	*/
	const setAlbum = (albumData) => {
		album.value = albumData;
	}
</script>

<style scoped>
#container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
	height: 100%;
	font-family: 'Bradley Hand', cursive;
}
#container #balancer {
	display: flex;
	flex-direction: column;
	width: 40dvh;
	height: 70dvh;
	border-radius: 10px;
	box-shadow: 0 0 10px #222831;
}
#container #balancer .tabs {
	display: flex;
	justify-content: center;
	text-align: center;
	gap: 100px;
	margin-top: 30px;
	list-style: none;
	padding: 10px;
}
#container #balancer .tabs .tabHeader {
	position: relative;
	flex: 1;
	max-width: 100px;
	background: none;
	border: none;
	cursor: pointer;
	font-size: 1em;
}
#container #balancer .tabs .tabHeader::after {
	content: '';
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 0;
	height: 1px;
	background-color: #FF746C;
	transition: all 0.3s ease;
	transform: translateX(-50%);
}
#container #balancer .tabs .tabHeader.active::after {
	width: 95%;
}

#container #balancer .content {
	flex: 1;
	border-radius:  0 0 10px 10px;
}
</style>
