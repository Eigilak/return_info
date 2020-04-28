
Vue.component('app',{ });

var app = new Vue({
   el:'.woocommerce_return_manager',
   data:{
      return_email:'',
      return_order_id:'',
      order_number:''
   },
   methods:{
      go_to_shipmondo: function () {
         openReturnportal('https://return.shipmondo.com/pureleaf_dk?name=hans&reference=16000&?');
      }

   }


});



jQuery(document).ready(function($){


});