<template>
  <layout>
    <template #header>
      <navbar/>
    </template>
    <h1>Обсуждения</h1>
  </layout>
</template>

<script>
import Layout from '../Layout'
import Navbar from '../Navbar'

export default {
  name: 'Discuss',
  components: {
    'layout': Layout,
    'navbar': Navbar
  }
}
</script>
