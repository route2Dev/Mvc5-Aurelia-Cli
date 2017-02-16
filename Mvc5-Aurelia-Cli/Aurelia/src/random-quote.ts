import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class RandomQuote {
    heading = "Random Quote";

    randomQuote = "";

    constructor (private httpClient: HttpClient) {        
    }

    activate() {
        this.httpClient.configure(config => {
            config.useStandardConfiguration()
            .withBaseUrl("http://localhost:3001/api/");
        });

        return this.httpClient.fetch("random-quote")
            .then(response => response.text())
            .then(data => this.randomQuote = data)                           
            .catch(error => {{
                console.log("Error getting quote.");
            }});
    }
}