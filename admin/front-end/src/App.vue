<template>
  <v-app scroll>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item
          link
          :to="item.routePath"
          v-for="item in items"
          :key="item.name"
        >
          <v-list-item-action>
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid class="ma-0">
        <router-view></router-view>
      </v-container>
    </v-content>
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
export default class App extends Vue {
  drawer = true;
  items = [
    {
      routePath: '/',
      name: 'tests',
      label: 'Tests',
      icon: 'pencil',
    },
  ];
}
</script>
