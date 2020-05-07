

var checkVueEl = document.getElementsByClassName('woocommerce_return_manager');
if (checkVueEl.length > 0) {
    // elements with class "snake--mobile" exist
    var app = new Vue({
        mode: 'production',
        el: '.woocommerce_return_manager',
        initVal:'',
        data: {
                test:[],
                enableLoading:false,
                find_orderForm: new Form({
                    returnForm1: true,
                    returnForm2: false,
                    customer_email: 'mm@lundbrandhouse.dk',
                    order_id: '15820'
                }),
                return_orderForm: new Form({
                    return_order_id:'',
                    order_products:{},
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
                        .then(
                        );
                },
                confirm_cause: function () {

                    /*openReturnportal('https://return.shipmondo.com/pureleaf_dk?name=hans&reference=16000&?');*/
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
                submit_return_order_form:function () {
                    /*Array af order skal laves til JSON*/
                    var JSON_response='';
                    JSON_response = JSON.stringify(this.return_orderForm);
                    var params = new URLSearchParams();
                    params.append('returned_products', JSON_response);
                    params.append('action', 'create_return_request');

                    this.return_orderForm
                        .post(ajax_object.ajax_url, params)
                        .then(response => {

                        });
                },
                checkActionChoice: function(indexNumber){
                    console.log(indexNumber);


                }
        }
        ,mounted: function () {
        }
    });
}
/*
this.return_orderForm.order_products,*/
