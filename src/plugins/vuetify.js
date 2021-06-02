import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from "vue";
import Vuetify from "vuetify/lib";
import DatetimePicker from 'vuetify-datetime-picker'
import VueJWT from 'vuejs-jwt'

 
Vue.use(VueJWT)
Vue.use(Vuetify)
Vue.use(DatetimePicker)


export default new Vuetify({
    icons: {
        iconfont: 'md' || 'fa'
    }
});
