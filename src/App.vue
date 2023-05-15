<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h1>Carbis Config Component</h1>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <Config
        :metaConfig="metaConfig"
        v-model="localConfig"
        :isDev="false"
        :loading="loading"
        @update="(v) => showValidate(v)"
        @validate="(v) => showValidate(v)"
      >
        <template #api_server-action-slot>
          <v-btn
            color="primary"
            @click="checkConnection(localConfig.api_server)"
            >Проверить соединение</v-btn
          >
        </template>
        <template v-slot:action-slot>
          <v-spacer></v-spacer>
          <v-btn @click="updateConfig(localConfig)" class="primary"
            >Сохранить</v-btn
          >
        </template>
      </Config>
    </v-main>
  </v-app>
</template>

<script>
import SaaS from "./components/SaaS.vue";
import Selector from "./ui/Carbis/Selector.vue";
import Config from "./views/Config";

export default {
  name: "App",

  components: {
    Config,
    Selector,
    SaaS,
  },
  async mounted() {
    await this.$store.dispatch("getMetaConfig");
    await this.$store.dispatch("getConfig");
    this.localConfig = this.config;
    this.loading = false;
  },
  data() {
    return {
      loading: true,
      localConfig: undefined,
    };
  },
  computed: {
    metaConfig() {
      return this.$store.getters.metaConfig;
    },
    config() {
      return this.$store.getters.config;
    },
  },
  methods: {
    showValidate(newValue) {
      console.log(newValue);
    },
    async updateConfig(config) {
      try {
        this.loading = true;
        await this.$store.dispatch("updateConfig", config);
        this.localConfig = this.config;
      } catch (e) {}
      this.loading = false;
    },
  },
};
</script>
