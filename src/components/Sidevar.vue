<template>
  <v-navigation-drawer app permanent expand-on-hover mini-variant>
    <template v-slot:prepend>
      <v-list-item class="d-flex justify-center align-center">
        <v-avatar color="primary" size="40">
          <v-icon dark>mdi-account</v-icon>
        </v-avatar>
      </v-list-item>
    </template>

    <v-list dense nav>
      <v-list-item-group v-model="selectedItem">
        <v-list-item link to="/comensales" class="d-flex justify-center align-center">
          <v-list-item-icon>
            <v-icon color="primary">mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Comensales</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/mesas" class="d-flex justify-center align-center">
          <v-list-item-icon>
            <v-icon color="primary">mdi-table-chair</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mesas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/reservas" class="d-flex justify-center align-center">
          <v-list-item-icon>
            <v-icon color="primary">mdi-calendar-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Reservas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>


<script>
export default {
  name: "Sidevar",
  data() {
    return {
      selectedItem: null,
    };
  },
};
</script>
