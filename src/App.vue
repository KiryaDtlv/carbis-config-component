<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h1>Carbis Config Component</h1>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <div
        class="messages-control"
        style="max-width: 330px; overflow: hidden; z-index: 120000"
      >
        <transition-group name="list" mode="out-in" style="position: relative">
          <v-alert
            v-for="(error, idx) in errors"
            type="error"
            :key="idx"
            style="
              width: 100%;
              max-width: 330px;
              cursor: pointer;
              white-space: pre-wrap;
              font-size: 0.8rem;
              user-select: none;
            "
            >{{ error }}</v-alert
          >
        </transition-group>
      </div>
      <Config
        :metaConfig="metaConfig"
        v-model="localConfig"
        :defaultOpened="['api_server.test', 'local_server']"
        :isDev="true"
        :orderKeys="{ mid_server: ['port', 'host'] }"
        :loading="loading"
        @update="(v) => showValidate(v)"
        @validate="(v) => showValidate(v)"
      >
        <template #report-allowed_departments-slot="{ item, setattr, meta }">
          <v-combobox
            multiple
            :value="item"
            :label="meta.label"
            :items="item"
            @change="(v) => setattr(v)"
          ></v-combobox>
        </template>
        <template #api_server-action-slot="{ item }">
          <v-btn color="primary" @click="checkConnection(item)"
            >Проверить соединение</v-btn
          >
        </template>
        <template v-slot:action-slot>
          <v-spacer></v-spacer>
          <v-btn @click="updateConfig(updated)" class="primary"
            >Сохранить</v-btn
          >
        </template>
        <!-- <template #server_list-slot="{ item, meta }">
          <v-autocomplete :items="item" outlined dense hide-details>
            <template #>
              <v-tooltip></v-tooltip>
            </template>
          </v-autocomplete>
        </template> -->
      </Config>
    </v-main>
  </v-app>
</template>

<script>
import Config from "./CarbisConfigLibrary/Config/index.vue";

export default {
  name: "App",

  components: {
    Config,
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
      errors: [],
      updated: {},
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
    async showValidate(newValue) {
      try {
        // await this.$store.dispatch("validate", newValue);
        console.log(newValue);
      } catch (e) {
        // this.errors.push(e);
        // setTimeout(() => this.errors.shift(), 5000);
      }
    },
    async updateConfig(config) {
      try {
        this.loading = true;
        await this.$store.dispatch("updateConfig", config);
        this.localConfig = { ...this.config };
      } catch (e) {}
      this.loading = false;
    },
  },
};
</script>

<style>
.messages-control {
  display: flex;
  flex-direction: column-reverse;
  position: fixed;
  width: 300px;
  right: 0;
  top: auto;
  /* min-height: 100px; */
  bottom: 0px;
}

.list-move {
  transition: all 0.5s ease;
}
.list-enter-active {
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateX(30px);
}

.list-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.list-leave-active {
  position: absolute;
  transition: all 0.5s ease;
  opacity: 1;
  transform: translateX(0px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
/* .list-leave-active {
  position: absolute;
} */
</style>
