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
        :isDev="true"
        :exclude="['deferred_startup']"
        :loading="loading"
        @validate="(v) => showValidate(v)"
      >
        <template #api_server-action-slot>
          <v-btn color="primary">Проверить соединение</v-btn>
        </template>
        <template v-slot:action-slot>
          <v-spacer></v-spacer>
          <v-btn @click="updateConfig(localConfig)" class="primary"
            >Сохранить</v-btn
          >
        </template>
      </Config>
      <!-- <template #r_keeper_references-station-slot="{ value }">
          <Selector
            :value="value"
            :items="[
              { id: 1, name: 'Стол' },
              { id: 2, name: 'Стол2' },
            ]"
            ><template v-slot:prepend>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
                </template>
              </v-tooltip>
            </template>
          </Selector>
        </template> -->
      <!-- <template #r_keeper_server-footer-slot>
          <SaaS
            v-if="localConfig.r_keeper_server.use_saas"
            :loading="loading"
            :use_tcp="!!localConfig.r_keeper_server.use_tcp"
            :config="{ use_saas: localConfig.r_keeper_server.use_saas }"
            :original_value="true"
            ref="saasxml"
          />
        </template> -->
      <!-- <template #probonus_settings-action>
          <v-btn
            color="primary"
            @click="showValidate(localConfig.probonus_settings)"
            >Проверить соединение</v-btn
          >
        </template>
        <template v-slot:action>
          <v-spacer></v-spacer>
          <v-btn @click="updateConfig(localConfig)" class="primary">Тест</v-btn>
        </template> -->
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
