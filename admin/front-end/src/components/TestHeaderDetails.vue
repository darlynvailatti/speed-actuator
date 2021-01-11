<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="3">
          <v-chip class="ma-1">
            {{ test.code }}
          </v-chip>
          <v-chip class="ma-1">
            {{ test.state }}
          </v-chip>
          <v-chip class="ma-1">
            {{ test.template.description }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'TestHeaderDetails',
  components: {},
})
export default class TestHeaderDetails extends Vue {
  @Prop()
  test: any;

  testCode = '';
}
</script>
