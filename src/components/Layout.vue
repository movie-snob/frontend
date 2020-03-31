<template>
  <div>
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot />
      <footer class="logo-container">
        <img src="~@/images/logo.png">
      </footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
footer {
  & img {
    width: 100px;
  }
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>

<script>
export default {
  name: 'Layout'
}
</script>
