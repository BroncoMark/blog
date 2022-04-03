<template>
<div class="home">
  <section class="blog_posts">
    <div class="image" v-for="post in blog_posts" :key="post.id">
      <h2>{{post.timestamp}}</h2>
      <h2>{{post.title}}</h2>
      <img :src="post.path" />
      <h2>{{post.post}}</h2>
    </div>
  </section>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
     blog_posts: [],
    }
  },
  created() {
    this.getBlogPosts();
  },
  methods: {
    async getBlogPosts() {
      try {
        let response = await axios.get("/api/blogposts");
        this.blog_posts = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>
.image h2 {
  font-style: italic;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.blog_posts {
  column-gap: 1.5em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  width: 100%;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .blog_posts {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .blog_posts {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .blog_posts {
    column-count: 2;
  }
}
</style>