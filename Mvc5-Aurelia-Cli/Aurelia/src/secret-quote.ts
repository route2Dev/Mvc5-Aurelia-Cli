import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class RandomQuote {
    heading = "Super Secret Quote";

    secretQuote = "";

    constructor (private httpClient: HttpClient) {        
    }

    activate() {      

        return this.httpClient.fetch("api/protected/random-quote")
            .then(response => response.text())
            .then(data => this.secretQuote = data)            
                           
            .catch(error => {
                console.log("Error getting quote.");
            });
    }
}