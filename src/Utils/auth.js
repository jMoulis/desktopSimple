import decode from 'jwt-decode';

class Auth {
  token = '';
  constructor(token) {
    this.token = token;
  }
  decodeToken = () => decode(this.token);
  saveLocalStorage() {
    localStorage.setItem('token', this.token);
  }
  getTokenFromLocalStorage = () => localStorage.getItem('token');
}

export default Auth;
