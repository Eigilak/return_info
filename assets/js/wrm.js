
Vue.component('app',{ });

var app = new Vue({
   el:'.woocommerce_return_manager',
   data:{
         returnForm1:true,
         returnForm2:false,
         order_products:{},
         find_orderForm: new Form({
            customer_email:'mm@lundbrandhouse.dk',
            order_id:'15820',
            product_name:''
         }),
   },
   methods:{

      get_order_by_id_email(){

         axios.get(ajax_object.ajax_url+
             '?action=get_customer_by_id_and_email' +
             '&order_id='+ this.find_orderForm.order_id+
             '&customer_email='+this.find_orderForm.customer_email)
             .then(
                 ({data})=>(this.order_products = data),
                 this.returnForm1=false,
                 this.returnForm2 = true,
             )
      },
      confirm_cause: function () {
         openReturnportal('https://return.shipmondo.com/pureleaf_dk?name=hans&reference=16000&?');
      }

   }
});

$('#return_type').selectWoo();
