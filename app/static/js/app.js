Vue.component('app-header', {
    template: `
    <div>
    <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet"> 
    <link rel="stylesheet" type="text/css" href="static/css/main.css">
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
  <a class="navbar-brand" href="#" id = "gram"><img class="icon" :src="'/static/css/camicon.jpg'">Photogram</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul id="links" class="navbar-nav mr-auto">
      <li class="nav-item active">
        <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
      </li>
      <li class="nav-item active">
        <router-link class="nav-link" to="/explore">Explore <span class="sr-only">(current)</span></router-link>
      </li>
      <li class="nav-item active">
        <router-link class="nav-link" to="/users/{user_id}">My Profile <span class="sr-only">(current)</span></router-link>
      </li>
    </ul>
        
  </div>
</nav>
</div>
    `
});

Vue.component('app-footer', {
    template: `
    <div>
    
    <footer class="footer">
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    </div>
    `
});


const Home = Vue.component('home', {
   template: `
    <div class= "home">
    <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet"> 
    <link rel="stylesheet" type="text/css" href="static/css/main.css">
    <br>
    <br>
    <ul>
        <li class = "inbl" >
            <img class="homeimg" :src="'/static/css/home.png'">
        </li>
        <li id="spesh" class = "inbl" >
            <h1 id= "gram"><img class="homeicon" :src="'/static/css/camicon.jpg'"> Photogram</h1>
            <hr>
            <p> Share photos of your favourite moments with friends family and the world</p>
            
            <div id= "inbl1" >
            <router-link to="register"  class="btn btn-primary">Register</router-link>
            
            <router-link to="login"  class="btn btn-primary">Login</router-link>
            </div>
        </li>
    </ul>
    </div>
   
   `,
    data: function() {
       return {}
    }
});

const Register = Vue.component('register', {
   template: `
   <div class= "form">
   <link rel="stylesheet" type="text/css" href="static/css/main.css">
        <div v-if="visible">
            <div v-if="errors" class="alert alert-danger">
                <li v-for="error in errors">{{ error }}</li>
            </div>
            <div v-else class="alert alert-success">Registration Successful</div>
        </div>
        <h1> Register </h1>
       <form id= "RegForm" class="form-register" @submit.prevent="Register" method="post" enctype="multipart/form-data">
            <label>Username</label>
            <input type="text" name="username" class="form-group form-control">
    
            <label>Password</label>
            <input type="password" name="password" class="form-group form-control">
    
            <label>First Name</label>
            <input type="text" name="firstname" class="form-group form-control">
    
            <label>Last Name</label>
            <input type="text" name="lastname" class="form-group form-control">
    
            <label>Email</label>
            <input type="text" name="email" class="form-group form-control">
    
            <label>Location</label>
            <input type="text" name="location" class="form-group form-control">
    
            <label>Biograpy</label>
            <textarea name="biography" class="form-group form-control"> </textarea>
    
            <label>Photo</label>
            <input type="file" name="photo" class="form-group form-control">
    
            <input type="submit" class="btn btn-primary" >
        </form>
    </div>
   `,
   methods : {
    Register : function(){
        let self = this;
        let RegForm = document.getElementById('RegForm');
        let form_data = new FormData(RegForm);
        fetch('/api/users/register', {
        method: 'POST',
        body : form_data,
        headers: {
            'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
        // display a success message
            self.errors = jsonResponse.errors;
            console.log(jsonResponse);
        })
        .catch(function (error) {
            console.log(error);
        });
                }
        },
    data : function(){
        return {
            errors:[],
            visible: false
        }
    }

});


const Login = Vue.component('login', {
   template: `
   <div class= "form" >
   <link rel="stylesheet" type="text/css" href="static/css/main.css">
        <div v-if="visible">
            <div v-if="errors" class="alert alert-danger">
                <li v-for="error in errors">{{ error }}</li>
            </div>
            <div v-else class="alert alert-success">Log in Successful</div>
        </div
   
       <form class="form-login" @submit.prevent="LogIn" method="post">
            <h2>Please sign in</h2>
          
            <div class="form-group">
                <label for="username" class="sr-only">Username</label>
                <input type="text" id="username" name="username" class="form-control" placeholder="Your username" required >
            </div>
            <div class="form-group">
                <label for="password" class="sr-only">Password</label>
                <input type="password" id="password" name="password" class="form-control" placeholder="Password" required>
            </div>
          <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
    </div>
   `,
   methods : {
    LogIn : function(){
        let self = this;
        let LoginForm = document.getElementById('LoginForm');
        let form_data = new FormData(LoginForm);
        fetch("/api/auth/login", {
        method: 'POST',
        body : form_data,
        headers: {
            'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
        // display a success message
            self.errors = jsonResponse.errors;
            console.log(jsonResponse);
        })
        .catch(function (error) {
            console.log(error);
        });
                }
        },
    data : function(){
        return {
            errors:[],
            visible: false
        }
    }

});


const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        {path: "/login", component: Login},
        {path: "/register", component: Register}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});