<template>
  <layout>
    <template #header>
      <navbar/>
    </template>
    <h1>Обсуждения</h1>
    <h2>Онлайн пользователи</h2>
    <ul>
      <li v-for="user in onlineUsers" :key="user.id">{{ user.name }}</li>
    </ul>
  </layout>
</template>

<script>
import Layout from '../Layout'
import Navbar from '../Navbar'

import { mapGetters } from 'vuex'
import t from 'typy'

export default {
  name: 'Discuss',
  data() {
    return {
      socket: null
    }
  },
  components: {
    'layout': Layout,
    'navbar': Navbar
  },
  computed: {
    ...mapGetters([
      'onlineUsers'
    ])
  },
  mounted() {

  },
  beforeDestroy() {
    this.socket.close()
  }
}
</script>
