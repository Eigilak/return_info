class Success {
    constructor() {
        this.success = {}
    }

    record(success)
    {
        this.success = success;
    }

    get()
    {
        if(this.success){
            return this.success[1]
        }
    }
    clear(){
        setTimeout(()=>{this.success= {}},2000)
    }
}

class Errors {

    constructor() {
        this.errors = {};
    }

    has(field){
        return this.errors.hasOwnProperty(field);
    }

    any(){
        return Object.keys(this.errors).length > 0;
    }

    get(field){
        if(this.errors[field]){
            return this.errors[field][0];
        }
    }

    record(errors){
        this.errors = errors;
    }

    clear(field){
        if(field){
            delete this.errors[field];
            return;
        }
        this.errors = {}
    }
}

class Form {

    constructor(data) {
        this.originalData = data;

        for (let field in data )
        {
            this[field] = data[field];
        }
        this.success = new Success();
        this.errors = new Errors();
    }

    data(){
        let data = {};

        for (let property in this.originalData) {
            data[property] = this[property];
        }

        return data;

    }

    reset() {
        for (let field in this.originalData) {
            this[field] = '';
        }

        this.errors.clear();
    }

    /**
     * Send a POST request to the given URL.
     * .
     * @param {string} url
     */
    post(url,params) {
        return this.submit('post', url,params);
    }

    /**
     * Send a PUT request to the given URL.
     * .
     * @param {string} url
     */
    put(url) {
        return this.submit('put', url);
    }
    /*get request*/
    get(url){
        return this.submit('get', url)
    }

    /**
     * Send a PATCH request to the given URL.
     * .
     * @param {string} url
     */
    patch(url) {
        return this.submit('patch', url);
    }

    /**
     * Send a DELETE request to the given URL.
     * .
     * @param {string} url
     */
    delete(url) {
        return this.submit('delete', url);
    }

    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     */
    submit(requestType, url, params) {
        return new Promise((resolve, reject) => {
            axios[requestType](url, params)
                .then(response => {
                    /*This is related to wp's json reponse success*/
                    if(response.data.success){
                        this.onSuccess(response.data);
                        resolve(response.data);
                    } else {
                        throw new Error()
                    }
                })
                .catch(error => {
                    this.onFail(error.response.data);
                    reject(error.response.data);
                    this.success = false
                });
        });
    }

    /**
     * Handle a successful form submission.
     *
     * @param {object} data
     */
    onSuccess(data) {
    }
    onFail(errors) {
        this.errors.record(errors);
    }

}

class User {
    constructor() {
        this.users = {};
    }
}
