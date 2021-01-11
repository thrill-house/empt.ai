import { createApp } from "vue";

import Admin from "./Admin.vue";
import adminStore from "./store/admin";

import "./styles/default.scss";

const admin = createApp(Admin);

// Install plugins
admin.use(adminStore);

// Mount up
admin.mount("#app");
