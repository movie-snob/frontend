<template>
  <div class="login">
    <b-container>
      <b-row>
        <b-col>
          <h1>Вход</h1>
        </b-col>
      </b-row>
      <b-form>
        <b-form-group>
          <b-form-input
            autofocus
            type="email"
            required
            placeholder="Почта"
            autocomplete="email"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false" />
          <b-form-input type="password" required placeholder="Пароль" autocomplete="current-password" />
          <b-button block variant="primary">Войти</b-button>
          <router-link class="register" to="/register">регистрация</router-link>
        </b-form-group>
      </b-form>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Login'
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
