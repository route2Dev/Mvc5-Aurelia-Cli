import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class RandomQuote {
    heading = "Super Secret Quote";

    secretQuote = "";

    constructor (private httpClient: HttpClient) {        
    }

    activate() {
        this.httpClient.configure(config => {
            config.useStandardConfiguration()
            .withBaseUrl("http://localhost:3001/api/");
        });

        return this.httpClient.fetch("protected/random-quote")
            .then(response => response.text())
            .then(data => this.secretQuote = data)            
                           
            .catch(error => {{
                console.log("Error getting quote.");
            }});
    }
}