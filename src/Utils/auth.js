import decode from 'jwt-decode';

class Auth {
  token = '';
  constructor(token) {
    this.token = token;
    this.saveLocalStorage(this.token);
  }
  decodeToken = () => decode(this.token);
  saveLocalStorage() {
    localStorage.setItem('token', this.token);
  }
  getTokenFromLocalStorage = () => localStorage.getItem('token');
}

export default Auth;
