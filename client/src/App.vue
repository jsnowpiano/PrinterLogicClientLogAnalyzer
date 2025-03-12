<template>
  <v-app>
    <v-card class="full-height-card">
      <v-layout class="full-height-layout">
        <v-navigation-drawer
          class="drawer-background"
          theme="dark"
          permanent
        >
          <v-list nav>
            <v-list-item prepend-icon="mdi-email" title="Inbox" value="inbox"></v-list-item>
            <v-list-item prepend-icon="mdi-account-supervisor-circle" title="Supervisors" value="supervisors"></v-list-item>
            <v-list-item prepend-icon="mdi-clock-start" title="Clock-in" value="clockin"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 300px"></v-main>
      </v-layout>
    </v-card>
  </v-app>
</template>

<style>
.full-height-card {
  height: 100vh;
}

.full-height-layout {
  height: 100%;
}

.drawer-background {
  background-image: url('./assets/backgroundnav.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>