<template>
  <form>
    <input type="email" name="email" required v-model="email">
    <input type="password" name="password" required v-model="password">
    <button type="submit" v-bind:disabled="!valid">Log In</button>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        valid: false,
      };
    },

    mounted() {
      this.checkValidity();
    },

    updated() {
      this.checkValidity();
    },

    methods: {
      checkValidity() {
        this.valid = this.$el.checkValidity();
      },
    },
  };
</script>