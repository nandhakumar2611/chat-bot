
  

  (function () {
    var w = window;
    var chatbot = w.ChatBotWidget;
  
    if (typeof chatbot === "function") {
      chatbot("update", w.chatbotSettings);
    } else {
      var d = document;
      var i = function () { i.c(arguments); };
      i.q = [];
      i.c = function (args) { i.q.push(args); };
      w.ChatBotWidget = i;
  
      w.chatbotSettings = {
        api_base: "https://your-api.com",  // Update if needed
        chatbot_url: "https://YOUR_BUCKET_NAME.s3-website-<region>.amazonaws.com",
        user_id: user?.id || null,  
        name: user?.name || "Guest",  
        email: user?.email || null,  
        created_at: user?.createdAt || null
      };
  
      var l = function () {
        var s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = w.chatbotSettings.chatbot_url + "/chatbot.js";  // Load your chatbot JS
        var x = d.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
      };
  
      if (document.readyState === "complete") {
        l();
      } else if (w.attachEvent) {
        w.attachEvent("onload", l);
      } else {
        w.addEventListener("load", l, false);
      }
    }
  })();
  