(function () {
    if (document.getElementById("chatbot-script")) return;

    var container = document.createElement("div");
    container.id = "chatbot-root";
    document.body.appendChild(container);

    var script = document.createElement("script");
    script.src = "http://mindx-chatbot-bucket.s3-website-us-east-1.amazonaws.com/assets/index-C7FXQsOy.js"; // Fixed filename
    script.id = "chatbot-script";
    script.defer = true;
    document.body.appendChild(script);
})();
