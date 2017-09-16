/**
 * Main client application class
 */
class App {
    /**
     * Acquire all dependencies
     */
    constructor(/*your injections here*/) {
    }

    /**
     * Initialize application
     */
    Startup() {
        console.log('App.Startup');

        let title = document.createElement("h1");

        title.className = "btn btn-lg btn-primary fa fa-thumbs-up";
        title.innerHTML = " Base Node";

        document.body.appendChild(title);
    }
}

export {App}