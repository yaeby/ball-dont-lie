<script setup>
import { useDreamTeamStore } from '../stores/dreamTeam';
import { useLogoStore } from '../stores/logoStore';
import { ref, computed } from 'vue';

const dreamTeamStore = useDreamTeamStore();
const logoStore = useLogoStore();

const filledPositionCount = computed(() => dreamTeamStore.getFilledPositionCount());

const PG = computed(() => dreamTeamStore.PG);
const SG = computed(() => dreamTeamStore.SG);
const SF = computed(() => dreamTeamStore.SF);
const PF = computed(() => dreamTeamStore.PF);
const C = computed(() => dreamTeamStore.C);

const isTeamComplete = computed(() => dreamTeamStore.isTeamComplete());

const removePlayer = (playerId) => {
    dreamTeamStore.removePlayer(playerId);
};

const clearTeam = () => {
    if (confirm('Are you sure you want to remove all the players from your team?')) {
        dreamTeamStore.clearDreamTeam();
    }
};
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">My Dream Team</h1>
        
        <div class="flex justify-between items-center mb-8">
            <div class="text-lg">
                <span class="font-bold text-blue-600">{{ filledPositionCount }}/5</span> positions filled
            </div>
            <button 
                v-if="filledPositionCount > 0"
                @click="clearTeam" 
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Clear Team
            </button>
        </div>
        
        <!-- Basketball Court -->
        <div class="relative w-full max-w-5xl mx-auto aspect-[2/1.8] bg-orange-300 rounded-lg overflow-hidden shadow-xl my-8 border-4 border-orange-500">
            <!-- Court Markings -->
            <div class="absolute inset-x-0 top-0 h-1/2 flex items-center justify-center">
                <div class="w-[40%] h-[70%] border-2 border-gray-700 rounded-b-full"></div>
            </div>
            <div class="absolute inset-x-0 bottom-0 h-1/2 flex items-center justify-center">
                <div class="w-[40%] h-[70%] border-2 border-gray-700 rounded-t-full"></div>
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-[30%] aspect-square rounded-full border-2 border-gray-700"></div>
            </div>
            
            <!-- Court Half-Line -->
            <div class="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-700"></div>
            
            <!-- Player Positions -->
            <!-- Point Guard (Top Left) -->
            <div class="absolute left-[20%] top-[15%] transform -translate-x-1/2 -translate-y-1/2">
                <div v-if="PG" class="player-card">
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(PG.team.abbreviation)" 
                            :alt="`${PG.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                        <button 
                            @click="removePlayer(PG.id)"
                            class="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm">{{ PG.first_name }} {{ PG.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">PG</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">PG</span>
                </div>
            </div>
            
            <!-- Shooting Guard (Top Right) -->
            <div class="absolute right-[20%] top-[15%] transform translate-x-1/2 -translate-y-1/2">
                <div v-if="SG" class="player-card">
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(SG.team.abbreviation)" 
                            :alt="`${SG.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                        <button 
                            @click="removePlayer(SG.id)"
                            class="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm">{{ SG.first_name }} {{ SG.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">SG</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">SG</span>
                </div>
            </div>
            
            <!-- Small Forward (Middle Left) -->
            <div class="absolute left-[25%] top-[50%] transform -translate-x-1/2 -translate-y-1/2">
                <div v-if="SF" class="player-card">
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(SF.team.abbreviation)" 
                            :alt="`${SF.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                        <button 
                            @click="removePlayer(SF.id)"
                            class="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm">{{ SF.first_name }} {{ SF.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">SF</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">SF</span>
                </div>
            </div>
            
            <!-- Power Forward (Middle Right) -->
            <div class="absolute right-[25%] top-[50%] transform translate-x-1/2 -translate-y-1/2">
                <div v-if="PF" class="player-card">
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(PF.team.abbreviation)" 
                            :alt="`${PF.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                        <button 
                            @click="removePlayer(PF.id)"
                            class="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm">{{ PF.first_name }} {{ PF.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">PF</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">PF</span>
                </div>
            </div>
            
            <!-- Center (Bottom) -->
            <div class="absolute left-1/2 bottom-[20%] transform -translate-x-1/2 translate-y-1/2">
                <div v-if="C" class="player-card">
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(C.team.abbreviation)" 
                            :alt="`${C.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                        <button 
                            @click="removePlayer(C.id)"
                            class="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm">{{ C.first_name }} {{ C.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">C</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">C</span>
                </div>
            </div>
        </div>
        
        <!-- Instructions if team is not complete -->
        <div v-if="!isTeamComplete" class="text-center mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p class="text-blue-800 dark:text-blue-200">
                Your team isn't complete! Add players for the empty positions.
            </p>
        </div>
        
        <!-- Congratulations message if team is complete -->
        <div v-else class="text-center mt-8 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <p class="text-green-800 dark:text-green-200 text-xl font-bold">
                Congratulations! Your Dream Team is assembled!
            </p>
        </div>
    </div>
</template>

<style scoped>
.player-card {
    transition: all 0.3s ease;
}
.player-card:hover {
    transform: translateY(-5px);
}
.empty-spot {
    opacity: 0.6;
    cursor: default;
}
</style>
