

var checkVueEl = document.getElementsByClassName('woocommerce_return_manager');
if (checkVueEl.length > 0) {
    // elements with class "snake--mobile" exist
    var app = new Vue({
        el: '.woocommerce_return_manager',
        initVal:'',
        data: {
                customer:{
                    name:null,
                    address:null,
                    zipcode:null,
                    city:null,
                    email:null,
                },
                enableLoading:false,
                find_orderForm: new Form({
                    customer_email: '',
                    order_id: ''
                }),
                return_orderForm: new Form({
                    requestGot:false,
                    return_order_id:'',
                    order_products:[],
                })
        },
            methods: {
                get_order_by_id_email() {

                    this.find_orderForm.get(ajax_object.ajax_url +
                        '?action=get_customer_by_id_and_email' +
                        '&order_id=' + this.find_orderForm.order_id +
                        '&customer_email=' + this.find_orderForm.customer_email)
                        .then(
                            (data => ( this.return_orderForm.order_products =data)),
                            this.return_orderForm.return_order_id =this.find_orderForm.order_id,
                        )
                },
                enable_select(){
                    setTimeout(function () {
                        $('#return_type , #return_action').select2({
                            width: '100%',
                            minimumResultsForSearch: Infinity,
                            dropdownParent: $('.return_step_2')
                        });
                    },100);
                },
                submit_return_order_form: async function () {
                    /*Array af order skal laves til JSON*/
                    var JSON_response='';
                    JSON_response = JSON.stringify(this.return_orderForm);
                    var params = new URLSearchParams();
                    params.append('returned_products', JSON_response);
                    params.append('action', 'create_return_request');

                    this.return_orderForm
                        .post(ajax_object.ajax_url, params)
                        .then(
                            (data => (
                                this.customer.name=data['customer'].name,
                                this.customer.address=data['customer'].address,
                                this.customer.zipcode=data['customer'].zipcode,
                                this.customer.city=data['customer'].city,
                                this.customer.email=data['customer'].email
                            )),
                            this.return_orderForm.requestGot=true,
                        )
                    that = this;

                    /*Sæt et interval op at vent til at object customer er sat indtil da vent*/
                    var interval = setInterval(function() {
                        // get elem
                        if (that.customer.name == null){
                            console.log('venter');
                            return;
                        }
                        that.shipmondo_modul();
                        clearInterval(interval);
                        // the rest of the code
                        console.log('fundet!')

                    }, 100);
                },
                    shipmondo_manual: function () {
                        /*href="https://return.shipmondo.com/pureleaf_dk" target="_blank"*/
                }, shipmondo_modul:function () {
                    openReturnportal(
                        "https://return.shipmondo.com/pureleaf_dk?"+
                        "name="+this.customer.name+
                        "&address="+this.customer.address+
                        "&zip="+this.customer.zipcode+
                        "&city="+this.customer.city+
                        "&email="+this.customer.email+
                        "&emailRepeated="+this.customer.email+
                        "&"
                    )

                }
        }
    });
}
/*
this.return_orderForm.order_products,*/
