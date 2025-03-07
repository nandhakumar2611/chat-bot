(function () {
    if (window.ChatBot) {
      console.warn("ChatBot is already loaded.");
      return;
    }
  
    // Create a global ChatBot object
    window.ChatBot = {
      init: function (options) {
        window.chatbotSettings = options;
        injectChatbot();
      },
      toggle: function () {
        const chatContainer = document.getElementById("chatbot-container");
        if (chatContainer) {
          chatContainer.style.display =
            chatContainer.style.display === "none" ? "block" : "none";
        }
      },
      open: function () {
        const chatContainer = document.getElementById("chatbot-container");
        if (chatContainer) chatContainer.style.display = "block";
      },
      close: function () {
        const chatContainer = document.getElementById("chatbot-container");
        if (chatContainer) chatContainer.style.display = "none";
      },
    };
  
    function injectChatbot() {
      // Prevent multiple injections
      if (document.getElementById("chatbot-container")) return;
  
      // Create a container div
      const chatDiv = document.createElement("div");
      chatDiv.id = "chatbot-container";
      chatDiv.style.position = "fixed";
      chatDiv.style.bottom = "20px";
      chatDiv.style.right = "20px";
      chatDiv.style.width = "400px";
      chatDiv.style.height = "500px";
      chatDiv.style.zIndex = "9999";
      chatDiv.style.background = "white";
      chatDiv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      chatDiv.style.borderRadius = "10px";
      chatDiv.style.overflow = "hidden";
      chatDiv.style.display = "none"; // Initially hidden
  
      // Create an iframe to load the chatbot
      const chatIframe = document.createElement("iframe");
      chatIframe.src = "https://mindx-chatbot-bucket.s3.us-east-1.amazonaws.com/index.html"; // Update with your chatbot deployment URL
      // chatIframe.src = "https://your-deployed-chatbot-url.com"; // Update with your chatbot deployment URL
      chatIframe.style.width = "100%";
      chatIframe.style.height = "100%";
      chatIframe.style.border = "none";
  
      chatDiv.appendChild(chatIframe);
      document.body.appendChild(chatDiv);
    }
  })();
  