<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePlayerStore } from '../stores/playersStore';
import { useLogoStore } from '../stores/logoStore';
import { useDreamTeamStore } from '../stores/dreamTeam';

const playerStore = usePlayerStore();
const logoStore = useLogoStore();
const dreamTeamStore = useDreamTeamStore();
const loading = ref(true);
const searchQuery = ref('');
const notificationMessage = ref('');
const showNotification = ref(false);

const notify = (message, isSuccess = true) => {
    notificationMessage.value = message;
    notificationClass.value = isSuccess ? 'bg-green-500' : 'bg-red-500';
    showNotification.value = true;
    setTimeout(() => {
        showNotification.value = false;
    }, 3000);
};

const addToDreamTeam = (player) => {
    const result = dreamTeamStore.addPlayer(player);
    notify(result.message, result.success);
};

const addToPosition = (player, position) => {
    const result = dreamTeamStore.addPlayerToPosition(player, position);
    notify(result.message, result.success);
};

const showPositionDropdown = ref(false);
const selectedPlayer = ref(null);

const openPositionDropdown = (player) => {
    selectedPlayer.value = player;
    showPositionDropdown.value = true;
};

const isInDreamTeam = (playerId) => {
    return dreamTeamStore.isPlayerInDreamTeam(playerId);
};

const notificationClass = ref('bg-green-500');

onMounted(async () => {
    if (playerStore.players.length === 0) {
        await playerStore.fetchPlayers();
    }
    loading.value = false;
});

const players = computed(() => playerStore.players);
const pagination = computed(() => playerStore.pagination || {
    cursor: null,
    perPage: 24,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1
});

const handleNextPage = async () => {
    loading.value = true;
    await playerStore.fetchNextPage();
    loading.value = false;
    window.scrollTo(0, 0);
};

const handlePrevPage = async () => {
    loading.value = true;
    await playerStore.fetchPreviousPage();
    loading.value = false;
    window.scrollTo(0, 0);
};

const handleSearch = async () => {
    loading.value = true;
    await playerStore.fetchPlayers({ 
        search: searchQuery.value,
        perPage: pagination.value.perPage 
    });
    loading.value = false;
};

const changePerPage = async (perPage) => {
    loading.value = true;
    await playerStore.fetchPlayers({ 
        perPage,
        search: searchQuery.value 
    });
    loading.value = false;
};
</script>

<template>
    <div class="container mx-auto px-4 py-16">
        <!-- Notification -->
        <div v-if="showNotification" 
             :class="[notificationClass, 'fixed top-4 right-4 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity']">
            {{ notificationMessage }}
        </div>
        
        <!-- Position Selection Dropdown Modal -->
        <div v-if="showPositionDropdown" class="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Choose position for {{ selectedPlayer?.first_name }} {{ selectedPlayer?.last_name }}
                </h3>
                <div class="grid grid-cols-1 gap-3 mb-4">
                    <button 
                        v-for="position in ['PG', 'SG', 'SF', 'PF', 'C']" 
                        :key="position"
                        @click="addToPosition(selectedPlayer, position); showPositionDropdown = false"
                        class="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {{ position }}: {{ dreamTeamStore.positionLabels[position] }}
                    </button>
                </div>
                <button 
                    @click="showPositionDropdown = false" 
                    class="w-full py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
        
        <!-- Search Bar -->
        <div class="mb-8 flex justify-center">
            <div class="relative w-full max-w-md">
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search players..." 
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    @keyup.enter="handleSearch"
                />
                <button 
                    @click="handleSearch" 
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Search
                </button>
            </div>
        </div>
        
        <!-- Results per page selector -->
        <div class="mb-6 flex justify-end" v-if="pagination">
            <select 
                @change="changePerPage(parseInt($event.target.value))" 
                :value="pagination.perPage"
                class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
                <option value="8">8 per page</option>
                <option value="24">24 per page</option>
                <option value="40">40 per page</option>
                <option value="80">80 per page</option>
            </select>
        </div>

        <div v-if="loading" class="text-center text-xl text-gray-600 dark:text-gray-300 py-12">
            Loading players...
        </div>
        
        <div v-else-if="players.length === 0" class="text-center text-xl text-gray-600 dark:text-gray-300 py-12">
            No players found.
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
                v-for="player in players" 
                :key="player.id" 
                class="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
            >
                <!-- Dream Team Badge -->
                <div v-if="isInDreamTeam(player.id)" 
                    class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    In Team
                </div>
                
                <img 
                    :src="logoStore.getTeamLogo(player.team.abbreviation)" 
                    :alt="`${player.team.full_name} logo`" 
                    class="h-32 w-32 mx-auto mb-4 object-contain"
                />
                <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-white text-center">{{ player.first_name }} {{ player.last_name }}</h2>
                <div class="text-gray-600 dark:text-gray-300 text-center">
                    <p class="mb-2"><span class="font-semibold">Jersey:</span> {{ player.jersey_number }}</p>
                    <p class="mb-2"><span class="font-semibold">Position:</span> {{ player.position }}</p>
                    <p class="mb-2"><span class="font-semibold">Country:</span> {{ player.country }}</p>
                    <p class="mb-2"><span class="font-semibold">Team:</span> {{ player.team.full_name }}</p>
                    
                    <!-- Dream Team Buttons -->
                    <div class="mt-2 flex gap-2">
                        <button
                            v-if="!isInDreamTeam(player.id)"
                            @click="openPositionDropdown(player)"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Choose Position
                        </button>
                        <button
                            v-else
                            @click="removePlayer(player.id)"
                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="pagination" class="mt-8 flex justify-center items-center space-x-4">
            <button 
                @click="handlePrevPage" 
                :disabled="!pagination.hasPreviousPage"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': !pagination.hasPreviousPage }"
            >
                Previous Page
            </button>
            
            <span class="text-gray-800 dark:text-gray-200">
                Page {{ pagination.pageNumber }}
            </span>
            
            <button 
                @click="handleNextPage" 
                :disabled="!pagination.hasNextPage"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': !pagination.hasNextPage }"
            >
                Next Page
            </button>
        </div>
    </div>
</template>