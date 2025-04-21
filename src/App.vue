<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    <div class="d-flex align-center">
      <v-icon class="mr-2" color="primary">mdi-view-dashboard</v-icon>
      <span class="text-h6 font-weight-bold">PANEL ADMIN</span>
    </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <!-- Barra Lateral -->
      <Sidevar/>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Sidevar from './components/Sidevar';

export default {
  name: 'App',

  components: {
    Sidevar,
  },

  data: () => ({
    //
  }),
};
</script>
