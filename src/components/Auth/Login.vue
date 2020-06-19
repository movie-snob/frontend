<template>
  <div class="login">
    <b-container>
      <b-row>
        <b-col>
          <h1>Вход</h1>
        </b-col>
      </b-row>
      <b-form @submit="login">
        <b-alert
          variant="danger"
          :show="showError"
        >
          Логин или пароль не верны
        </b-alert>
        <b-form-group>
          <b-form-input
            name="email"
            autofocus
            type="email"
            required
            placeholder="Почта"
            autocomplete="email"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
          <b-form-input
            name="password"
            type="password"
            required
            placeholder="Пароль"
            autocomplete="current-password"
          />
          <b-button
            type="submit"
            block
            :disabled="loading"
            variant="primary"
          >
            <b-spinner
              v-if="loading"
              small
            />
            Войти
          </b-button>
          <router-link
            class="register"
            to="/register"
          >
            регистрация
          </router-link>
        </b-form-group>
      </b-form>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      showError: false
    }
  },
  methods: {
    async login(e) {
      const formData = new FormData(e.target)
      const [email, password] = [formData.get('email'), formData.get('password')]

      e.preventDefault()

      this.showError = false
      this.loading = true

      try {
        await this.$store.dispatch('Login', { email, password })
      } catch {
        this.showError = true
      } finally {
        this.loading = false
      }

      this.$router.push('/movies/suggested')
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
@media (prefers-color-scheme: dark) {
  html, body, nav {
    background: #1f1f1f !important;
    color: #bfbfbf;
  }
  .form-control, .form-control:focus {
    background: transparent;
    border-color: #3b454e;
    color: #babfc5;
  }
}
h1 {
  margin-top: 50px;
  text-align: center;
}
form {
  margin: 0 auto;
  text-align: center;
  width: 300px;
}
input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
input[type="password"] {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-bottom: 10px;
}
.form-control:focus {
  position: relative;
  z-index: 2;
}
.register {
  font-size: 14px;
}
</style>
