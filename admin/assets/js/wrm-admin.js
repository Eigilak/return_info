
var checkVueAdmin = document.getElementsByClassName('wrm_admin');


if(checkVueAdmin.length > 0){

    var adminApp =
        new Vue({
            el:'.wrm_admin',
            data(){
                return{
                    errors:[],
                    search_keys:'',
                    orders:[],
                    loaded:false,
                    page:1,
                    perPage:20,
                    pages:[],
                    loaded_pagination:true,
                    deleteOrderForm: new Form({
                        id:'',
                        nonce: local.fc_nonce
                    })
                }
            },
            methods:{
                setPages () {
                    this.pages=[]
                    let numberOfPages = Math.ceil(this.orders.length / this.perPage);
                    for (let index = 1; index <= numberOfPages; index++) {
                        this.pages.push(index);
                    }
                },
                paginate (orders) {
                    let page = this.page;
                    let perPage = this.perPage;
                    let from = (page * perPage) - perPage;
                    let to = (page * perPage);
                    return  orders.slice(from, to);
                },
                deleteOrder(id,name,order){

                    if(confirm(local.confirm_msg+' '+name+'s '+local.request_msg+'?'))
                    {
                        this.deleteOrderForm
                            .post('/wp-admin/admin-ajax.php?action=delete_order&returned_id='+id+'&nonce='+local.fc_nonce)
                            .then(
                                (
                                    response=>(
                                        console.log(response)
                                    )
                                ),
                                this.orders.splice(this.orders.indexOf(order), 1),
                                this.setPages()
                             )
                    }
                },
                get_orders(){
                    this.orders=[]
                    axios.get('/wp-admin/admin-ajax.php?action=init_get_orders')
                        .then(
                            (
                                response=>(
                                    this.orders = response.data.data.reverse()
                                )
                            )

                        ).then(
                             this.loaded= true
                        )
                }
            },
            computed:{
                filtered_orders:function() {
                    if(this.search_keys.length !=0) {
                        return this.orders.filter((order)=>{
                            this.loaded_pagination=false;
                            return order.name.toLowerCase().match(this.search_keys.toLowerCase())
                                || order.order_id.toLowerCase().match(this.search_keys.toLowerCase())
                        });
                    }else {
                        this.loaded_pagination=true;
                        return this.paginate(this.orders);
                    }
                }

            },
            watch:{
                orders() {
                    this.setPages();
                }
            },
            created(){
                this.get_orders()
            },
            filters: {
                trimWords(value){
                    return value.split(" ").splice(0,20).join(" ") + '...';
                }
            }




        })

}
/*

if(this.search_keys.length !=0){
    console.log('der er noget i mig')
} else {

}

axios.get('/wp-admin/admin-ajax.php?action=search_orders&search_query='+this.search_keys)
    .then(
        response=>(
            console.log(response.data)
        )
    )*/
