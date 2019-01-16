<template>
  <div id="app" class="container">
    <div class="input-group input-group-lg bottom">
      <div class="input-group-prepend">
        <span class="input-group-text">Search by image</span>
      </div>
     <!-- <input type="file" 
        class="form-control col-md-6" 
        @keyup.prevent="search"
        v-model="query" /> !-->
    <!-- <div v-if="!image"> -->
    <input type="file" class="form-control col-md-6"  @change="search1">

  <!-- <div v-else>
    <img :src="image" />
    <button @click="removeImage">Remove image</button>
  </div> -->

    </div>
    <br> <br>
  <div  class="row">
    <div v-if="data" v-for="(result, index) in data" 
      :key="result"
      :ref="`card_${result}`"
         class="col-md-3" >
         <div class="panel panel-default panel-front">
           <div class="panel-heading">
              <h4 class="card-title">{{result.index}}</h4>
               <img class="img-responsive" :src="'src/0/'+(result.index)+'.jpg'"> 

            </div>
           
    </div>
  </div>
  </div>

  </div>
</template>


<script>

export default {
  data() {
    return {
      query: '',
      data: []
    }
  },
  methods: {
    search1(e) {
            var files = e.target.files || e.dataTransfer.files;
 console.log( files[0].name) ; 

var txtFile = './eh1.txt';
//console.log(files[0].name) ;

        this.axios.get('http://localhost:5000/search?q='+files[0].name)
              .then(response => {
                this.data = response.data;
                console.log(response.data);
          })


    },
    search() {
        this.axios.get('http://localhost:5000/search?q='+this.query)
              .then(response => {
                this.data = response.data;
               // console.log(response.data);
          })
    }
  }
}


</script>

<style>
body {
  background-color: #E1E7E7;
}

  .bottom {
    margin-top: 50px;
    margin-left: 200px;
  }
.row {
  display: flex;
  justify-content: center;
  align-items: center;  
  min-width: 780px;
  width: 100%;
  height: 400px;
}
.panel-heading {
  padding-top: 5px;
}
.col-md-3 {
  position: relative;
  background-color: #FFFFFF;
  height: 350px;
  width: 240px;
  margin: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5);
}
.img-responsive {
  position: absolute;
  left: -9999px;
  right: -9999px;
  margin: auto;
  height: 220px;
  min-width: 100%;
}
.panel-body {
  position: absolute;
  bottom: 0;
  height: 20px;
  padding-bottom: 30px;
  font-family: Helvetica;
}
.card-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
}
.card-title {
  font-family: Serif;
}
</style>

