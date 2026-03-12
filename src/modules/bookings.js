import { api, q } from './api.js';

export const bookings = {
  create(data) {
    return api.post('/bookings', { ...data, bookedAt: new Date().toISOString() });
  },

  getByCourse(courseId) {
    return api.get(`/bookings${q({ courseId })}`);
  },

  getAll() {
    return api.get('/bookings');
  },
};
