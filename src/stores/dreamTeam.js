import { defineStore } from "pinia";

export const useDreamTeamStore = defineStore("dreamTeam", {
    state: () => ({
        PG: JSON.parse(localStorage.getItem('PG')) || null,
        SG: JSON.parse(localStorage.getItem('SG')) || null,
        SF: JSON.parse(localStorage.getItem('SF')) || null,
        PF: JSON.parse(localStorage.getItem('PF')) || null,
        C: JSON.parse(localStorage.getItem('C')) || null,
        
        positionLabels: {
            PG: "Point Guard",
            SG: "Shooting Guard",
            SF: "Small Forward",
            PF: "Power Forward",
            C: "Center"
        }
    }),
    
    actions: {
        addPlayerToPosition(player, position) {
            if (!['PG', 'SG', 'SF', 'PF', 'C'].includes(position)) {
                return { success: false, message: "Invalid position" };
            }
            
            if (this[position] !== null) {
                return { 
                    success: false, 
                    message: `${this.positionLabels[position]} position is already filled` 
                };
            }
            
            // Add player to the position
            this[position] = {
                id: player.id,
                first_name: player.first_name,
                last_name: player.last_name,
                position: player.position,
                team: player.team,
                jersey_number: player.jersey_number,
                country: player.country
            };
            
            // Save to localStorage
            localStorage.setItem(position, JSON.stringify(this[position]));
            
            return { 
                success: true, 
                message: `${player.first_name} ${player.last_name} added as ${this.positionLabels[position]}` 
            };
        },
        
        // Automatically determine best position based on player's position
        addPlayer(player) {
            const recommendedPosition = this.getRecommendedPosition(player.position);
            
            if (!recommendedPosition) {
                return { success: false, message: "Couldn't determine position for this player" };
            }
            
            // If recommended position is filled, try to find an empty position
            if (this[recommendedPosition] !== null) {
                const emptyPosition = this.findEmptyPosition();
                if (emptyPosition) {
                    return this.addPlayerToPosition(player, emptyPosition);
                } else {
                    return { success: false, message: "All positions are filled" };
                }
            }
            
            return this.addPlayerToPosition(player, recommendedPosition);
        },
        
        // Remove player from position
        removePlayer(playerId) {
            const position = this.findPlayerPosition(playerId);
            
            if (!position) {
                return { success: false, message: "Player not in dream team" };
            }
            
            const playerName = `${this[position].first_name} ${this[position].last_name}`;
            
            // Remove player
            this[position] = null;
            
            // Update localStorage
            localStorage.removeItem(position);
            
            return { 
                success: true, 
                message: `${playerName} removed from ${this.positionLabels[position]} position` 
            };
        },
        
        // Find which position a player is in
        findPlayerPosition(playerId) {
            for (const position of ['PG', 'SG', 'SF', 'PF', 'C']) {
                if (this[position] && this[position].id === playerId) {
                    return position;
                }
            }
            return null;
        },
        
        // Check if player is in any position
        isPlayerInDreamTeam(playerId) {
            return this.findPlayerPosition(playerId) !== null;
        },
        
        // Find an empty position
        findEmptyPosition() {
            for (const position of ['PG', 'SG', 'SF', 'PF', 'C']) {
                if (this[position] === null) {
                    return position;
                }
            }
            return null;
        },
        
        // Get recommended position based on player's listed position
        getRecommendedPosition(playerPosition) {
            if (!playerPosition) return null;
            
            const pos = playerPosition.toUpperCase();
            
            if (pos === 'PG' || pos.includes('POINT GUARD')) return 'PG';
            if (pos === 'SG' || pos.includes('SHOOTING GUARD')) return 'SG';
            if (pos === 'SF' || pos.includes('SMALL FORWARD')) return 'SF';
            if (pos === 'PF' || pos.includes('POWER FORWARD')) return 'PF';
            if (pos === 'C' || pos.includes('CENTER')) return 'C';
            
            // If not specific, make a general guess
            if (pos.includes('G')) return this.PG === null ? 'PG' : 'SG';
            if (pos.includes('F')) return this.SF === null ? 'SF' : 'PF';
            if (pos.includes('C')) return 'C';
            
            // Default to any open position
            return this.findEmptyPosition();
        },
        
        // Clear the entire dream team
        clearDreamTeam() {
            for (const position of ['PG', 'SG', 'SF', 'PF', 'C']) {
                this[position] = null;
                localStorage.removeItem(position);
            }
            
            return { success: true, message: "Dream team cleared" };
        },
        
        // Check if team is complete (all positions filled)
        isTeamComplete() {
            return this.PG !== null && 
                   this.SG !== null && 
                   this.SF !== null && 
                   this.PF !== null && 
                   this.C !== null;
        },
        
        // Get count of filled positions
        getFilledPositionCount() {
            let count = 0;
            for (const position of ['PG', 'SG', 'SF', 'PF', 'C']) {
                if (this[position] !== null) count++;
            }
            return count;
        }
    }
});
