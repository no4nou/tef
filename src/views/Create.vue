<template>
  <div class="create">
    <div class="container p-0">
        <div class="card px-4">
          <p class="py-3">{{ title }}</p>
            <div class="row gx-3">
              <div class="col-12">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">Фон формы</p>
                        <color-picker v-model="color" @onOpen="onOpen" @onClose="onClose" />
                    </div>
                </div>
                <div class="col-12">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">API ключ</p>
                        <input class="form-control mb-3" v-model="apiKey" placeholder="key" >
                    </div>
                </div>
                <div class="col-12">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">Название платежа</p>
                        <input class="form-control mb-3" v-model="title" placeholder="Реквизиты" >
                    </div>
                </div>
                <div class="col-12">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">Цена</p>
                        <input class="form-control mb-3" v-model="cost" placeholder="100" >
                    </div>
                </div>
                <div class="col-12">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">Ссылка после оплаты</p>
                        <input v-model="successUrl" class="form-control mb-3" placeholder="https://">
                    </div>
                </div>
                <div class="col-12" v-if="endUrl !== ''">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">Готовая ссылка</p>
                        <textarea class="form-control mb-3" v-model="endUrl"></textarea>
                    </div>
                </div>
                <div class="col-12">
                    <div v-on:click="createUrl()" class="btn btn-primary mb-3">
                        <span class="ps-3">Создать ссылку</span>
                        <span class="fas fa-arrow-right"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { skey } from '../config/data_em.js'

export default {
  name: 'Create',
  data () {
    return {
      title: 'Реквизиты',
      cost: '',
      successUrl: '',
      endUrl: '',
      color: '#0C4160',
      apiKey: ''
    }
  },
  mounted () {
    document.title = this.title
    if (localStorage.getItem('bg-c') !== null) {
      this.color = localStorage.getItem('bg-c')
    }
    if (localStorage.getItem('api') !== null) {
      this.apiKey = localStorage.getItem('api')
    }
  },
  watch: {
    color: function () {
      document.body.style.backgroundColor = this.color
    },
    title: function (val) {
      document.title = val
    }
  },
  methods: {
    onOpen() {
      console.log("open");
    },
    onClose(color) {
      console.log("close", color);
    },
    createUrl () {
      const str = btoa(JSON.stringify({
        cost: this.cost,
        success: this.successUrl,
        color: this.color,
        title: unescape(encodeURIComponent(this.title)),
        key: this.apiKey
      }), skey)
      localStorage.setItem('bg-c', this.color)
      localStorage.setItem('api', this.apiKey)
      this.endUrl = document.location.protocol + '//' + document.location.host + '/?paym=' + str
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #0C4160;

    padding: 30px 10px;
}
.picker {
  display: inline-block;
  height: 300px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(3, 1, 1, 0.08);
}
.card {
    max-width: 500px;
    margin: auto;
    color: black;
    border-radius: 20 px;
}

p {
    margin: 0px;
}

.container .h8 {
    font-size: 30px;
    font-weight: 800;
    text-align: center;
}

.btn.btn-primary {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background-image: linear-gradient(to right, #77A1D3 0%, #79CBCA 51%, #77A1D3 100%);
    border: none;
    transition: 0.5s;
    background-size: 200% auto;

}


.btn.btn.btn-primary:hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
}



.btn.btn-primary:hover .fas.fa-arrow-right {
    transform: translate(15px);
    transition: transform 0.2s ease-in;
}

.form-control {
    color: white;
    background-color: #223C60;
    border: 2px solid transparent;
    height: 60px;
    padding-left: 20px;
    vertical-align: middle;
}

.form-control:focus {
    color: white;
    background-color: #0C4160;
    border: 2px solid #2d4dda;
    box-shadow: none;
}

.text {
    font-size: 14px;
    font-weight: 600;
}

::placeholder {
    font-size: 14px;
    font-weight: 600;
}
.frame {
  display: none;
}
form {
  display: none;
}
</style>
