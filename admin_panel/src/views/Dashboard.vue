<template>
  <div class="container">
    <div class="row">
      <div class="col-auto">
        <h1 class="mt-3 mb-3">Posts</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(post, index) in postList" :key="index">
              <td scope="row">{{post.title}}</td>
              <td>{{post.authorName}}</td>
              <td>{{post.postDate}}</td>
              <td>
                <button class="btn btn-primary btn-sm mr-2" @click="updatePost(post.id)">Edit</button>
                <button class="btn btn-primary btn-sm mr-2" @click="deletePost(post.id)">Delete</button>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row justify-content-center">
      <button
        v-if="pageNum > 1"
        class="btn btn-primary btn-sm page-num-button"
        @click="fetchData(-1)"
      >previous</button>
      <div class="col-auto font-weight-bold d-flex align-items-center">{{pageNum}} of {{totalPage}}</div>

      <button
        v-if="pageNum < totalPage"
        class="btn btn-primary btn-sm page-num-button"
        @click="fetchData(1)"
      >next</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import $http from "../http-client";

export default Vue.extend({
  data() {
    return {
      pageNum: 1,
      totalPage: 10,
      postList: [],
    };
  },

  created: function() {
    this.fetchData();
  },

  methods: {
    fetchData: function(direction: number = 0) {
      $http
        .post("/getLitePostList", { page: this.pageNum + direction })
        .then(resp => {
          if (resp.data.retCode === 0) {
            this.postList = resp.data.postList;
            this.totalPage = resp.data.totalPage;
            this.pageNum = this.pageNum + direction;
          }
        });
    },
    updatePost: function(postId: number) {
      this.$router.push({ path: `/editor/${postId}` });
    },
    deletePost: function(postId: number) {
      $http.post("deletePost", { id: postId }).then(resp => {
        if (resp.data.retCode === 0) {
          this.fetchData();
        }
      });
    },
  },
});
</script>

<style scoped lang="scss">
</style>
