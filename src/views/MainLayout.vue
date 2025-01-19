<template>
    <div class="layout-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav>
          <ul class="menu">
            <li>
              <router-link to="/app/dashboard" class="menu-item" active-class="active">
                <i class="pi pi-home"></i>
                <span>Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link to="/app/profile" class="menu-item" active-class="active">
                <i class="pi pi-user"></i>
                <span>Profile</span>
              </router-link>
            </li>
            <li>
              <router-link to="/app/graphs" class="menu-item" active-class="active">
                <i class="pi pi-chart-bar"></i>
                <span>Graphs & Charts</span>
              </router-link>
            </li>
            <li>
              <router-link to="/app/visualizations" class="menu-item" active-class="active">
                <i class="pi pi-chart-pie"></i>
                <span>Visualizations</span>
              </router-link>
            </li>
            <li>
              <router-link to="/app/error-logs" class="menu-item" active-class="active">
                <i class="pi pi-exclamation-circle"></i>
                <span>Error Logs</span>
              </router-link>
            </li>
            <li>
              <router-link to="/app/alert" class="menu-item" active-class="active">
                <i class="pi pi-bell"></i>
                <span>Alerts</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MainLayout',
  };
  </script>
  
  <style scoped>
  /* Layout Wrapper */
  .layout-wrapper {
    display: flex;
    min-height: 100vh;
    background-color: var(--background-color); /* Dynamic background */
    color: var(--text-color);
  }
  
  /* Sidebar Styles */
  .sidebar {
    width: 250px;
    background-color: var(--menu-bg);
    color: var(--menu-text);
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  /* Sidebar Menu */
  .menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    color: var(--menu-text);
    text-decoration: none;
    font-size: 1rem;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .menu-item i {
    margin-right: 1rem;
    font-size: 1.2rem;
  }
  
  .menu-item:hover {
    background-color: var(--menu-hover-bg);
    color: var(--primary-color);
  }
  
  .menu-item.active {
    background-color: var(--menu-hover-bg);
    color: var(--primary-color);
    font-weight: bold;
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    padding: 2rem;
    background-color: var(--background-color);
    color: var(--text-color);
  }
  
  /* Smooth transitions */
  .layout-wrapper,
  .sidebar,
  .main-content {
    transition: background-color 0.3s, color 0.3s;
  }
  </style>
  