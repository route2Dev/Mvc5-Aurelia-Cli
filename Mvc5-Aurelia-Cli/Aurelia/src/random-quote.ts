import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class RandomQuote {
    heading = "Random Quote";

    randomQuote = "";

    constructor (private httpClient: HttpClient) {        
    }

    activate() {
        return this.getQuote();
    }

    getQuote() {       

        return this.httpClient.fetch("api/random-quote")
            .then(response => response.text())
            .then(data => this.randomQuote = data)                           
            .catch(error => {
                console.log("Error getting quote.");
        });        
    }
}