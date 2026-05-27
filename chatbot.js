(function(){
const userId = localStorage.getItem('userId') || 'guest_' + Math.random().toString(36).substr(2,8);
const userName = localStorage.getItem('userName') || 'Student';

const chatHTML = `
<div id="chatWidget" style="position:fixed;bottom:24px;right:24px;z-index:9999;font-family:'Segoe UI',Arial,sans-serif;">
  <!-- Toggle Button -->
  <button id="chatToggle" onclick="openLiveChat()" title="Chat with us" style="width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#00ffff,#0080ff);border:none;cursor:pointer;box-shadow:0 4px 24px rgba(0,255,255,0.5);font-size:28px;display:flex;align-items:center;justify-content:center;transition:0.3s;position:relative;">
    💬
    <span id="chatBadge" style="display:none;position:absolute;top:-3px;right:-3px;width:20px;height:20px;background:#f44336;border-radius:50%;font-size:10px;font-weight:700;color:white;align-items:center;justify-content:center;border:2px solid #0b0f1a;">!</span>
  </button>

  <!-- Chat Box -->
  <div id="chatBox" style="display:none;flex-direction:column;position:absolute;bottom:78px;right:0;width:370px;height:540px;background:#111827;border:1px solid rgba(0,255,255,0.2);border-radius:18px;box-shadow:0 8px 40px rgba(0,0,0,0.85);overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#00b4d8,#0077b6);padding:14px 18px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:20px;">🤖</div>
        <div>
          <h3 style="margin:0;font-size:15px;font-weight:700;color:#fff;">TCF Assistant</h3>
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.75);" id="chatStatus">🟡 Connecting...</p>
        </div>
      </div>
      <button onclick="closeLiveChat()" style="background:rgba(255,255,255,0.15);border:none;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:16px;color:#fff;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>

    <!-- Quick Suggestions -->
    <div id="quickSuggestions" style="padding:10px 12px;background:#0b0f1a;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0;">
      <button onclick="quickAsk('courses')" style="padding:5px 11px;background:rgba(0,255,255,0.08);border:1px solid rgba(0,255,255,0.2);border-radius:20px;color:#00ffff;font-size:11px;cursor:pointer;transition:0.2s;" onmouseover="this.style.background='rgba(0,255,255,0.18)'" onmouseout="this.style.background='rgba(0,255,255,0.08)'">📚 Courses</button>
      <button onclick="quickAsk('fees')" style="padding:5px 11px;background:rgba(0,255,255,0.08);border:1px solid rgba(0,255,255,0.2);border-radius:20px;color:#00ffff;font-size:11px;cursor:pointer;transition:0.2s;" onmouseover="this.style.background='rgba(0,255,255,0.18)'" onmouseout="this.style.background='rgba(0,255,255,0.08)'">💰 Fees</button>
      <button onclick="quickAsk('placement')" style="padding:5px 11px;background:rgba(0,255,255,0.08);border:1px solid rgba(0,255,255,0.2);border-radius:20px;color:#00ffff;font-size:11px;cursor:pointer;transition:0.2s;" onmouseover="this.style.background='rgba(0,255,255,0.18)'" onmouseout="this.style.background='rgba(0,255,255,0.08)'">🏆 Placement</button>
      <button onclick="quickAsk('batch timings')" style="padding:5px 11px;background:rgba(0,255,255,0.08);border:1px solid rgba(0,255,255,0.2);border-radius:20px;color:#00ffff;font-size:11px;cursor:pointer;transition:0.2s;" onmouseover="this.style.background='rgba(0,255,255,0.18)'" onmouseout="this.style.background='rgba(0,255,255,0.08)'">🕐 Timings</button>
      <button onclick="quickAsk('contact')" style="padding:5px 11px;background:rgba(0,255,255,0.08);border:1px solid rgba(0,255,255,0.2);border-radius:20px;color:#00ffff;font-size:11px;cursor:pointer;transition:0.2s;" onmouseover="this.style.background='rgba(0,255,255,0.18)'" onmouseout="this.style.background='rgba(0,255,255,0.08)'">📞 Contact</button>
      <button onclick="quickAsk('mock interview')" style="padding:5px 11px;background:rgba(0,255,255,0.08);border:1px solid rgba(0,255,255,0.2);border-radius:20px;color:#00ffff;font-size:11px;cursor:pointer;transition:0.2s;" onmouseover="this.style.background='rgba(0,255,255,0.18)'" onmouseout="this.style.background='rgba(0,255,255,0.08)'">🤖 Interview</button>
      <button onclick="quickAsk('how to apply')" style="padding:5px 11px;background:rgba(0,255,255,0.08);border:1px solid rgba(0,255,255,0.2);border-radius:20px;color:#00ffff;font-size:11px;cursor:pointer;transition:0.2s;" onmouseover="this.style.background='rgba(0,255,255,0.18)'" onmouseout="this.style.background='rgba(0,255,255,0.08)'">📝 Apply</button>
    </div>

    <!-- Messages -->
    <div id="chatMessages" style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#0b0f1a;scroll-behavior:smooth;"></div>

    <!-- Typing Indicator -->
    <div id="typingIndicator" style="display:none;padding:6px 16px;background:#0b0f1a;flex-shrink:0;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:13px;">🤖</span>
        <div style="display:flex;gap:4px;align-items:center;">
          <span style="width:7px;height:7px;background:#00ffff;border-radius:50%;animation:bounce 1s infinite;display:inline-block;"></span>
          <span style="width:7px;height:7px;background:#00ffff;border-radius:50%;animation:bounce 1s infinite 0.2s;display:inline-block;"></span>
          <span style="width:7px;height:7px;background:#00ffff;border-radius:50%;animation:bounce 1s infinite 0.4s;display:inline-block;"></span>
          <span style="color:#555;font-size:11px;margin-left:4px;">TCF Bot is typing...</span>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div style="padding:12px 14px;background:#111827;border-top:1px solid rgba(0,255,255,0.08);flex-shrink:0;">
      <div style="display:flex;gap:8px;align-items:center;">
        <input id="chatInput" type="text" placeholder="Ask anything about TCF Institute..." style="flex:1;padding:11px 14px;background:#0b0f1a;border:1px solid rgba(0,255,255,0.2);border-radius:10px;color:white;font-size:13px;outline:none;transition:0.3s;" onkeypress="if(event.key==='Enter')sendLiveMsg()" onfocus="this.style.borderColor='rgba(0,255,255,0.5)'" onblur="this.style.borderColor='rgba(0,255,255,0.2)'">
        <button onclick="sendLiveMsg()" style="padding:11px 15px;background:linear-gradient(135deg,#00b4d8,#0077b6);border:none;border-radius:10px;cursor:pointer;font-size:18px;color:white;transition:0.3s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">➤</button>
      </div>
      <p style="margin:6px 0 0;font-size:10px;color:#333;text-align:center;">🤖 AI Bot + 👨‍💼 Live Support</p>
    </div>
  </div>
</div>

<style>
@keyframes bounce {
  0%,100%{transform:translateY(0);}
  50%{transform:translateY(-5px);}
}
#chatMessages::-webkit-scrollbar{width:4px;}
#chatMessages::-webkit-scrollbar-track{background:transparent;}
#chatMessages::-webkit-scrollbar-thumb{background:rgba(0,255,255,0.2);border-radius:4px;}
</style>`;

document.body.insertAdjacentHTML('beforeend', chatHTML);

// Show welcome message immediately
renderBotMsg('👋 Hi ' + userName + '! I\'m <b>TCF Bot</b> — your smart assistant.<br>Ask me anything about our <b>courses, fees, placements, timings</b> or <b>admissions</b>! 😊');

let socket = null;
let connected = false;

// Load socket.io
const script = document.createElement('script');
script.src = 'http://localhost:8000/socket.io/socket.io.js';
script.onload = initSocket;
script.onerror = () => {
  document.getElementById('chatStatus').textContent = '🤖 AI Bot Active';
};
document.head.appendChild(script);

function initSocket(){
  try {
    socket = io('http://localhost:8000', { transports: ['websocket','polling'] });

    socket.on('connect', () => {
      connected = true;
      socket.emit('student_join', { userId, userName, currentPage: document.title });
    });

    socket.on('admin_status', ({ online }) => {
      document.getElementById('chatStatus').textContent = online
        ? '🟢 AI Bot + Live Support Online'
        : '🤖 AI Bot Active';
    });

    socket.on('disconnect', () => {
      connected = false;
      document.getElementById('chatStatus').textContent = '🤖 AI Bot Active';
    });

    socket.on('connect_error', () => {
      document.getElementById('chatStatus').textContent = '🤖 AI Bot Active';
    });

    socket.on('chat_history', (history) => {
      if(history.length){
        document.getElementById('chatMessages').innerHTML = '';
        history.forEach(m => renderMsg(m));
      }
    });

    socket.on('receive_msg', (data) => {
      // Hide typing indicator
      document.getElementById('typingIndicator').style.display = 'none';
      renderMsg(data);
      if(document.getElementById('chatBox').style.display === 'none'){
        const badge = document.getElementById('chatBadge');
        badge.style.display = 'flex';
      }
    });

  } catch(e) {
    document.getElementById('chatStatus').textContent = '🤖 AI Bot Active';
  }
}

function renderMsg(data){
  if(data.from === 'student'){
    renderStudentMsg(data.msg, data.time);
  } else {
    renderBotMsg(data.msg, data.name, data.time);
  }
}

function renderStudentMsg(msg, time){
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;justify-content:flex-end;';
  div.innerHTML = `
    <div style="max-width:80%;">
      <div style="background:linear-gradient(135deg,#00b4d8,#0077b6);padding:10px 14px;border-radius:14px 2px 14px 14px;">
        <p style="margin:0;font-size:13px;color:#fff;line-height:1.6;">${msg}</p>
      </div>
      ${time ? `<p style="margin:3px 0 0;font-size:10px;color:#444;text-align:right;">${time}</p>` : ''}
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function renderBotMsg(msg, senderName, time){
  const msgs = document.getElementById('chatMessages');
  const isAdmin = senderName && senderName.includes('Support Team');
  const avatar = isAdmin ? '👨‍💼' : '🤖';
  const label = senderName || '🤖 TCF Bot';
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:8px;align-items:flex-start;';
  div.innerHTML = `
    <div style="width:32px;height:32px;border-radius:50%;background:${isAdmin ? 'linear-gradient(135deg,#ff9800,#f44336)' : 'linear-gradient(135deg,#00b4d8,#0077b6)'};display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;margin-top:2px;">${avatar}</div>
    <div style="max-width:82%;">
      <p style="margin:0 0 4px;font-size:10px;color:${isAdmin ? '#ff9800' : '#00ffff'};font-weight:700;">${label}</p>
      <div style="background:#1a2235;padding:10px 14px;border-radius:2px 14px 14px 14px;border:1px solid rgba(0,255,255,0.1);">
        <p style="margin:0;font-size:13px;color:#ddd;line-height:1.7;white-space:pre-line;">${msg}</p>
      </div>
      ${time ? `<p style="margin:3px 0 0;font-size:10px;color:#444;">${time}</p>` : ''}
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

window.openLiveChat = () => {
  document.getElementById('chatBox').style.display = 'flex';
  document.getElementById('chatToggle').style.display = 'none';
  document.getElementById('chatBadge').style.display = 'none';
  document.getElementById('chatInput').focus();
};

window.openChat = window.openLiveChat;

window.closeLiveChat = () => {
  document.getElementById('chatBox').style.display = 'none';
  document.getElementById('chatToggle').style.display = 'flex';
};

window.quickAsk = (text) => {
  document.getElementById('chatInput').value = text;
  sendLiveMsg();
};

window.sendLiveMsg = () => {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if(!msg) return;
  input.value = '';

  // Show student message immediately
  renderStudentMsg(msg, new Date().toLocaleTimeString());

  // Send email notification
  fetch('http://localhost:8000/api/chat/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userName:userName,userMsg:msg})}).catch(()=>{});

  // Show typing indicator
  const typing = document.getElementById('typingIndicator');
  typing.style.display = 'block';
  document.getElementById('chatMessages').scrollTop = 99999;

  if(socket && connected){
    socket.emit('student_msg', { userId, userName, msg });
  } else {
    // Offline: use local bot brain
    setTimeout(() => {
      typing.style.display = 'none';
      const reply = localBot(msg);
      renderBotMsg(reply, '🤖 TCF Bot', new Date().toLocaleTimeString());
    }, 800);
  }
};

// ── LOCAL BOT (works even when server is offline) ──────────────────
function localBot(msg){
  const m = msg.toLowerCase().trim();

  if(/^(hi|hello|hey|hii|hai|good morning|good evening)/.test(m))
    return '👋 Hello! I\'m TCF Bot. Ask me anything about our courses, fees, placements or admissions! 😊';

  if(/thank|thanks/.test(m)) return 'You\'re welcome! 😊 Feel free to ask anything else.';
  if(/bye|goodbye/.test(m)) return 'Goodbye! 👋 Best of luck with your learning journey! 🎓';
  if(/how are you/.test(m)) return 'I\'m doing great! 😄 How can I help you today?';

  if(/what course|which course|all course|courses offer|list of course/.test(m))
    return '🎓 We offer 6 courses:\n\n1. 💻 Web Development — ₹5,000\n2. 🧪 Software Testing — ₹4,500\n3. 📊 Data Analytics — ₹3,000\n4. 🐍 Python Programming — ₹3,500\n5. ☕ Java Full Stack — ₹6,000\n6. ☁️ AWS Cloud — ₹7,000\n\nVisit our Courses page to apply!';

  if(/web dev|html|css|javascript|react|node/.test(m))
    return '💻 Web Development\n📌 3 Months | 💰 ₹5,000\n📚 HTML, CSS, JS, React, Node.js, MySQL\n✅ Live projects + placement support';

  if(/software test|selenium|manual test|qa|testing/.test(m))
    return '🧪 Software Testing\n📌 2.5 Months | 💰 ₹4,500\n📚 Manual Testing, Selenium, TestNG, JIRA, Postman\n✅ Certification + placement support';

  if(/data analytic|power bi|pandas|sql course/.test(m))
    return '📊 Data Analytics\n📌 2 Months | 💰 ₹3,000\n📚 Python, SQL, Power BI, Excel, Matplotlib\n✅ Real datasets + placement support';

  if(/python|django|flask/.test(m))
    return '🐍 Python Programming\n📌 2 Months | 💰 ₹3,500\n📚 Python, OOP, Django, Flask, Automation\n✅ Projects + placement support';

  if(/java|spring boot|full stack/.test(m))
    return '☕ Java Full Stack\n📌 4 Months | 💰 ₹6,000\n📚 Java, Spring Boot, Hibernate, Angular\n✅ Enterprise projects + placement support';

  if(/aws|cloud|amazon|ec2|s3|devops/.test(m))
    return '☁️ AWS Cloud Computing\n📌 3 Months | 💰 ₹7,000\n📚 EC2, S3, IAM, Lambda, DevOps, CI/CD\n✅ AWS Certification prep + placement support';

  if(/fee|fees|cost|price|how much|charges/.test(m))
    return '💰 Course Fees:\n\n💻 Web Development — ₹5,000\n🧪 Software Testing — ₹4,500\n📊 Data Analytics — ₹3,000\n🐍 Python — ₹3,500\n☕ Java Full Stack — ₹6,000\n☁️ AWS Cloud — ₹7,000\n\nAll fees include materials, projects & placement support!';

  if(/duration|how long|months/.test(m))
    return '⏱️ Course Durations:\n\n💻 Web Dev — 3 Months\n🧪 Testing — 2.5 Months\n📊 Analytics — 2 Months\n🐍 Python — 2 Months\n☕ Java — 4 Months\n☁️ AWS — 3 Months';

  if(/batch|timing|schedule|morning|evening|weekend/.test(m))
    return '🕐 Batch Timings:\n\n🌅 Morning — 9AM to 12PM\n☀️ Afternoon — 1PM to 4PM\n🌆 Evening — 5PM to 8PM\n📅 Weekend — Sat & Sun\n\nChoose your batch when you apply!';

  if(/placement|job|hire|company|salary|tcs|infosys|wipro/.test(m))
    return '🏆 Placements:\n\n✅ 350+ students placed\n✅ 95% placement rate\n✅ Avg package: ₹4.5 LPA\n\n🏢 TCS, Infosys, Wipro, HCL, Tech Mahindra, Cognizant\n\nMock interviews + resume building included!';

  if(/certif/.test(m))
    return '🎖️ Yes! We provide an industry-recognized completion certificate for every course. AWS course includes official AWS Certification exam guidance!';

  if(/admission|apply|enroll|join|register/.test(m))
    return '📝 How to Apply:\n\n1️⃣ Go to Apply Now page\n2️⃣ Select your course\n3️⃣ Fill your details\n4️⃣ Submit — we\'ll call within 24 hours!\n\nNo entrance exam required!';

  if(/eligib|qualify|who can|10th|12th|degree/.test(m))
    return '✅ Anyone can join!\n\n• 10th / 12th pass\n• Diploma holders\n• B.E / B.Tech / B.Sc / BCA / MCA\n• Working professionals\n\nNo prior coding experience needed!';

  if(/about|who are you|what is tcf/.test(m))
    return '🏫 TCF Institute — Chennai\'s #1 Tech Training Center\n\nFounded in 2015 | 1500+ students trained | 350+ placed | 10+ years experience\n\n100% placement assistance guaranteed!';

  if(/location|address|where|chennai/.test(m))
    return '📍 Chennai, Tamil Nadu, India\n\nWe also offer online batches!\n📞 +91 9876543210\n✉️ tcftechnologies@gmail.com';

  if(/contact|phone|call|email|whatsapp/.test(m))
    return '📞 +91 9876543210\n✉️ tcftechnologies@gmail.com\n📍 Chennai, Tamil Nadu\n🕐 Mon–Sat: 9AM–6PM';

  if(/demo|free class|trial/.test(m))
    return '🎁 Yes! We offer a FREE demo class before you enroll.\n\nCall us: +91 9876543210\nNo commitment required — try before you join! 😊';

  if(/online|offline|zoom|remote/.test(m))
    return '💻 We offer both Online & Offline classes!\n\n🏫 Offline: Chennai center\n💻 Online: Live Zoom/Meet classes\n\nSame curriculum, projects & placement support!';

  if(/interview|mock interview|practice/.test(m))
    return '🤖 AI Mock Interview\n\nPrepare for your dream job with our AI simulator!\n\n👉 <a href="interview.html" style="color:#00ffff;">Start Practice Session</a>';

  if(/trainer|teacher|faculty/.test(m))
    return '👨‍🏫 Expert Trainers:\n\n• Rajesh Kumar — Web Dev (10+ yrs, TCS)\n• Priya Nair — Testing (8+ yrs, Wipro)\n• Anitha Reddy — Data Analytics (7+ yrs, Cognizant)\n• Suresh Babu — Java (12+ yrs, Tech Mahindra)';

  if(/why tcf|best|why choose/.test(m))
    return '🌟 Why Choose TCF?\n\n✅ Expert trainers (10+ yrs experience)\n✅ Hands-on live projects\n✅ 100% placement assistance\n✅ Affordable fees\n✅ Flexible batch timings\n✅ Industry certification\n✅ Small batches for personal attention';

  return '🤔 I can help you with:\n\n• 📚 Courses & fees\n• ⏱️ Batch timings\n• 🏆 Placements\n• 📝 Admissions\n• 📞 Contact details\n\nJust type: courses, fees, placement, timings, contact, apply etc.';
}

})();
