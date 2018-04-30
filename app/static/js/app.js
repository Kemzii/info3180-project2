
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
        <router-link class="nav-link" to="/users/{userid}">My Profile <span class="sr-only">(current)</span></router-link>
      </li>
      <li class="nav-item active">
        <router-link class="nav-link" to="/logout">Logout<span class="sr-only">(current)</span></router-link>
      </li>
    </ul>
        
  </div>
</nav>
</div>
    `,
    watch: {
        '$route' (to, fom){
            this.reload()
        }
      },
    created: function() {
        let self = this;
        self.user=localStorage.getItem('token');
        self.current_user=localStorage.getItem('current_user');
        
    },
    data: function() {
        return {
            user: [],
            current_user: ''
        }
    },
    methods:{
        reload(){
            let self = this;
            self.user=localStorage.getItem('token');
            self.current_user=localStorage.getItem('current_user');
        }
    }
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
            <router-link to="register"  class=" btn btn-success">Register</router-link>
            
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
        <p v-if="errors.length" class="alert alert-danger">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
         
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
        fetch("/api/users/register", {
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
        // display a success message'
            this.errors = [];
            self.errors = jsonResponse.errors;
            router.go();
            router.push("/login");
            console.log(jsonResponse);
        })
        .catch(function (error) {
            console.log(error);
        });
                }
        },
    data : function(){
        return {
            errors:[]
        }
    }

});


const Login = Vue.component('login', {
   template: `
   <div class= "form" >
   <link rel="stylesheet" type="text/css" href="static/css/main.css">
        <p v-if="errors.length" class="alert alert-danger">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
   
       <form id= "LoginForm" class="form-login" @submit.prevent="LogIn" method="post">
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
        // display a success 
            let jwt_token = jsonResponse.token;
            let current_user = jsonResponse.current_user;

            // We store this token in localStorage so that subsequent API requests
            // can use the token until it expires or is deleted.
            localStorage.setItem('token', jwt_token);
            localStorage.setItem('current_user', current_user)
            console.info('Token generated and added to localStorage.');
            
            this.errors = [];
            self.errors = jsonResponse.errors;
            router.push("/explore");
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
            token: ''
        }
    }

});

const LogOut = Vue.component('logout', {
    template: `
        <div id="logout" align="center">
        <img class="logoutpic" :src="'/static/css/camera.png'" align="middle"><br>
            <h3> Do you really want to log out? </h3><br>
            
            <button class="btn btn-primary" v-on:click="logout">Log Out</button>
            <router-link to="/" class="btn btn-primary"> Go home</router-link>
            </div>
        </div>
    
    `,
    methods: {
        logout : function(){
        let self = this;
        this.token = localStorage.getItem('token');
        let Logout = document.getElementById('logout');
        fetch("/api/auth/logout", {
        method: 'GET',
        headers: {
            'X-CSRFToken': token,
            'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
        // display a success message
            this.errors = [];
            self.errors = jsonResponse.errors;
            localStorage.removeItem('token');
            localStorage.removeItem('current_user');
            router.push("/");
            alert("You've been logged out")
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
            token: ''
        }
    }

});

const MyProfile = Vue.component("MyProfile",{
    template:`
    <div>
     <div id="profile" class="container shadow jumbotron sticky-top" >
                    <div class="row">
                        <div> 
                            <img class="displayphoto" v-bind:src="data.profile_photo" />
                        </div>
                        <div >
                            <div>
                                <h4>{{data.firstname}}<span> {{data.lastname}}</span></h4>
                                <br>
                                <p class="lead">{{data.location}} <br>Member since {{data.joined}}</p>
                                <p class="lead">{{data.biography}}</p> 
                            </div>
                            <div class="row col-lg-6 col-md-3">
                                <div >
                                    <h4><span class="colors">{{postamt}}</span></br>Posts</h4>
                                
                                    <h4><span class="colors">{{follows}}</span></br>Followers</h4>
                                </div>
                            </div>
                            <div class="col-lg-8 float-right followbutton col-md-6">
                                <form method="POST" @submit.prevent="follow">
                                    <input  id='userid' type="hidden" :value=data.id >
                                    <div v-if="toshow=='Yes'">
                                        <button id='follow' class="btn btn-primary col-lg-12 col-md-6" >Follow</button>
                                    </div>
                                    <div v-else>
                                        <button disabled class="btn btn-success col-lg-12 col-md-6" >Follow</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container" v-if="posts.length > 0">
                    <div class="row" v-for='n in rows'>
                        <hr class="col-md-11">
                        <div v-if="n-1 < posts.length" class="col-lg-4"> 
                            <img class="postphotos" v-bind:src="posts[n-1]['photo']" />
                        </div>
                        <div v-if="n-1+1 < posts.length" class="col-lg-4"> 
                            <img class="postphotos" v-bind:src="posts[n-1+1]['photo']" />
                        </div>
                        <div v-if="n-1+2 < posts.length" class="col-lg-4">
                           <img class="postphotos" v-bind:src="posts[n-1+2]['photo']" />
                        </div>

                    </div>
                </div>
                <div v-else>
                    <h3>No posts yet</h3>
                </div>
            </div>
            </div>
`,
        methods:{
        follow: function(){
            let self = this;
            let followid=document.getElementById('userid').value;
            let followcount=document.getElementById('followers').innerHTML;
            followcount=parseInt(followcount)+1;
            data = new FormData(body);
            fetch('/api/users/'+followid+'/follow',{
                method:'POST',
                body:data,
                headers:{
                    'X-CSRFToken' : token,
                    'Authorization': 'Bearer '  + localStorage.getItem('token')
                },
                credentials:'same-origin'
            })
            .then(function(response){
                return response.json();
            })
            .then(function(jsonResonse){
                self.response = jsonResonse.message;
                //console.log(jsonResonse);

                if(jsonResonse.newRelationship == 'true'){
                    fetch('/api/users/' + self.$route.params.user_id + '/follow',{
                        method:'GET',
                        headers:{
                            'X-CSRFToken' : token,
                            'Authorization': 'Bearer '  + localStorage.getItem('token')
                        },
                        credentials:'same-origin'
                    })
                    .then(function(response){
                        return response.json();
                    })
                    .then(function(jsonResonse){
                        //console.log(jsonResonse)
                        if (jsonResponse.response){
                            alert("User Followed!");
                            document.getElementById('followers').innerHTML=updatefollows;
                            document.getElementById('follow').disabled=true;
                            document.getElementById('follow').classList.remove('btn-primary');
                            document.getElementById('follow').classList.add('btn-success');
                        }
                    })
                }
            })
        }
    },
    created: function(){
            let self = this;
            this.token = localStorage.getItem('token');
            let current_user = localStorage.getItem('current_user')
            fetch('/api/users/' + this.$route.params.current_user,{
                method:'GET',
                body:{},
                headers:{
                    'X-CSRFToken' : token,
                    'Authorization': 'Bearer '  + localStorage.getItem('token')
                },
                credentials:'same-origin'
            })
            .then(function(response){
                return response.json();
            })
            .then(function(jsonResponse){
                if (jsonResponse.response){
                    self.posts=jsonResponse.response['0']['posts']['0'];
                    self.rows=Math.ceil((self.posts.length/self.columns));
                    self.numposts=jsonResponse.response['0']['postamt'];
                    self.follows=jsonResponse.response['0']['follows'];
                    self.data=jsonResponse.response['0']['data'];
                    if((jsonResponse.response['0']['current']==='No' &&  jsonResponse.response['0']['following']==='No')===true){
                        self.toshow='Yes';
                    }
                    if(jsonResponse.response['0']['current']==='No' && jsonResponse.response['0']['following']==='Yes'){
                            self.isfollowing='You already follow '+self.data['username'];
                    }
                }
                else{
                        self.error=jsonResponse.error['error'];
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
},
    data:function(){
    return {
            token: token, 
            posts: [],
            follows:0,
            postamt:0,
            data:[],
            isfollowing:'',
            error:'',
            toshow:'',
            columns:3,
            rows:0
            
    }
  }  
});



const Explore = Vue.component('explore', {
   template: `
   <div class="container">
             <div class="row">
                <div v-if="posts.length>0" class="row col-md-7 float-left">
                    <div class="jumbotron shadow" v-for="post in posts">
                        <div class="row">
                            <img class="postuserphoto" v-bind:src="post.userphoto"> <h5 class="align-middle" >{{post.username}}</h5>
                        </div>
                        <br>
                        <div>
                            <img class="img-fluid postimages" v-bind:src="post.photo"/>
                        </div>
                        <br>
                        <p class="caption">{{post.caption}}</p>
                        <div class="row">
                            <div v-if="post.l=='No'">
                                    <img :id=post.id v-on:click="like(post.id)" style="width:35px; height:35px" v-bind:src="'static/uploads/like.png'" />
                            </div>
                            <div v-else>
                                    <img style="width:35px; height:35px" v-bind:src="'static/uploads/like.png'" />
                            </div>
                        <p>Likes: <span :id="'like'+post.id">{{post.likes}}</span></p></div>
                        <p>{{post.created_on}}</p>
                    </div>
                </div>
                <div class="jumbotron" v-else>
                    <h5> No Posts</h5>
                </div>
                <div id="newpost" class="col-md-5">
                    <button class="btn btn-primary" v-on:click="newpost">New Post</button>
                </div>
                </div>
            </div>
        </div>
  `,
   methods : {
    created : function(){
        let self = this;
        this.token = localStorage.getItem('token');
        fetch("/api/posts", {
        method: 'GET',
        headers: {
            'X-CSRFToken': token,
            'Authorization': 'Bearer '  + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
        // display a success message'
            this.posts = jsonResponse.response['0']['posts'];
            this.errors = [];
            self.errors = jsonResponse.errors;
            console.log(this.posts);
        })
        .catch(function (error) {
            console.log(error);
        });
                },
    newpost : function(event){
        
        router.push("/posts/new");
    },
    like: function(postid){
                let self= this;
                let count=document.getElementById('like'+postid).innerHTML;
                count=parseInt(count)+1;
                fetch("/api/posts/"+postid+"/like", { 
                    method: 'POST',
                    headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                            'X-CSRFToken': token
                        },
                    credentials: 'same-origin'
                    })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (jsonResponse) {
                        if (jsonResponse.response){
                            document.getElementById('like'+postid).innerHTML=count;
                            document.getElementById(postid).disabled=true;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
        }
        
        },
    data : function(){
        return {
            errors:[],
            token: token,
            posts: [],
            response: []
        }
    }

});

const NewPost = Vue.component('post', {
   template: `
   <div class= "form" >
   <link rel="stylesheet" type="text/css" href="static/css/main.css">
        <p v-if="errors.length" class="alert alert-danger">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
   
       <form id= "PostForm" class="form-login" @submit.prevent="Post" method="post" enctype="multipart/form-data">
            <h2>New Post</h2>
          
            <div class="form-group">
            
            <label>Photo</label>
            <input type="file" name="photo" class="form-group form-control">
            
            <label>Caption</label>
            <textarea name="caption" class="form-group form-control"> </textarea>
    
            <input type="submit" class="btn btn-primary" >
                
            </div>
        </form>
    </div>
   `,
   methods : {
    Post : function(){
        let self = this;
        this.token = localStorage.getItem('token');
        let PostForm = document.getElementById('PostForm');
        let form_data = new FormData(PostForm);
        let current_user = localStorage.getItem('current_user');
        fetch("/api/users/"+current_user+"/posts", {
        method: 'POST',
        body : form_data,
        headers: {
            'X-CSRFToken': token,
            'Authorization': 'Bearer '  + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
        // display a success 
            this.errors = [];
            self.errors = jsonResponse.errors;
            router.push("/explore");
            alert("Post added!")
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
            response: '',
            token: ''
        }
    }
});

const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        {path: "/login", component: Login},
        {path: "/register", component: Register},
        {path: "/logout", component: LogOut},
        {path: "/explore", component: Explore},
        {path: "/users/:user_id", component: MyProfile},
        {path: "/posts/new", component: NewPost},
        
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});