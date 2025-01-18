export default {
    getToken() {
      return localStorage.getItem('jwtToken');
    },
    
    getAuthHeader() {
      return {
        Authorization: `Bearer ${this.getToken()}`
      };
    }
  };