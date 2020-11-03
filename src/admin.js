import "./styles/default.scss";
import { createApp } from "vue";
import Admin from "./Admin.vue";

const admin = createApp(Admin);
admin.mount("#app");
