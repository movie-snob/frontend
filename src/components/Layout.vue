<template>
  <div>
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <b-container>
        <slot></slot>
      </b-container>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>
