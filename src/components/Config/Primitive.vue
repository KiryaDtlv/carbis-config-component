<template>
  <v-sheet v-if="typeMap[meta.type] != 'bool'">
  <InputField
    v-model="currentValue"
    :label="meta.label"
    :type="typeMap[meta.type]"
    v-if="!meta.secret"
  >
    <template v-slot:prepend>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
        </template>
        {{ meta.hint }}
      </v-tooltip>
    </template>
  </InputField>
  <PasswordField
    v-model="currentValue"
    :label="meta.label"
    :type="typeMap[meta.type]"
    v-else
  >
    <template v-slot:prepend>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
        </template>
        {{ meta.hint }}
      </v-tooltip>
    </template>
  </PasswordField>
  </v-sheet>
  <v-sheet v-else>
    <CarbisSwitch v-model="currentValue" :label="meta.label">
      <template v-slot:prepend>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on"> mdi-help-circle-outline </v-icon>
        </template>
        {{ meta.hint }}
      </v-tooltip>
    </template>
    </CarbisSwitch>
  </v-sheet>
</template>

<script>
import InputField from "../../ui/Carbis/InputField.vue";
import PasswordField from "../../ui/Carbis/PasswordField.vue";
import CarbisSwitch from '../../ui/Carbis/CarbisSwitch.vue';
export default {
  components: { InputField, PasswordField, CarbisSwitch },
  props: ["value", "meta"],
  data() {
    return {
      typeMap: {
        str: "text",
        int: "number",
        bool: "bool"
      },
      currentValue: this.value
    };
  },
  computed: {
    currentRule() {
      return this.meta.rule
        ? this.meta.rule.includes("InRange")
          ? this.createRangeRule(this.meta.rule)
          : []
        : [];
    },
  },
  methods: {
    getRange(rule) {
      const range = [];
      rule.split(",").forEach((element) => {
        const rangeValue = element.split("").filter((el) => this.isDigit(el));
        range.push(parseInt(rangeValue.join("")));
      });
      return range;
    },
    createRangeRule(rule) {
      const range = this.getRange(rule);
      return [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) =>
          (v <= range[1] && v >= range[0]) ||
          `Значение должно быть в пределах (${range[0]}, ${range[1]})`,
      ];
    },
    isDigit(element) {
      return /\d+/.test(element);
    },
  },
  watch: {
    currentValue(newValue){
      console.log('watch: ', newValue)
      this.$emit('input', newValue)
    }
  }
};
</script>

<style>
</style>