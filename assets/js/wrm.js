
var checkVueEl = document.getElementsByClassName('woocommerce_return_manager');
if (checkVueEl.length > 0) {
    // elements with class "snake--mobile" exist
    var app = new Vue({
        el: '.woocommerce_return_manager',
        initVal:'',
        data: {
                step1:true,
                step2:false,
                step3:false,
                customer:{
                    name:null,
                    address:null,
                    zipcode:null,
                    city:null,
                    email:null,
                },
                enableLoading:false,
                find_orderForm: new Form({
                    customer_email: 'mm@lundbrandhouse.dk',
                    order_id: '15820'
                }),
                return_orderForm: new Form({
                    requestGot:false,
                    return_order_id:'',
                    order_products:{},
                })
        },
        methods: {
            get_order_by_id_email() {
                this.find_orderForm.get(local.ajax_url +
                    '?action=get_customer_by_id_and_email' +
                    '&order_id=' + this.find_orderForm.order_id +
                    '&customer_email=' + this.find_orderForm.customer_email)
                    .then(
                        (data => ( this.return_orderForm.order_products =data)),
                        this.return_orderForm.return_order_id =this.find_orderForm.order_id,
                    )
                    this.step1=false;
                    this.step2=true;
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
                    .post(local.ajax_url, params)
                    .then(
                        (data => (
                            this.customer.name=    data['customer'].name,
                            this.customer.address= data['customer'].address,
                            this.customer.zipcode= data['customer'].zipcode,
                            this.customer.city=    data['customer'].city,
                            this.customer.email=   data['customer'].email
                        )),
                        this.return_orderForm.requestGot=true,
                    )
                that = this;
                /*Sæt et interval op at vent til at object customer er sat indtil da vent*/
                var counter_intervals
                var interval = setInterval(function() {
                    // get elem
                    if (that.customer.name == null|| that.customer.name ==='undefined' ){
                        counter_intervals++
                        if(counter_intervals == 50){
                            clearInterval(interval)
                        }
                        return;
                    }
                    that.shipmondo_modul();
                    clearInterval(interval);
                    // the rest of the code
                }, 100);
                this.step1=false;
                this.step2=false;
                this.step3=true;

            },
                shipmondo_manual: function () {
                    window.open(
                        "https://return.shipmondo.com/pureleaf_dk?"+
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
                    "https://return.shipmondo.com/pureleaf_dk?"+
                    "name="+this.customer.name+
                    "&address="+this.customer.address+
                    "&zip="+this.customer.zipcode+
                    "&city="+this.customer.city+
                    "&email="+this.customer.email+
                    "&emailRepeated="+this.customer.email+
                    "&reference="+this.find_orderForm.order_id+
                    "&preview=true&"
                )
            },
            test_pdf: function () {
                this.customer.name = 'Hans';
                var doc = new jsPDF()

                var pdfName=local.pdf_name;
                var site_logo = 'data:image/png;base64,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'
                /*Logo*/
                doc.addImage(site_logo,10,10);

                /*Notat*/
                doc.text(local.package_message, 10, 50);
                /*Order number row with txt and order id*/
                doc.text(local.order_number_txt+':', 10, 65); doc.text(this.find_orderForm.order_id,50,65);
                /*Customer name*/
                doc.text(local.name_txt+':',10,70); doc.text(this.customer.name,50, 70)
                doc.text(local.products_txt+':', 10, 75);

                var start_y_position = 85;
                this.return_orderForm.order_products.forEach(function (item,index) {
                    if(item.enableReturn === true)
                    {
                        doc.text(10,start_y_position,item.product_name);
                        doc.text(70,start_y_position,item.return_type);
                        doc.text(130,start_y_position,item.return_action);
                        if(item.return_size && item.return_material.length === 0){
                            doc.text(160,start_y_position,item.return_size);
                        }else if(item.return_size && item.return_material){
                            doc.text(160,start_y_position,item.return_size)
                            doc.text(180,start_y_position,item.return_material)
                        }else if(item.return_size===0 && item.return_material){
                            doc.text(160,start_y_position,item.return_material)
                        }

                        start_y_position += 8;
                    }

                });

                doc.save(pdfName+'#'+this.find_orderForm.order_id)
            }
        }
    });
}
