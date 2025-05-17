const logoModules = import.meta.glob('../assets/*.svg', { eager: true });

export const useLogoStore = () => {
  /**
   * @param {string} abbreviation 
   * @returns {string|null}
   */
  const getTeamLogo = (abbreviation) => {
    try {
      const path = `../assets/${abbreviation}.svg`;
      
      if (logoModules[path]) {
        const module = logoModules[path];
        return module.default;
      }
    } catch (error) {
      console.error(`Error getting logo for ${abbreviation}:`, error);
    }
    
    return null;
  };

  return {
    getTeamLogo
  };
};
