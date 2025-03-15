<template>
    <div class="analyze">
      <header> 
          <h1>Analyze</h1>
      </header>
      <div>
          <h2>Generate reports</h2>
          <div class="menu">
              <v-btn @click="triggerFileInput" style="margin-right: 20px;">Upload file</v-btn>
              <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" accept=".log">
              <v-btn @click="generateReports">Generate reports</v-btn>
              <p>{{ fileContent ? 'File uploaded.' : 'File not uploaded.' }}</p>
          </div>
          <div class="reports">
              <h3>Base Information</h3>
              <ul>
                  <li v-for="header in headerData" :key="header.id">{{header.type + " : "+  header.report }}</li>
              </ul>
              <h3>Errors</h3>
              <ul>
                  <li v-for="error in errors" :key="error.id">{{ error.report }}</li>
              </ul>
              <h3>Reports</h3>
              <ul>
                  <li v-for="report in reports" :key="report.id">{{ report.report }}</li>
              </ul>
          </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Analyze',
    data() {
      return {
        fileContent: null,
        errors: [],
        reports: [],
        headerData: []
      };
    },
    methods: {
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.fileContent = e.target.result;
          };
          reader.readAsText(file);
        }
      },
      async postReports() {
        const response = await fetch("http://localhost:8080/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            logs: this.fileContent
          })
        });
        return response;
      },
      async loadLogs() {
        const response = await fetch("http://localhost:8080/reports");
        const data = await response.json();
        return data;
      },
      async generateReports() {
        try {
          await this.postReports();
          const logs = await this.loadLogs();
          this.fileContent = null;
          console.log(logs);
  
          this.errors = [];
          this.reports = [];
          this.headerData = [];
  
          const uniqueLogs = new Set();
  
          for (let i = 0; i < logs.length; i++) {
            if (!uniqueLogs.has(logs[i].id)) {
              uniqueLogs.add(logs[i].id);
              if (logs[i].type === "error") {
                this.errors.push(logs[i]);
              } else if (logs[i].type === "report") {
                console.log(logs[i]);
                this.reports.push(logs[i]);
              } else {
                this.headerData.push(logs[i]);
              }
            }
          }
        } catch (error) {
          console.error("Error generating reports:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .reports {
      background-color: #ece9ef;
      padding-bottom: 40PX;
  }
  .analyze {
    padding-left: 50px;
    padding-top: 50px;
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
  h2 {
      color: #7e5fdd;
      margin-top: 100px;
  }
  ul {
      margin-left: 50px;
      margin-top: 30px;
  }
   p {
      width: 50%;
      padding-top: 20px;
   }
   h3 {
      color: #3d2562;
      padding-left: 40px;
      padding-top: 40px;
   }
  </style>