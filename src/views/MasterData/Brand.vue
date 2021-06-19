<template>
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
    <template cols="6" sm="12" md="6">
      <v-data-table
        :headers="headers"
        :items="brand"
        class="elevation-3"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Brand</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>

            <v-text-field
              class="font-size: 12px; mx-8"
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>

            <v-dialog v-model="dialog" max-width="400px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  New Item
                </v-btn>
              </template>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card>
                  <v-card-title>Brand</v-card-title>
                  <v-card-text class="compact-form">
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="px-2 py-0">
                          <v-text-field
                            class="font-size: 12px;"
                            outlined
                            height="20"
                            :rules="nameRules"
                            v-model="editedItem.label"
                            label="Brand"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="12" md="9"> </v-col>
                        <v-col>
                          <v-btn color="blue darken-1" text @click="close">
                            Cancel
                          </v-btn>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="save"
                            :disabled="!valid"
                          >
                            Save
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-form>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </template>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    elapse: null,
    alert: {
      color: "info",
      title: null,
      message: null,
      type: null,
    },
    valid: true,
    dialog: false,
    menu2: false,
    menu3: false,
    dialogDelete: false,
    expanded: [],
    singleExpand: true,
    search: "",
    headers: [
      { text: "Brand", value: "label" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    brand: [],
    editedIndex: -1,
    editedItem: {
      label: "",
      id: 0,
    },

    defaultItem: {
      label: "",
      id: 0,
    },

    nameRules: [
      (v) => !!v || "Brand is required",
      (v) => (v && v.length <= 20) || "Brand must be less than 20 characters",
    ],
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
    initialize() {
      axios
        .get("brand")
        .then((res) => {
          this.brand = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },

    editItem(item) {
      this.editedIndex = this.brand.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.brand.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    getMax(arr, prop) {
      let max;
      for (var i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
          max = arr[i];
      }
      return max;
    },
    deleteItemConfirm() {
      axios
        .delete("brand/" + this.editedItem.id)
        .then((res) => {
          if (res.code === 200) {
            // this.$swal(res.data.message);
            this.alert.color = "green--text";
            this.alert.title = "Success";
            this.alert.message = "Brand Deleted";
            this.alert.type = true;
            this.brand.splice(this.editedIndex, 1);
          }
        })
        .catch((err) => {
          // this.$swal("Sorry, There is an error : " + err.message);

          this.alert.color = "red--text";
          this.alert.title = "Error";
          this.alert.message = err.message;
          this.alert.type = true;
        })
        .finally(() => {
          this.alert.color = "green--text";
          this.alert.title = "Success";
          this.alert.message = "Brand Deleted";
          this.alert.type = true;
          this.brand.splice(this.editedIndex, 1);
          this.closeDelete();
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.reset();
      });
    },

    async closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      this.validate();
      this.editedItem.brand_id = this.editedItem.brand_id + "";
      this.editedItem.location_Id = this.editedItem.location_Id + "";

      if (this.editedIndex > -1) {
        await axios
          .patch("brand/" + this.editedItem.id, {
            label: this.editedItem.label,
          })
          .then((res) => {
            if (res.data) {
              this.alert.color = "green--text";
              this.alert.title = "Success";
              this.alert.message = res.data.message;
              this.alert.type = true;
              console.log(res.data);
              Object.assign(this.brand[this.editedIndex], this.editedItem);
            }
          })
          .catch((err) => {
            this.alert.color = "red--text";
            this.alert.title = "Error";
            this.alert.message = err.message;
            this.alert.type = true;
          })
          .finally(() => {
            this.close();
          });
      } else {
        if (
          this.editedItem.label === null ||
          this.editedItem.label === "" ||
          this.editedItem.label === undefined
        ) {
          this.alert.color = "red--text";
          this.alert.title = "Error";
          this.alert.message = "Please fill Brand";
          this.alert.type = true;
        } else {
          let data = {
            label: this.editedItem.label,
          };
          await axios
            .post("brand", data)
            .then((res) => {
              if (res.data) {
                // this.$swal(res.data.message);

                this.alert.color = "green--text";
                this.alert.title = "Success";
                this.alert.message = "Brand " + res.statusText;
                this.alert.type = true;
                console.log("res");
                console.log(res);

                this.brand.push(res.data);
              }
            })
            .catch((err) => {
              this.alert.color = "red--text";
              this.alert.title = "Error";
              this.alert.message = err.message;
              this.alert.type = true;
              // this.$swal("Sorry, There is an error : " + err.message);
              console.log(err);
            })
            .finally(() => {
              this.close();
            });
        }
      }
    },
  },
};
</script>
<style>
.compact-form {
  transform: scale(0.865);
  transform-origin: center;
}
</style>
