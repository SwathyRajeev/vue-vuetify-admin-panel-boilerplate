<template>
  <div>
    <v-container>
      <v-dialog
        v-model="alert.type"
        max-width="390"
        transition="scale-transition"
      >
        <v-card>
          <v-card-title :class="alert.color">
            {{ alert.title }}
          </v-card-title>

          <v-card-text>
            {{ alert.message }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="alert.type = false">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
        :headers="headers"
        :items="user"
        sort-by="user"
        class="elevation-1 col-12 col-md-12"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>User</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="70%">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon> add </v-icon>
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="4">
                        <v-text-field
                          :rules="[(v) => !!v || 'First Name is required']"
                          required
                          outlined
                          v-model="editedItem.firstName"
                          label="First Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="4">
                        <v-text-field
                          :rules="[(v) => !!v || 'Last Name is required']"
                          required
                          outlined
                          v-model="editedItem.lastName"
                          label="Last Name"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="4">
                        <v-text-field
                          :rules="[(v) => !!v || 'Phone Number is required']"
                          required
                          outlined
                          v-model="editedItem.phone"
                          label="Phone Number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="4">
                        <v-text-field
                          :rules="[(v) => !!v || 'Password is required']"
                          required
                          outlined
                          v-model="editedItem.password"
                          label="Password"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="4">
                        <v-text-field
                          :rules="[(v) => !!v || 'Email is required']"
                          required
                          outlined
                          v-model="editedItem.email"
                          label="Email"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="4">
                        <v-select
                          outlined
                          v-validate="'required'"
                          :items="states"
                          item-text="label"
                          item-value="id"
                          v-model="editedItem.state"
                          label="State"
                          data-vv-name="label"
                          required
                        ></v-select>
                      </v-col>

                      <v-col cols="12" sm="12" md="4">
                        <v-text-field
                          :rules="[(v) => !!v || 'Address is required']"
                          required
                          outlined
                          v-model="editedItem.address"
                          label="Address"
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        md="2"
                        class="pt-7 pl-10"
                        align-self="right"
                      >
                        Role
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="2"
                        v-for="r in allRoles"
                        :key="r"
                      >
                        <v-checkbox
                          v-model="editedItem.role"
                          :label="r.role_name"
                          :value="r.id"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogMap" max-width="800px">
              <v-card>
                <v-card-title class="headline">Select Date</v-card-title>

                <v-row justify="center">
                  <v-date-picker
                    v-model="editedItem1.date"
                    year-icon="mdi-calendar-blank"
                    prev-icon="mdi-skip-previous"
                    next-icon="mdi-skip-next"
                  ></v-date-picker>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeMap"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="getPlot">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <!-- <template v-slot:item.actions="{ item }"> -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            class="ma-2 primary--text"
            outlined
            @click="dialogMapItem(item)"
          >
            View Map
          </v-btn>
          <v-btn
            small
            class="ma-2 red--text "
            style="width:100px;"
            outlined
            v-if="item.activeStatus"
            @click="blockItem(item)"
          >
            Block
          </v-btn>
          <v-btn
            small
            class="ma-2 green--text"
            style="width:100px;"
            outlined
            v-else
            @click="unBlockItem(item)"
          >
            Unblock
          </v-btn>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          {{ item.firstName }} {{ item.lastName }}
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-container>
    <v-container v-if="isLocation">
      <v-card class="ma-5">
        <div>
          <!-- :center="LatLng(47.41322, -1.219482)" -->
          <l-map
            :zoom="zoom"
            :center="getMapCenter(userLoc[0].location)"
            style="height:500px; width: 100%"
          >
            <l-tile-layer :url="url" />
            <l-marker
              v-for="(loc, i) in userLoc"
              :key="i"
              :lat-lng="getLocation(loc.location)"
            >
              <l-tooltip
                :options="{
                  permanent: true,
                  interactive: true,
                }"
              >
                <div>{{ loc.current_date }}</div>
              </l-tooltip>
            </l-marker>
            <l-icon-default :image-path="iconUrl" />
          </l-map>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
// import axios from "axios";
import axios from "axios";
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,

    LTooltip,
  },
  data: () => ({
    alert: {
      color: "info",
      title: null,
      message: null,
      type: null,
    },

    // map
    zoom: 10,

    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    marker: latLng(47.41322, -1.219482),

    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "User ID",
        align: "start",
        sortable: true,
        value: "user_id",
      },
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
      },
      {
        text: "Email",
        align: "start",
        sortable: true,
        value: "email",
      },
      {
        text: "Address",
        align: "start",
        sortable: true,
        value: "address",
      },
      {
        text: "State",
        align: "start",
        sortable: true,
        value: "state",
      },

      {
        text: "Phone",
        align: "start",
        sortable: true,
        value: "phone",
      },

      { text: "Actions", value: "actions", sortable: false, align: "end" },
    ],
    user_id: "",
    dialogMap: false,
    isLocation: false,
    user: [],
    userLoc: [],
    allRoles: [],
    states: [],
    editedIndex: -1,
    editedItem1: {
      date: new Date().toISOString().substr(0, 10),
    },
    editedItem: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      photo: "NA",
      region: 0,
      state: "",
      role: 0,
      password: "123@Eastern",
    },
    defaultItem: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      photo: "NA",
      region: 0,
      state: "",
      role: 0,
      password: "123@Eastern",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    getCategory() {},

    async initialize() {
      axios
        .get("user")
        .then((res) => {
          this.user = res.data;
          this.myloadingvariable = false;
          console.log(this.user);
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get("states")
        .then((res) => {
          this.states = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get("roles")
        .then((res) => {
          this.allRoles = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    dialogMapItem(item) {
      this.user_id = item.user_id;
      this.dialogMap = true;
    },
    async deleteItemConfirm() {
      this.user.splice(this.editedIndex, 1);
      await axios
        .patch("user/delete", this.editedItem)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      this.closeDelete();
    },

    getLocation(loc) {
      return latLng(loc.lat, loc.long);
    },
    getMapCenter(loc) {
      return [loc.lat, loc.long];
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeMap() {
      this.dialogMap = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    getPlot() {
      axios
        .patch(`user-location/date/${this.user_id}`, this.editedItem1)
        .then((res) => {
          this.userLoc = res.data;
          this.myloadingvariable = false;
          console.log(this.userLoc);
          if (res.data.length > 0) {
            this.isLocation = true;
          } else {
            this.alert.color = "red--text";
            this.alert.title = "Sorry";
            this.alert.message =
              "No Location found for selected user in this date";
            this.alert.type = true;
            // this.$swal(
            //   "Sorry, No Location found for selected user in this date"
            // );
          }
          this.closeMap();
        })
        .catch((err) => {
          console.log(err);
          this.closeMap();
        });
      this.dialogMap = false;
    },
    blockItem(item) {
      axios
        .patch(`user/block/${item.user_id}`)
        .then((res) => {
          console.log(res.data);
          this.initialize();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    unBlockItem(item) {
      axios
        .patch(`user/un-block/${item.user_id}`)
        .then((res) => {
          console.log(res.data);
          this.initialize();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async save() {
      if (
        this.editedItem.firstName === null ||
        this.editedItem.firstName === "" ||
        this.editedItem.firstName === undefined ||
        this.editedItem.lastName === null ||
        this.editedItem.lastName === "" ||
        this.editedItem.lastName === undefined
      ) {
        this.alert.color = "red--text";
        this.alert.title = "Error";
        this.alert.message = "Please fill Both first name & last name";
        this.alert.type = true;
      } else {
        this.editedItem.state = this.editedItem.state + "";
        if (this.editedItem.phone === null || this.editedItem.phone === "") {
          this.alert.color = "red--text";
          this.alert.title = "Error";
          this.alert.message = "Please fill phone";
          this.alert.type = true;
        } else if (
          this.editedItem.address === null ||
          this.editedItem.address === ""
        ) {
          this.alert.color = "red--text";
          this.alert.title = "Error";
          this.alert.message = "Please fill address";
          this.alert.type = true;
        } else if (
          this.editedItem.email === null ||
          this.editedItem.email === ""
        ) {
          this.alert.color = "red--text";
          this.alert.title = "Error";
          this.alert.message = "Please fill email";
          this.alert.type = true;
        } else if (
          this.editedItem.state === null ||
          this.editedItem.state === ""
        ) {
          this.alert.color = "red--text";
          this.alert.title = "Error";
          this.alert.message = "Please select state";
          this.alert.type = true;
        } else if (
          this.editedItem.role === null ||
          this.editedItem.role === 0
        ) {
          this.alert.color = "red--text";
          this.alert.title = "Error";
          this.alert.message = "Please select role";
          this.alert.type = true;
        } else if (
          this.editedItem.password === null ||
          this.editedItem.password === ""
        ) {
          this.alert.color = "red--text";
          this.alert.title = "Error";
          this.alert.message = "Please fill password";
          this.alert.type = true;
        } else {
          if (this.editedIndex > -1) {
            Object.assign(this.user[this.editedIndex], this.editedItem);
            // api.updateCategory(
            //   this.user[this.editedIndex].category_id,
            //   this.editedItem
            // );

            await axios
              .patch("user", this.editedItem)
              .then((res) => {
                console.log(res.data);
                this.initialize();
                this.alert.color = "green--text";
                this.alert.title = "Success";
                this.alert.message = "Data saved";
                this.alert.type = true;
              })
              .catch((err) => {
                console.log(err);
                this.alert.color = "red--text";
                this.alert.title = "Error";
                this.alert.message = err.message;
                this.alert.type = true;
              });
          } else {
            await axios
              .post("user", this.editedItem)
              .then((res) => {
                console.log(res.data);
                this.initialize();
                this.alert.color = "green--text";
                this.alert.title = "Success";
                this.alert.message = "Data saved";
                this.alert.type = true;
              })
              .catch((err) => {
                console.log(err);
                this.alert.color = "red--text";
                this.alert.title = "Error";
                this.alert.message = err.message;
                this.alert.type = true;
              });
          }
          this.close();
        }
      }
    },
  },
};
</script>

<style lang="scss">
.vue2leaflet-map {
  z-index: 1;
}
</style>
