<template>
  <div id="app">
    <NavigationBar />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import NavigationBar from './components/NavigationBar.vue'
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
