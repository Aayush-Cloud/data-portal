<template>
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <img src="../assets/default-avatar.png" alt="Profile Picture" />
        </div>
        <div class="profile-info">
          <h1>Test User</h1>
          <p class="role">System Administrator</p>
        </div>
      </div>
  
      <!-- Profile Details -->
      <div class="profile-content">
        <div class="profile-section">
          <h2>Account Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Username</label>
              <p>testuser</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>testuser@company.com</p>
            </div>
            <div class="info-item">
              <label>Role</label>
              <p>System Administrator</p>
            </div>
            <div class="info-item">
              <label>Last Login</label>
              <p>{{ new Date().toLocaleString() }}</p>
            </div>
          </div>
        </div>
  
        <!-- Access Level -->
        <div class="profile-section">
          <h2>System Access</h2>
          <div class="access-badges">
            <span class="badge admin">Admin Access</span>
            <span class="badge dashboard">Dashboard</span>
            <span class="badge analytics">Analytics</span>
            <span class="badge maintenance">Maintenance</span>
          </div>
        </div>
  
        <!-- Recent Activity -->
        <div class="profile-section">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div class="activity-item">
              <span class="time">Just now</span>
              <span class="action">Viewed OEE Dashboard</span>
            </div>
            <div class="activity-item">
              <span class="time">2 hours ago</span>
              <span class="action">Updated Machine Status</span>
            </div>
            <div class="activity-item">
              <span class="time">1 day ago</span>
              <span class="action">Generated Monthly Report</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserProfile',
    setup() {
      // Dummy user data
      const userData = {
        username: 'testuser',
        password: 'testpassword', // In real app, never expose password
        email: 'testuser@company.com',
        role: 'System Administrator',
        permissions: ['admin', 'dashboard', 'analytics', 'maintenance']
      };
  
      return {
        userData
      };
    }
  };
  </script>
  
  <style scoped>
  .profile-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    background: var(--surface-ground);
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background: var(--surface-card);
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .profile-avatar img {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    object-fit: cover;
    border: 4px solid var(--primary-color);
  }
  
  .profile-info h1 {
    margin: 0;
    color: var(--text-color);
    font-size: 2rem;
  }
  
  .role {
    color: var(--text-color-secondary);
    font-size: 1.1rem;
  }
  
  .profile-content {
    margin-top: 2rem;
    display: grid;
    gap: 2rem;
  }
  
  .profile-section {
    background: var(--surface-card);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .info-item label {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  .info-item p {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-color);
  }
  
  .access-badges {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
  
  .badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .badge.admin { background: #ef5350; color: white; }
  .badge.dashboard { background: #42b883; color: white; }
  .badge.analytics { background: #2196f3; color: white; }
  .badge.maintenance { background: #ff9800; color: white; }
  
  .activity-list {
    margin-top: 1rem;
  }
  
  .activity-item {
    padding: 1rem;
    border-bottom: 1px solid var(--surface-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .time {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
  }
  
  .action {
    color: var(--text-color);
    font-weight: 500;
  }
  </style>