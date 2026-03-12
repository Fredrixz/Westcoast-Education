import { api, q } from './api.js';

const USER_KEY = 'wce_user';

export const auth = {
  getUser() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(USER_KEY);
    window.location.href = 'index.html';
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  async login(email, password) {
    const users = await api.get(`/customers${q({ email })}`);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Fel e-post eller lösenord.');
    this.setUser(user);
    return user;
  },

  async register(data) {
    const existing = await api.get(`/customers${q({ email: data.email })}`);
    if (existing.length > 0) throw new Error('E-postadressen används redan.');
    const user = await api.post('/customers', data);
    this.setUser(user);
    return user;
  },
};
