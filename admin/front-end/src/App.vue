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

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import TestsView from '@/views/TestsView.vue';
import Component from 'vue-class-component';
import { speedActuatorStoreModule } from './store/speed-actuator-store';
import { getBackendUrl } from './constants/utils';

@Component({
  name: 'App',
  components: { TestsView },
})
export default class App extends Vue {
  drawer = true;
  items: Array<MenuItem> = [
    {
      routePath: '/',
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
