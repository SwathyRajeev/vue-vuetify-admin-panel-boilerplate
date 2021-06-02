<template>
  <nav>
    <v-app-bar app class="" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span> {{ title }} </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
      </v-menu>

      <v-text text>
        <span class="font-weight-light">{{ phone }} </span>
      </v-text>
      <v-btn text @click="logout">
        <span>LogOut</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app dark class="">
      <v-layout column align-center>
        <!-- <v-flex class="mt-10">
          <img
            src="../assets/easternname.png"
            alt="Eastern"
            width="180px;"
            height="50px;"
          />
        </v-flex> -->
      </v-layout>

      <v-list color="transparent">
        <v-list-group
          :value="true"
          prepend-icon="admin_panel_settings"
          active-class="orange--text ma-2 "
        >
          <template v-slot:activator>
            <v-list-item-title>General</v-list-item-title>
          </template>
          <v-sheet rounded="lg" class="ma-5" dark>
            <v-list-item
              v-for="md in masterData"
              :key="md.text"
              router
              :to="md.route"
              rounded="lg"
              active-class="orange--text ma-2"
            >
              <v-list-item-action>
                <v-icon>{{ md.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ md.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-sheet>
        </v-list-group>

        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
          rounded="lg"
          active-class="orange--text ma-2"
        >
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer class="justify-center" inset app>
      <span class="ma-3"> &copy; </span>
      <span class="ma-0"> {{ new Date().getFullYear() }} </span>
      <strong class="ma-3"
        ><router-link to="/link">Footer</router-link>
      </strong>
      <span class="ma-0"> All rights reserved. </span>
    </v-footer>
  </nav>
</template>
<script>
export default {
  data: () => ({
    drawer: true,
    phone: "",
    title: "Admin Panel",
    isSuperAdmin: false,
    masterData: [
      { icon: "public", text: "State", route: "/state" },
      { icon: "vpn_lock", text: "District", route: "/district" },
    ],
    links: [
      {
        icon: "align_horizontal_right",
        text: "Link 1",
        route: "/link1",
      },
      { icon: "turned_in_not", text: "User", route: "/user" },

      { icon: "leaderboard", text: "Link 2", route: "/link2" },
    ],
  }),
  components: {},
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      let role = localStorage.getItem("role");
      if (role === "Admin") {
        this.isSuperAdmin = true;
      }
      this.phone = localStorage.getItem("user_id");
    },

    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
  watch: {
    $route(to, from) {
      console.log(to);
      console.log(from);
      this.title = to.name || "Project Name";
    },
  },
};
</script>