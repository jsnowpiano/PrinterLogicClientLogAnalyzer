
<template>
  <div class="home">
        <header>
            <h1>Home</h1>
            <p>Welcome to the all new Client log assistant.</p>
        </header>
        <div>
            <h2>Key Points</h2>
            <ul>
                <li>Analyze client log reporting easier by cleaner reports and no duplicates.</li>
                <li>Seperation of basic reports, errors, and header information.</li>
                <li>Search for articles that have been created by other users in our article database</li>
            </ul>
        </div>
        <div>
            <h2>
                Why was Log Assistant created?
            </h2>
            <p>
                Log Assistant was created to help support analyze client logs easier and more efficiently. 
                The goal is to provide a cleaner report that is easier to read and understand. 
                The reports are seperated into basic reports, errors, and header information. 
                This will help us find the information they need faster and easier.
            </p>
            <h2>
                How to get a user account?
            </h2>
            <p>
                To get a user account, please contact Jordan Snow with your email and password. 
                He will be able to create an account for you.
            </p>
            <h2>
                How to use
            </h2>
            <p>
                To use the Log Assistant, you will need to login with your email and password. 
                Once you are logged in, you will be able to upload a log file and analyze it. 
                You will be able to search for articles that have been created by other users in our article database.
                Please make sure to create articles too increase the amount of articles we are able to provide.     
            </p>
        </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>

<style scoped>
.home {
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
</style>