<template>
  <div class="login">
    <b-container>
      <b-row>
        <b-col>
          <h1>Регистрация</h1>
        </b-col>
      </b-row>
      <b-form>
        <b-form-group>
          <b-form-input
            autofocus
            type="text"
            placeholder="Имя"/>
        </b-form-group>
        <b-form-group>
          <b-form-input
            type="email"
            required
            placeholder="Почта"
            autocomplete="email"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false" />
        </b-form-group>
        <b-form-group>
          <b-form-input type="password" required placeholder="Пароль" autocomplete="current-password" />
          <b-button block variant="primary">Зарегистрироваться</b-button>
          <router-link class="login" to="/login">войти</router-link>
        </b-form-group>
      </b-form>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Register'
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
