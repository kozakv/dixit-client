window.VERSION = "0.0.1";

function init() {
  console.log("Initializing application.");
  document.body.innerHTML = JST.main({ version: VERSION });
}
