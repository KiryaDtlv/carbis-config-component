<template>
  <v-expansion-panels
    :disabled="use_tcp"
    :value="use_tcp ? undefined : true ? 0 : undefined"
  >
    <v-expansion-panel
      @click="
        !any_loading
          ? (local_config = {
              ...local_config,
              use_saas: !true,
            })
          : ''
      "
      :title="
        use_tcp
          ? 'Чтобы использовать SaaS XML, отключите режим разработчика.'
          : ''
      "
    >
      <v-expansion-panel-header hide-actions>
        <!-- <CheckBox
          :disabled="use_tcp"
          :original_value="true && !use_tcp"
          :value="true && !use_tcp"
          readonly
          :hint="'Использовать для сохранения и оплаты заказов в r_keeper SaaS лицензирование XML интерфейса'"
          :label="'Использовать SaaS XML'"
          :loading="any_loading"
        /> -->
        Настройки SaaS XML
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-divider></v-divider>
        <v-container fluid>
          <v-banner
            v-if="!saas_data.credentials"
            class="mb-5"
            color="warning"
            dark
          >
            <v-icon class="mr-3">mdi-comment-alert</v-icon>
            Введите данные дилерской учетной записи l.ucs.ru<br />
            Данные дилерской учетной записи не будут сохранены модулем доставки
            в открытом виде
          </v-banner>
          <v-row>
            <v-col style="min-width: 300px">
              <v-form :disabled="any_loading" @submit.prevent="saveCredentials">
                <TextField
                  validate-on-blur
                  persistent-hint
                  v-model="user"
                  clearable
                  :label="'Логин l.ucs.ru (email)'"
                  :hint="'Дилерская учетная запись должна иметь доступ к объекту на l.ucs.ru, для которого настраивается модуль доставки'"
                />
                <TextField
                  validate-on-blur
                  persistent-hint
                  v-model="password"
                  password
                  clearable
                  :label="'Пароль l.ucs.ru'"
                  :hint="'Дилерская учетная запись должна иметь доступ к объекту на l.ucs.ru, для которого настраивается модуль доставки'"
                />
                <v-btn
                  type="submit"
                  text
                  color="primary"
                  :loading="any_loading"
                >
                  <v-icon>mdi-license</v-icon>
                  Отправить
                </v-btn>
              </v-form>
            </v-col>
            <v-col style="min-width: 280px">
              <InfoField
                :loading="any_loading"
                :label="'Данные учетной записи'"
                :hint="'Заданы ли данные учетной записи l.ucs.ru'"
              >
                <span
                  style="color: var(--v-primary-base)"
                  v-if="saas_data.credentials"
                  >Заданы</span
                >
                <span style="color: var(--v-error-base)" v-else>Не заданы</span>
              </InfoField>
              <InfoField
                :loading="any_loading"
                :label="'Дата окончания'"
                :hint="'Дата окончания SaaS XML лицензии по данным l.ucs.ru'"
              >
                <span v-if="saas_data.license_expiration">{{
                  new Date(saas_data.license_expiration)
                }}</span>

                <span v-else style="color: var(--v-error-base)"
                  >Данные о лицензии не найдены</span
                >
              </InfoField>
              <div style="color: var(--v-error-base)">
                {{ saas_data.license_error }}
              </div>
              <v-btn
                :loading="any_loading"
                text
                color="primary"
                @click="updateLicenseInfo"
              >
                <v-icon>mdi-autorenew</v-icon>
                Обновить данные
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-5"></v-divider>
          <v-row>
            <v-col cols="12">
              <v-form :disabled="any_loading">
                <SelectField
                  :items="products_items"
                  v-model="product_guid"
                  :label="'Тип SaaS XML лицензии'"
                  :hint="`${'Выберите тип SaaS XML лицензии, полученный на l.ucs.ru для текущего ресторана.\nУбедитесь, что лицензия не только получена, но и активирована!'}\n(${'Символом @ отмечены устаревшие лицензии, которые больше не выдаются UCS'})`"
                />
                <v-btn
                  @click="saveProduct"
                  type="submit"
                  text
                  color="primary"
                  :loading="any_loading"
                >
                  <v-icon>mdi-license</v-icon>
                  Отправить
                </v-btn>
              </v-form>
            </v-col>
          </v-row>
          <!-- <v-divider class="my-5"></v-divider> -->
          <v-row>
            <v-col>
              <TextField
                :label="'Обслуживание лицензии'"
                :hint="`${'Заменить идентификатор экземпляра - исправляет ошибку `лицензия удалена на сервере лицензирования`'}\n${'Обновить порядковый номер - исправляет ошибку `неправильно заполнен атрибут seqNum...`'}`"
                :loading="any_loading"
              >
                <v-btn
                  :loading="any_loading"
                  text
                  color="primary"
                  @click="updateInstanceGuid"
                >
                  <v-icon>mdi-alert</v-icon>
                  Заменить идентификатор экземпляра
                </v-btn>
                <v-btn
                  :loading="any_loading"
                  text
                  color="primary"
                  @click="updateSequenceNumber"
                >
                  <v-icon>mdi-alert</v-icon>
                  Обновить порядковый номер
                </v-btn>
              </TextField>
            </v-col>
          </v-row>
          <!-- <v-row>
            <v-col>
              <v-btn :disabled="!config.use_saas" :loading="any_loading" text color="primary" @click="updateInstanceGuid">
                <v-icon>mdi-alert</v-icon>
                Заменить идентификатор экземпляра
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :disabled="!config.use_saas" :loading="any_loading" text color="primary" @click="updateSequenceNumber">
                <v-icon>mdi-alert</v-icon>
                Обновить порядковый номер
              </v-btn>
            </v-col>
          </v-row> -->
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import InfoField from "./InfoField.vue";
import TextField from "./TextField.vue";
import SelectField from "./SelectField.vue";
import CheckBox from "./CheckBox.vue";

export default {
  props: ["use_tcp", "local_config"],
  data: () => ({
    local_loading: false,
    user: "",
    password: "",
    saas_data: {
      instance_guid: "655cee55-7bcd-4826-b6e0-a8ccf2017ef3",
      credentials: true,
      license_expiration: "2023-05-24",
      license_error: false,
      product_guid: "655cee55-7bcd-4826-b6e0-a8ccf2017ef3",
      product_guid_reference: {
        "655cee55-7bcd-4826-b6e0-a8ccf2017ef3":
          "SaaS XML для Приложения 12 мес ПО",
        "4458d8b1-0019-4025-8c7a-60a83ad64b66":
          "SaaS XML для Приложения 1 мес ПО",
        "f2af3b7e-4225-4e36-b72d-c65e7b9a04c6": "@SaaS XML для CRM 12 мес ПО",
        "fb4ba8ec-ea17-4268-a05d-cad9a598ab95": "@SaaS XML для CRM 1 мес ПО ",
        "9a55a4a4-c2b4-412b-a558-90d8a8443850": "@SaaS XML для KDS 12 мес ПО",
        "5674248a-06f5-4116-916f-09b1383f80a2": "@SaaS XML для KDS 1 мес ПО ",
        "310bc5c7-b0ca-4790-bdeb-afe0d9cf516b": "@SaaS XML для Доставки 12 мес",
        "c4fc346f-df29-4083-b611-49eb275544e8":
          "@SaaS XML для Доставки 1 мес ПО",
        "1c09f192-7938-4b17-9db5-f78856c633ad": "@SaaS XML для Киоск 12 мес ПО",
        "dc79065a-2e33-47ee-85d7-a375444f7835": "@SaaS XML для Киоск 1 мес ПО",
      },
    },
    product_guid: 0,
  }),
  computed: {
    any_loading() {
      return this.local_loading || this.loading;
    },
    products_items() {
      if (this.saas_data.product_guid_reference) {
        return Object.entries(this.saas_data.product_guid_reference).map(
          ([key, value]) => ({ text: value, value: key })
        );
      } else return [];
    },
  },
  watch: {
    local_config: {
      handler(val) {
        if (true) {
          this.loadSaasData();
        }
      },
      deep: true,
    },
  },
  methods: {
    async loadSaasData() {
      this.local_loading = true;
      try {
        // await this.$store.dispatch("loadSaasData");
        this.product_guid = this.saas_data.product_guid;
      } catch (e) {
        // this.local_config = { ...this.local_config, use_saas: false };
      } finally {
        this.local_loading = false;
      }
    },
    async saveProduct() {
      this.local_loading = true;
      try {
        await this.$store.dispatch("updateSaasData", {
          product_guid: this.product_guid,
        });
        this.product_guid = this.saas_data.product_guid;

        this.$store.dispatch("throwTimeoutMessage", {
          text: "Изменения сохранены",
          message_class: "success",
        });
      } finally {
        this.local_loading = false;
      }
    },
    async saveCredentials() {
      if (!this.user || !this.password) {
        this.$store.dispatch("throwTimeoutMessage", {
          text: "Пожалуйста, заполните логин и пароль дилерской учетной записи.",
          message_class: "error",
        });
        return;
      }

      this.local_loading = true;
      try {
        await this.$store.dispatch("updateSaasData", {
          user: this.user,
          password: this.password,
        });
        this.product_guid = this.saas_data.product_guid;

        this.$store.dispatch("throwTimeoutMessage", {
          text: "Изменения сохранены",
          message_class: "success",
        });
      } finally {
        this.local_loading = false;
      }
    },
    async updateInstanceGuid() {
      this.local_loading = true;
      try {
        await this.$store.dispatch("updateInstanceGuid");

        this.$store.dispatch("throwTimeoutMessage", {
          text: "Идентификатор экземпляра ПО обновлен",
          message_class: "success",
        });
      } finally {
        this.local_loading = false;
      }
    },
    async updateSequenceNumber() {
      this.local_loading = true;
      try {
        await this.$store.dispatch("updateSequenceNumber");

        this.$store.dispatch("throwTimeoutMessage", {
          text: "Порядковый номер запроса обновлен",
          message_class: "success",
        });
      } finally {
        this.local_loading = false;
      }
    },
    async updateLicenseInfo() {
      this.local_loading = true;
      try {
        await this.$store.dispatch("updateLicenseInfo");

        this.$store.dispatch("throwTimeoutMessage", {
          text: "Данные о лицензии обновлены",
          message_class: "success",
        });
      } finally {
        this.local_loading = false;
      }
    },
    validate() {
      if (!this.use_tcp && true) {
        if (this.checkSaasDataState() === false) {
          throw new Error(
            "Данные SaaS XML заполнены не полностью, или не корректно"
          );
        }
      }
    },
    checkSaasDataState() {
      return true;
    },
  },
  components: {
    TextField,
    CheckBox,
    SelectField,
    InfoField,
  },
};
</script>