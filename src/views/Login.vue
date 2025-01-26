<template>
  <div class="container">
    <div class="card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label for="username">Username</label>
          <InputText
            id="username"
            v-model="form.username"
            required
            placeholder="Enter your username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <Password
            id="password"
            v-model="form.password"
            required
            feedback="false"
            placeholder="Enter your password"
          />
        </div>
        <div v-if="error" class="alert">
          <Message severity="error" :text="error" />
        </div>
        <div class="button-wrapper">
          <Button type="submit" label="Login" :loading="loading" class="w-full" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { login } from "../api/auth";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Message from "primevue/message";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      loading: false,
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      this.error = "";
      this.loading = true;
      try {
        const { token } = await login(this.form);
        localStorage.setItem("jwtToken", token);
        this.$router.push({ name: "dashboard" });
      } catch (err) {
        console.log("Error:", err.response?.data?.message || "Login failed");
        this.error = err.response?.data?.message || "Login failed";
      } 
      finally {
        this.loading = false;
      }
    },
  },
  components: {
    InputText,
    Password,
    Button,
    Message,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--surface-ground);
}

.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--text-color);
  font-weight: 500;
}

:deep(.p-password),
:deep(.p-inputtext) {
  width: 100%;
}

.button-wrapper {
  margin-top: 2rem;
}

.alert {
  margin: 1rem 0;
}
</style>