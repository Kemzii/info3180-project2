Vue.component('app-header', {
    template: `
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
  <a class="navbar-brand" href="#">Photogram</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="{{ url_for('home') }}">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item active">
        <a class="nav-link" href="{{ url_for('explore') }}">Explore</a>
      </li>
      <li class="nav-item active">
        <a class="nav-link" href="{{ url_for('myprofile') }}">My Profile</a>
      </li>
    </ul>
    <ul class="navbar-nav">
      <div v-if="isLoggedIn">
        <li class="nav-item active">
              <a class="nav-link" href="{{ url_for('logout') }}">Logout</a>
            </li>
      </div>
      <div v-else>
        <li class="nav-item active">
              <a class="nav-link" href="{{ url_for('login') }}">Login</a>
            </li>
      </div>
    </ul>
  </div>
</nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        ***design home page***
    </div>
   `,
    data: function() {
       return {}
    }
});



// Define Routes
const router = new VueRouter({
    routes: [
        { path: "/", component: Home }
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});