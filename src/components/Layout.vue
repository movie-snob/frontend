<template>
  <div>
    <header>
      <slot name="header" />
    </header>
    <main>
      <b-container>
        <slot />
      </b-container>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>
