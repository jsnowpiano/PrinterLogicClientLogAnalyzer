<template>
    <div class="articles">
      <header>
        <h1>Articles</h1>
      </header>
      <div class="menu">
        <v-btn class="add" @click="showAddArticleForm = true">Add Article</v-btn>
        <div class="search-container">
          <v-text-field
            ref="searchField"
            v-model="search"
            label="Log Name"
            hide-details
            single-line
          ></v-text-field>
        </div>
      </div>
      <div class="list">
        <v-expansion-panels>
          <v-expansion-panel v-for="article in filteredArticles" :key="article._id">
            <v-expansion-panel-title>
              {{ article.title }}
              <v-spacer></v-spacer>
              <v-btn small @click.stop="toggleEdit(article)">Edit</v-btn>
              <v-btn small @click.stop="deleteArticle(article.description)">Delete</v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-if="article.editing">
                <v-text-field v-model="article.description" label="Description"></v-text-field>
                <v-text-field v-model="article.explanation" label="Explanation"></v-text-field>
                <v-btn @click="saveArticle(article)">Save</v-btn>
                <v-btn @click="cancelEdit(article)">Cancel</v-btn>
              </div>
              <div v-else>
                <p>{{ article.description }}</p>
                <p>{{ article.explanation }}</p>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
  
      <v-dialog v-model="showAddArticleForm" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Add Article</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="newArticle.title" label="Title" required></v-text-field>
              <v-text-field v-model="newArticle.description" label="Description" required></v-text-field>
              <v-text-field v-model="newArticle.explanation" label="Explanation" required></v-text-field>
              <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelAddArticle">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="addArticle">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import { toRaw } from 'vue';
  
  export default {
    name: 'Articles',
    data() {
      return {
        search: '',
        articles: [],
        selectedArticle: null,
        showAddArticleForm: false,
        newArticle: {
          title: '',
          description: '',
          explanation: ''
        },
        errorMessage: ''
      };
    },
    computed: {
      filteredArticles() {
        if (!this.search) {
          return this.articles;
        }
        return this.articles.filter(article =>
          article.title.toLowerCase().includes(this.search.toLowerCase())
        );
      }
    },
    methods: {
      async fetchArticles() {
        try {
          const response = await fetch('https://printerlogicclientloganalyzer.onrender.com/articles');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          this.articles = await response.json();
          this.articles.forEach(article => {
            article.editing = false;
          });
        } catch (error) {
          console.error('Error fetching articles:', error);
        }
      },
      toggleEdit(article) {
        article.editing = !article.editing;
      },
      async saveArticle(article) {
        try {
          const response = await fetch(`https://printerlogicclientloganalyzer.onrender.com/articles/${article._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: article.title,
              description: article.description,
              explanation: article.explanation
            })
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            this.errorMessage = `Error updating article: ${errorText}`;
            throw new Error('Network response was not ok');
          }
  
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const updatedArticle = await response.json();
            const index = this.articles.findIndex(a => a._id === updatedArticle._id);
            if (index !== -1) {
              this.articles.splice(index, 1, { ...updatedArticle, editing: false });
            }
            console.log('Article updated:', updatedArticle);
          } else {
            const errorText = await response.text();
            this.errorMessage = `Error updating article: ${errorText}`;
            throw new Error('Network response was not ok');
          }
  
          article.editing = false;
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = 'Error updating article: ' + error.message;
          console.error('Error updating article:', error);
        }
      },
      cancelEdit(article) {
        article.editing = false;
      },
      async addArticle() {
        try {
          const response = await fetch("https://printerlogicclientloganalyzer.onrender.com/articles", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: this.newArticle.title,
              description: this.newArticle.description,
              explanation: this.newArticle.explanation
            })
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            this.errorMessage = `Error adding article: ${errorText}`;
            throw new Error('Network response was not ok');
          }
  
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const addedArticle = await response.json();
            this.articles.push({ ...addedArticle, editing: false });
            console.log('Article added:', addedArticle);
          } else {
            const errorText = await response.text();
            this.errorMessage = `Error adding article: ${errorText}`;
            throw new Error('Network response was not ok');
          }
  
          this.newArticle = { title: '', description: '', explanation: '' };
          this.showAddArticleForm = false;
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = 'Error adding article: ' + error.message;
          console.error('Error adding article:', error);
        }
      },
      cancelAddArticle() {
        this.showAddArticleForm = false;
        this.errorMessage = '';
      },
      async deleteArticle(description) {
        try {
          const response = await fetch(`https://printerlogicclientloganalyzer.onrender.com/articles`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ description })
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error deleting article:', response.status, errorText);
            throw new Error('Network response was not ok');
          }
  
          this.articles = this.articles.filter(article => article.description !== description);
          console.log('Article deleted:', description);
        } catch (error) {
          console.error('Error deleting article:', error);
        }
      }
    },
    mounted() {
      this.fetchArticles();
    }
  };
  </script>
  
  <style scoped>
  .articles {
    padding-left: 50px;
    padding-top: 50px;
    margin-right: 30px;
    margin-bottom: 10px;
  }
  h1 {
    margin-bottom: 30px;
    color: #3d2562;
  }
  body {
    background-color: #f5f4f7;
  }
  .menu {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .search-container {
    display: flex;
    align-items: center;
  }
  .list {
    background-color: #ece9ef;
    margin-top: 40px;
  }

  .article-details {
    margin-top: 20px;
  }
  .add {
    margin-bottom: 20px;
  }
  </style>