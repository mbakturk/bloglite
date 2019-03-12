<template>
  <form class="form-login">
    <h1>Please log in</h1>
    <label for="email" class="sr-only">Email address</label>
    <input
      type="email"
      v-model="email"
      placeholder="Email address"
      required
      autofocus
      class="form-control"
    >
    <label for="password" class="sr-only">Password</label>
    <input type="password" v-model="password" placeholder="Password" required class="form-control">
    <button @click="submit" class="btn btn-lg btn-primary btn-block">Log in</button>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import $http from "../http-client";

export default Vue.extend({
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    submit() {
      $http
        .post("login", { email: this.email, password: this.password })
        .then(resp => {
          if (resp.data.retCode === 0) {
            this.$store.dispatch("logIn");
            this.$router.push({ path: '/' });
          }
        });
    },
  },
});
</script>

<style scoped lang="scss">
.form-login {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;

  input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
  }

  button[type="submit"] {
    margin-top: 10px;
  }
}
</style>
