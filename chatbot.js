// Floating AI Assistant Chatbot Widget
const AIChatbot = {
  init: function() {
    this.renderWidget();
    this.bindEvents();
  },

  renderWidget: function() {
    let botContainer = document.getElementById('ai-chatbot-widget');
    if (!botContainer) {
      botContainer = document.createElement('div');
      botContainer.id = 'ai-chatbot-widget';
      botContainer.innerHTML = `
        <button id="chatbot-trigger-btn" class="chatbot-trigger" title="Ask EduAI Assistant">
          <i class="fa-solid fa-robot"></i>
          <span class="chat-pulse"></span>
        </button>

        <div id="chatbot-window" class="chatbot-window">
          <div class="chatbot-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="chatbot-avatar"><i class="fa-solid fa-robot"></i></div>
              <div>
                <div style="font-weight: 700; font-size: 0.95rem;">EduAI Assistant</div>
                <div style="font-size: 0.75rem; color: var(--accent-mint);">● Online AI Tutor</div>
              </div>
            </div>
            <button id="close-chat-btn" class="chatbot-close"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div id="chatbot-messages" class="chatbot-messages">
            <div class="chat-msg bot-msg">
              👋 Hey Aishwarya! I'm your AI Academic Assistant. Ask me anything about your attendance goals, performance prediction, or study tips!
            </div>
          </div>

          <div class="chatbot-input-area">
            <input type="text" id="chat-input" placeholder="Type your academic question..." />
            <button id="send-chat-btn" class="chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      `;
      document.body.appendChild(botContainer);
    }
  },

  bindEvents: function() {
    const trigger = document.getElementById('chatbot-trigger-btn');
    const windowEl = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('close-chat-btn');
    const sendBtn = document.getElementById('send-chat-btn');
    const inputEl = document.getElementById('chat-input');

    if (trigger && windowEl) {
      trigger.addEventListener('click', () => {
        windowEl.classList.toggle('open');
      });
    }

    if (closeBtn && windowEl) {
      closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('open');
      });
    }

    const sendMessage = () => {
      const text = inputEl.value.trim();
      if (!text) return;

      this.addMessage(text, 'user');
      inputEl.value = '';

      // Simulate AI Assistant response
      setTimeout(() => {
        const reply = this.generateResponse(text);
        this.addMessage(reply, 'bot');
      }, 600);
    };

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (inputEl) {
      inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }
  },

  addMessage: function(text, sender) {
    const box = document.getElementById('chatbot-messages');
    if (!box) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}-msg`;
    msg.innerHTML = text;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
  },

  generateResponse: function(prompt) {
    const lower = prompt.toLowerCase();

    if (lower.includes('attendance') || lower.includes('class') || lower.includes('miss')) {
      const pct = typeof AttendanceTracker !== 'undefined' ? AttendanceTracker.getPercentage() : 82;
      return `Your current attendance rate is <strong>${pct}%</strong>. To maintain safe standing above 75%, avoid missing more than 2 consecutive lectures this week. 📚`;
    }

    if (lower.includes('predict') || lower.includes('score') || lower.includes('grade') || lower.includes('marks')) {
      return `Based on your current 82% attendance and 42/50 internal test score, your AI prediction is classified as <strong>EXCELLENT (94.5% confidence)</strong>! 🏆 Keep up your daily 5-hour study routine.`;
    }

    if (lower.includes('math') || lower.includes('daa') || lower.includes('os') || lower.includes('subject')) {
      return `For <strong>DAA and Operating Systems</strong>, practice module 2 question papers and review decision tree algorithms. We recommend studying 2 hours for Math today! 🧠`;
    }

    return `That's a great study question! Remember: consistent 30-minute daily review sessions yield 3x better memory retention during final exams. You can track your task deadlines in the Study Planner tab! 🌸`;
  }
};
