import axios from "axios";
axios.defaults.baseURL = "http://link_to_server";

if (localStorage.getItem("token")) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
} else {
  delete axios.defaults.headers.common["Authorization"];
}
