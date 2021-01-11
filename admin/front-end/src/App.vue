<template>
  <v-app>
    <v-main>
      <TestsView />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import TestsView from '@/views/TestsView.vue';
import Component from 'vue-class-component';

@Component({
  name: 'App',
  components: { TestsView },
})
export default class App extends Vue {}
</script>
