<template>
<div class="manage">
    <h1>Manage Posts</h1>
    <div class="heading">
      <div class="circle">1</div>
      <h2>Add a Post</h2>
    </div>
    <div class="add">
      <div class="form">
        <input v-model="title" placeholder="Title">
        <textarea v-model="post" placeholder="Post"></textarea>
        <p></p>
        <input type="file" name="photo" @change="fileChanged">
        <button @click="upload">Upload</button>
      </div>
      <div class="upload" v-if="addBlogPost">
        <h2>{{addBlogPost.post}}</h2>
        <img :src="addBlogPost.path" />
      </div>
    </div>
    <div class="heading">
      <div class="circle">2</div>
      <h2>Edit/Delete a BlogPost</h2>
    </div>
    <div class="edit">
      <div class="form">
        <input v-model="findTitle" placeholder="Search">
        <div class="suggestions" v-if="suggestions.length > 0">
          <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectBlogPost(s)">{{s.title}}
          </div>
        </div>
      </div>
      <div class="upload" v-if="findBlogPost">
        <input v-model="findBlogPost.title">
        <textarea v-model="findBlogPost.post"></textarea>
        <p></p>
        <img :src="findBlogPost.path" />
      </div>
      <div class="actions" v-if="findBlogPost">
        <button @click="editBlogPost(findBlogPost)">Edit</button>
        <button @click="deleteBlogPost(findBlogPost)">Delete</button>
      </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Manage',
  data() {
    return {
      title: "",
      post: "",
      file: null,
      addBlogPost: null,
      blog_posts: [],
      findTitle: "",
      findBlogPost: null,
    }
  },
  computed: {
    suggestions() {
      let items = this.blog_posts.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return items.sort((a, b) => a.title > b.title);
    }
  },
  created() {
    this.getBlogPosts();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        let r2 = await axios.post('/api/blogposts', {
          timestamp: dateTime,
          title: this.title,
          post: this.post,
          path: r1.data.path
        });
        this.addItem = r2.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getBlogPosts() {
      try {
        let response = await axios.get("/api/blogposts");
        this.blog_posts = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectBlogPost(blog_post) {
      this.findTitle = "";
      this.findBlogPost = blog_post;
    },
    async deleteBlogPost(blog_post) {
      try {
        await axios.delete("/api/blogposts/" + blog_post._id);
        this.findBlogPost = null;
        this.getBlogPosts();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editBlogPost(blog_post) {
      try {
        await axios.put("/api/blogposts/" + blog_post._id, {
          title: this.findBlogPost.title,
          post: this.findBlogPost.post,
        });
        this.findBlogPost = null;
        this.getBlogPosts();
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
  font-size: 1em;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.add,
.edit {
  display: flex;
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}
</style>
