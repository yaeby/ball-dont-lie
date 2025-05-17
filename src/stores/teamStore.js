import { defineStore } from 'pinia';
import { BalldontlieAPI } from "@balldontlie/sdk";

const API_KEY = import.meta.env.VITE_API_KEY || process.env.API_KEY;

const api = new BalldontlieAPI({ apiKey: API_KEY });

export const useTeamStore = defineStore('teams', {
    state: () => ({
        teams: []
    }),
    
    actions: {
        async fetchTeams() {
            try {
                const response = await api.nba.getTeams();
                const allTeams = Array.isArray(response) ? response : 
                            (response.data ? response.data : []);
                
                this.teams = allTeams.filter(team => team.city && team.city.trim() !== null);
                
                console.log("Teams fetched successfully:", this.teams);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        }
    },
})