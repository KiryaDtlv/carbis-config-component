<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main v-if="!loading">
      <Config :metaConfig="metaConfig" v-model="localConfig" :exclude="[]" >
        <template v-slot:button>
          <v-btn @click="updateConfig(localConfig)">Тест</v-btn>
        </template>
        <template v-slot:r_keeper-btn>
          <v-btn @click="checkConnection(localConfig.r_keeper)">Проверить соединение</v-btn>
        </template>
      </Config>
    </v-main>
  </v-app>
</template>

<script>
import Config from "./views/Config";

export default {
  name: "App",

  components: {
    Config,
  },
  async mounted() {
    await this.$store.dispatch("getMetaConfig");
    await this.$store.dispatch("getConfig");
    this.localConfig = this.config
    this.loading = false;
  },
  data() {
    return {
      loading: true,
      localConfig: undefined
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
    async updateConfig(config){
      await this.$store.dispatch("updateConfig", config);
      this.localConfig = this.config
    }
  }
};
</script>
