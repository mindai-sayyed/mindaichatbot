const API_KEY = "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";
const MODEL = "llama3-8b-8192";
let chatHistory = JSON.parse(localStorage.getItem("mindai_chat")) || [];

// PROMPT TEMPLATES
const promptTemplates = [
  "Summarize this text:",
  "Translate to Hindi:",
  "Write a story about:",
  "Explain like I'm 5:",
  "Give pros and cons of:"
];

// On page load, restore chat and build prompt buttons
window.onload = () => {
  loadHistory();
  buildPromptButtons();
};

function loadHistory() {
  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML = "";
  chatHistory.forEach(msg => {
    addToChat(msg.role === "user" ? "You" : "Mind Ai", msg.content, msg.role);
  });
}

function addToChat(sender, text, role) {
  const chatbox = document.getElementById("chatbox");
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage(promptText = null) {
  const input = document.getElementById("userInput");
  let message = promptText || input.value.trim();
  if (!message) return;

  addToChat("You", message, "user");
  chatHistory.push({ role: "user", content: message });
  input.value = "";
  localStorage.setItem("mindai_chat", JSON.stringify(chatHistory));
  showTyping(true);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: chatHistory
      })
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;
    chatHistory.push({ role: "assistant", content: reply });
    localStorage.setItem("mindai_chat", JSON.stringify(chatHistory));
    addToChat("Mind Ai", reply, "bot");
  } catch (err) {
    addToChat("Mind Ai", "⚠️ Error getting reply. Try again.", "bot");
  }

  showTyping(false);
}

function showTyping(isTyping) {
  document.getElementById("typing").style.display = isTyping ? "block" : "none";
}

function buildPromptButtons() {
  const promptArea = document.getElementById("prompt-area");
  promptArea.innerHTML = "";
  promptTemplates.forEach(prompt => {
    const btn = document.createElement("button");
    btn.textContent = prompt;
    btn.onclick = () => sendMessage(prompt);
    promptArea.appendChild(btn);
  });
}
