const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  // Complaint endpoints
  async getComplaints() {
    return this.request('/complaints');
  }

  async createComplaint(complaintData) {
    return this.request('/complaints', {
      method: 'POST',
      body: complaintData,
    });
  }

  // Club endpoints
  async getClubs() {
    return this.request('/clubs');
  }

  async createClub(clubData) {
    return this.request('/clubs', {
      method: 'POST',
      body: clubData,
    });
  }

  // Post endpoints
  async getPosts() {
    return this.request('/api/posts');
  }

  async createPost(postData) {
    return this.request('/api/posts', {
      method: 'POST',
      body: postData,
    });
  }

  // Election endpoints
  async getElections() {
    return this.request('/api/elections');
  }

  async createElection(electionData) {
    return this.request('/api/elections', {
      method: 'POST',
      body: electionData,
    });
  }

  async voteInElection(electionId, candidateId) {
    return this.request(`/api/elections/${electionId}/vote`, {
      method: 'POST',
      body: { candidateId },
    });
  }

  // Contact endpoints
  async submitContactMessage(contactData) {
    return this.request('/api/contact', {
      method: 'POST',
      body: contactData,
    });
  }
}

export const apiService = new ApiService();
export default apiService;