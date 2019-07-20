<template>
  <layout>
    <template #header>
      <navbar/>
    </template>
    <h1>Архив</h1>
  </layout>
</template>

<script>
import Layout from '../Layout'
import Navbar from '../Navbar'

export default {
  name: 'Archive',
  components: {
    'layout': Layout,
    'navbar': Navbar
  }
}
</script>
