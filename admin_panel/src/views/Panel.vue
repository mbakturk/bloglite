<template>
  <div>
    <nav class="navbar-expand-lg navbar navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">BlogLite</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav" style="width:100%">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Dashboard</router-link>
          </li>
          <li class="nav-item" style="width:100%">
            <router-link class="nav-link" to="/editor">Create Post</router-link>
          </li>
          <li>
            <button class="btn btn-danger" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import $http from "../http-client";

export default Vue.extend({
  data() {
    return {};
  },
  methods: {
    logout: function() {
      $http.post("logout").then(resp => {
        if (resp.data.retCode === 0) {
          this.$store.dispatch("logOut");
          this.$router.push({ path: "/login" });
        }
      });
    },
  },
});
</script>

<style scoped lang="scss">
.page-num-button {
  width: 100px;
}
</style>
