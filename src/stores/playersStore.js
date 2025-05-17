import { defineStore } from "pinia";
import { BalldontlieAPI } from "@balldontlie/sdk";

const API_KEY = import.meta.env.VITE_API_KEY || process.env.API_KEY;

const api = new BalldontlieAPI({ apiKey: API_KEY });

export const usePlayerStore = defineStore("players", {
    state: () => ({
        players: [],
        pagination: {
            cursor: null,
            perPage: 25,
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 0,
            currentPage: 1
        },
        searchParams: {
            search: '',
            firstName: '',
            lastName: '',
            teamIds: [],
        }
    }),

    actions: {
        async fetchPlayers(params = {}) {
            try {
                const queryParams = {
                    per_page: params.perPage || this.pagination.perPage,
                    cursor: params.cursor || this.pagination.cursor,
                    search: params.search || this.searchParams.search,
                    first_name: params.firstName || this.searchParams.firstName,
                    last_name: params.lastName || this.searchParams.lastName,
                };
                
                if (params.teamIds?.length || this.searchParams.teamIds.length) {
                    queryParams.team_ids = params.teamIds || this.searchParams.teamIds;
                }

                Object.keys(queryParams).forEach(key => {
                    if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
                        delete queryParams[key];
                    }
                });
                
                const response = await api.nba.getPlayers(queryParams);
                
                if (response && response.data) {
                    this.players = response.data;
                    
                    if (response.meta) {
                        this.pagination.cursor = response.meta.next_cursor;
                        this.pagination.hasNextPage = !!response.meta.next_cursor;
                        this.pagination.hasPreviousPage = params.cursor !== null;
                        this.pagination.currentPage = params.page || 1;
                        this.pagination.totalPages = Math.ceil(response.meta.total_count / this.pagination.perPage);
                    }
                    
                    this.searchParams = {
                        search: params.search || this.searchParams.search,
                        firstName: params.firstName || this.searchParams.firstName,
                        lastName: params.lastName || this.searchParams.lastName,
                        teamIds: params.teamIds || this.searchParams.teamIds
                    };
                }
                
                console.log("Players fetched successfully:", this.players);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        },
        
        async fetchNextPage() {
            if (this.pagination.hasNextPage) {
                await this.fetchPlayers({ 
                    cursor: this.pagination.cursor,
                    page: this.pagination.currentPage + 1 
                });
            }
        },
        
        async fetchPreviousPage() {
            if (this.pagination.currentPage > 1) {
                await this.fetchPlayers({ page: 1 });
                
                let targetPage = this.pagination.currentPage - 1;
                for (let i = 1; i < targetPage; i++) {
                    await this.fetchNextPage();
                }
            }
        }
    },
});