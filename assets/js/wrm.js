
var checkVueEl = document.getElementsByClassName('woocommerce_return_manager');
if (checkVueEl.length > 0) {
    // elements with class "snake--mobile" exist
    var app = new Vue({
        el: '.woocommerce_return_manager',
        initVal:'',
        data: function() {
            return{
                loading:false,
                step1:true,
                step2:false,
                step3:false,
                counter:'1',
                disabled:false,
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
                    order_id: '',
                    nonce:local.fc_nonce,
                    email2:''
                }),
                return_orderForm: new Form({
                    requestGot:false,
                    return_order_id:'',
                    comment:'',
                    order_products:{},
                    nonce:local.fc_nonce,
                }),
                check_order_date: new Form({
                    nonce:local.fc_nonce,
                    order_id:'',
                    free_return_days:'',
                    complaint_years:''
                })
            }
        },
        methods: {
            get_order_by_id_email() {
                this.counter++;
                this.loading = true;

                if(this.counter ===10){
                    this.disabled=true
                }
                var JSON_response='';
                JSON_response = JSON.stringify(this.find_orderForm);
                var params = new URLSearchParams();
                params.append('find_customer', JSON_response);
                params.append('action', 'get_customer_by_id_and_email');
                params.append('Content-Type','application/x-www-form-urlencoded');
                that = this
                grecaptcha.ready(function() {
                    grecaptcha.execute(local.g_recaptcha, {action: 'submit'}).then(function(token) {
                        that.find_orderForm
                            .post(local.ajax_url, params)
                            .then(
                                  (
                                    response => (
                                        that.return_orderForm.order_products =response.data,
                                            that.afterFindCustomer(response.success),
                                        that.check_purchase_method()
                                    )
                                  ),
                            ).catch(
                                setTimeout(function () {
                                    that.loading=false
                                },1200)
                        )
                    });
                });
            },
            check_purchase_method(){

                this.check_order_date.order_id = this.find_orderForm.order_id

                var JSON_response='';
                JSON_response = JSON.stringify(this.check_order_date);
                var params = new URLSearchParams();
                params.append('check_order_date_JSON', JSON_response);
                params.append('action', 'check_order_date');

                this.check_order_date
                    .post(local.ajax_url,params)
                    .then
                    (
                        (
                            response =>(
                                this.check_order_date = response.data
                            )
                        )
                    ).catch(
                        response =>(
                            console.log(response.data)
                        )
                    )
            },
            afterFindCustomer(response){
                if(response === true){
                    this.return_orderForm.return_order_id =this.find_orderForm.order_id;
                    this.step1=false;
                    this.step2=true;
                }
            },
            close_policy_notice(){
             this.check_order_date.claim_return_days = false
             this.check_order_date.free_return_days = false
            }
            ,
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
                this.disabled = true;
                var JSON_response='';
                JSON_response = JSON.stringify(this.return_orderForm);
                var params = new URLSearchParams();
                params.append('return_requesst', JSON_response);
                params.append('action', 'create_return_request');

                this.return_orderForm
                    .post(local.ajax_url, params)
                    .then(
                        (response => (
                            this.customer.name=    response.data['customer'].name,
                            this.customer.address= response.data['customer'].address,
                            this.customer.zipcode= response.data['customer'].zipcode,
                            this.customer.city=    response.data['customer'].city,
                            this.customer.email=   response.data['customer'].email,
                            this.afterReturn(response.success)
                        ))
                    )
            }, afterReturn(response){
                if(response === true){
                    that = this;
                    /*Sæt et interval op at vent til at object customer er sat indtil da vent*/
                    var counter_intervals
                    var interval = setInterval(function() {
                        // get elem
                        if (that.customer.name == null|| that.customer.name ==='undefined' ){
                            console.log('søger...')
                            counter_intervals++
                            if(counter_intervals == 50){
                                clearInterval(interval)
                            }
                            return;
                        }
                        that.shipmondo_modul();
                        that.order_note_pdf()
                        that.return_orderForm.requestGot=true;
                        clearInterval(interval);
                        // the rest of the code
                    }, 100);
                    this.step1=false;
                    this.step2=false;
                    this.step3=true;
                }

            },
                shipmondo_manual: function () {
                    window.open(
                        "https://return.shipmondo.com/"+
                        local.shipmondo_name+"?"+
                        "name="+this.customer.name+
                        "&address="+this.customer.address+
                        "&zip="+this.customer.zipcode+
                        "&city="+this.customer.city+
                        "&email="+this.customer.email+
                        "&emailRepeated="+this.customer.email+
                        "&reference="+this.find_orderForm.order_id+
                        "&")
            }, shipmondo_modul:function () {
                openReturnportal(
                    "https://return.shipmondo.com/"+local.shipmondo_name+"?"+
                    "name="+this.customer.name+
                    "&address="+this.customer.address+
                    "&zip="+this.customer.zipcode+
                    "&city="+this.customer.city+
                    "&email="+this.customer.email+
                    "&emailRepeated="+this.customer.email+
                    "&reference="+this.find_orderForm.order_id+
                    '&'
                    /*"&preview=true&"*/
                )
            },
            order_note_pdf: function () {
                var doc = new jsPDF()

                var pdfName=local.pdf_name;
                var site_logo = local.site_logo;
                /*Logo ( X, Y , Width , Height )*/
                doc.addImage(site_logo,65,5, 80,20);
                /*Notat*/
                doc.text(local.package_message, 10, 35);
                /*Order number row with txt and order id*/
                doc.text(local.order_number_txt+':', 10, 45); doc.text(this.find_orderForm.order_id,50,45);
                /*Customer name*/
                doc.text(local.name_txt+':',10,55); doc.text(this.customer.name,50, 55)
                doc.text(local.products_txt+':', 10, 65);

                var productTable = [];

                var start_y_position = 80;
                this.return_orderForm.order_products.forEach(function (item,index) {
                    if(item.enableReturn === true)
                    {
                        productTable.push([item.product_name,item.return_type,item.return_action,item.return_size,item.return_material])
                    }
                });

                doc.autoTable({
                    styles: {lineWidth: number = 0.25,lineColor: Color = [0,0,0]},
                    margin: { top: 70,left:10 },
                    head:[[local.product_name_title,local.reason_title,local.action_title,local.size_title,local.material_title]],
                    body:productTable,
                    theme: 'plain'
                });

                doc.save(pdfName+'#'+this.find_orderForm.order_id);

            }
        }
    });
}
