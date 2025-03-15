<script setup>
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';
import Home from '@/components/Home.vue';

const showLogin = ref(false);
const showCreateAccount = ref(false);
const username = ref('');
const password = ref('');
const email = ref('');
const loginError = ref(''); // Ref to store the login error message
const createAccountError = ref(''); // Ref to store the create account error message

onMounted(() => {
  if (!Cookies.get('userLoggedIn')) {
    showLogin.value = true;
  }
});

const handleLogin = () => {
  // Perform login logic here
  fetch('https://printerlogicclientloganalyzer.onrender.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Cookies.set('userLoggedIn', 'true', { expires: 7 }); // Set cookie to expire in 7 days
        showLogin.value = false;
        loginError.value = ''; // Clear the error message on successful login
      } else {
        loginError.value = 'Login failed: ' + data.message; // Set the error message
        console.error('Login failed:', data.message);
      }
    })
    .catch(error => {
      loginError.value = 'Error logging in: ' + error.message; // Set the error message
      console.error('Error logging in:', error);
    });
};

const handleLogout = () => {
  Cookies.remove('userLoggedIn');
  showLogin.value = true;
};

const handleCreateAccount = () => {
  // Validate username and password length
  if (username.value.length < 4 || password.value.length < 4) {
    createAccountError.value = 'Username and password must be at least 4 characters long';
    return;
  }

  fetch('https://printerlogicclientloganalyzer.onrender.com/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('User created:', data);
      showCreateAccount.value = false;
      showLogin.value = true;
      createAccountError.value = ''; // Clear the error message on successful account creation
    })
    .catch(error => {
      createAccountError.value = 'Error creating user: ' + error.message; // Set the error message
      console.error('Error creating user:', error);
    });
};

const showCreateAccountForm = () => {
  showLogin.value = false;
  showCreateAccount.value = true;
};

const showLoginForm = () => {
  showCreateAccount.value = false;
  showLogin.value = true;
};
</script>

<template>
  <v-app>
    <v-card class="full-height-card">
      <v-layout class="full-height-layout">
        <v-navigation-drawer
          class="drawer-background"
          theme="dark"
          permanent
        >
          <v-list nav>
            <v-img src="./assets/vasion_logo_white.png" class="pa-6"></v-img>
            <RouterLink to="/PrinterLogicClientLogAnalyzerClient/" class="custom-link">
              <v-list-item prepend-icon="mdi-home" title="Home" value="home"></v-list-item>
            </RouterLink>
            <RouterLink to="/PrinterLogicClientLogAnalyzerClient/analyze" class="custom-link">
              <v-list-item prepend-icon="mdi-chart-bell-curve" title="Analyze Logs" value="analyze"></v-list-item>
            </RouterLink>
            <RouterLink to="/PrinterLogicClientLogAnalyzerClient/articles" class="custom-link">
              <v-list-item prepend-icon="mdi-clipboard" title="Articles" value="articles"></v-list-item>
            </RouterLink>
            <v-list-item prepend-icon="mdi-logout" title="Logout" value="Logout" @click="handleLogout"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main class="scrollable-content">
          <router-view />
        </v-main>
      </v-layout>
    </v-card>

    <div v-if="showLogin" class="overlay">
      <div class="login-form">
        <h2>Login</h2>
        <v-text-field label="Email" v-model="email"></v-text-field>
        <v-text-field label="Password" type="password" v-model="password"></v-text-field>
        <v-btn @click="handleLogin">Login</v-btn>
        <v-btn @click="showCreateAccountForm">Create Account</v-btn>
        <p v-if="loginError" class="error-message">{{ loginError }}</p> <!-- Display the error message -->
      </div>
    </div>

    <div v-if="showCreateAccount" class="overlay">
      <div class="login-form">
        <h2>Create Account</h2>
        <v-text-field label="Email" v-model="email"></v-text-field>
        <v-text-field label="Password" type="password" v-model="password"></v-text-field>
        <v-btn @click="handleCreateAccount">Create Account</v-btn>
        <v-btn @click="showLoginForm">Back to Login</v-btn>
        <p v-if="createAccountError" class="error-message">{{ createAccountError }}</p> <!-- Display the error message -->
      </div>
    </div>
  </v-app>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.full-height-card {
  height: 100vh;
}

.full-height-layout {
  height: 100%;
}

.drawer-background {
  background-image: url('./assets/backgroundnav.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.custom-link {
  color: white !important;
  text-decoration: none;
}

.custom-link .v-list-item__title {
  color: white !important;
}

.scrollable-content {
  overflow-y: auto;
  height: 100%;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px; /* Adjust the width as needed */
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>