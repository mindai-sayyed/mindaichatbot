const API_KEY = "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";
const MODEL = "llama3-8b-8192";
let chatHistory = JSON.parse(localStorage.getItem("mindai_chat")) || [];

function insertPrompt(text) {
  const input = document.getElementById("userInput");
  input.value = text;
  input.focus();
}

function addToChat(sender, text, role) {
  const chatbox = document.getElementById("chatbox");
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addToChat("You", text, "user");
  chatHistory.push({ role: "user", content: text });
  input.value = "";
  document.getElementById("typing").classList.remove("hidden");
  localStorage.setItem("mindai_chat", JSON.stringify(chatHistory));

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
  addToChat("Mind AI", reply, "bot");
  document.getElementById("typing").classList.add("hidden");
}

// Send message on Enter
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
