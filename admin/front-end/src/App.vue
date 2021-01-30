<template>
  <v-app scroll>
    <v-navigation-drawer v-model="drawer" app fluid mini-variant>
      <v-container fluid>
        <v-btn
          icon
          v-for="item in items"
          :key="item.name"
          :to="item.routePath"
          class="mb-2"
        >
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </v-container>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { TESTS_VIEW_PATH } from './router/index';

@Component({
  name: 'App',
  components: {},
})
export default class App extends Vue {
  drawer = true;
  items: Array<MenuItem> = [
    {
      routePath: `${TESTS_VIEW_PATH}`,
      name: 'tests',
      label: 'Tests',
      icon: 'mdi-pencil',
    },
  ];

  private routeToItem(item: MenuItem) {
    this.$router.resolve(item.routePath);
  }
}

export interface MenuItem {
  routePath: string;
  name: string;
  label: string;
  icon: string;
}
</script>
