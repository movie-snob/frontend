<template>
  <div class="login">
    <b-container>
      <b-row>
        <b-col>
          <h1>Регистрация</h1>
        </b-col>
      </b-row>
      <b-form @submit="register">
        <b-form-group>
          <b-form-input
            autofocus
            type="text"
            name="name"
            placeholder="Имя"/>
        </b-form-group>
        <b-form-group>
          <b-form-input
            type="email"
            name="email"
            required
            placeholder="Почта"
            autocomplete="email"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false" />
        </b-form-group>
        <b-form-group>
          <b-form-input name="password" type="password" required placeholder="Пароль" autocomplete="current-password" />
          <b-button :disabled="loading" type="submit" block variant="primary">
            <b-spinner v-if="loading" small></b-spinner>
            Зарегистрироваться
          </b-button>
          <router-link class="login" to="/login">войти</router-link>
        </b-form-group>
      </b-form>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  name: 'Register',
  methods: {
    async register(e) {
      const formData = new FormData(e.target)
      const [name, email, password] = [formData.get('name'), formData.get('email'), formData.get('password')]

      e.preventDefault()

      this.loading = true
      await this.$store.dispatch('Register', { name, email, password })

      this.$router.push('/')
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-top: 50px;
  text-align: center;
}
form {
  margin: 0 auto;
  text-align: center;
  width: 300px;
}
input[type="password"] {
  margin-bottom: 10px;
}
.form-control:focus {
  position: relative;
  z-index: 2;
}
.login {
  font-size: 14px;
}
</style>
