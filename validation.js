// ✅ TCF Institute — Global Input Validation
// Just add data-type="phone/name/email/number/text" to any input

(function(){

  const rules = {
    phone: {
      allow: /[0-9]/,
      maxLen: 10,
      validate: v => /^[6-9][0-9]{9}$/.test(v),
      msg: 'Enter valid 10-digit phone number'
    },
    name: {
      allow: /[a-zA-Z\s]/,
      maxLen: 50,
      validate: v => v.trim().length >= 2,
      msg: 'Name must be at least 2 characters'
    },
    email: {
      allow: /[a-zA-Z0-9@._\-]/,
      maxLen: 100,
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      msg: 'Enter a valid email address'
    },
    number: {
      allow: /[0-9]/,
      maxLen: 10,
      validate: v => v.length > 0,
      msg: 'Only numbers allowed'
    },
    text: {
      allow: /[a-zA-Z\s]/,
      maxLen: 100,
      validate: v => v.trim().length > 0,
      msg: 'Only letters allowed'
    },
    pincode: {
      allow: /[0-9]/,
      maxLen: 6,
      validate: v => /^[0-9]{6}$/.test(v),
      msg: 'Enter valid 6-digit pincode'
    },
    aadhar: {
      allow: /[0-9]/,
      maxLen: 12,
      validate: v => /^[0-9]{12}$/.test(v),
      msg: 'Enter valid 12-digit Aadhar number'
    },
    year: {
      allow: /[0-9]/,
      maxLen: 4,
      validate: v => /^(19|20)[0-9]{2}$/.test(v),
      msg: 'Enter valid year (e.g. 2024)'
    },
    percent: {
      allow: /[0-9.]/,
      maxLen: 5,
      validate: v => parseFloat(v) >= 0 && parseFloat(v) <= 100,
      msg: 'Enter valid percentage (0-100)'
    },
    alpha: {
      allow: /[a-zA-Z]/,
      maxLen: 50,
      validate: v => v.trim().length >= 2,
      msg: 'Only letters allowed, no spaces or numbers'
    }
  };

  function getOrCreateMsg(input){
    let msg = input.parentElement.querySelector('.v-msg');
    if(!msg){
      msg = document.createElement('div');
      msg.className = 'v-msg';
      msg.style.cssText = 'font-size:11px;margin-top:4px;display:none;color:#f44336;';
      input.parentElement.appendChild(msg);
    }
    return msg;
  }

  function applyValidation(input){
    const type = input.getAttribute('data-type');
    if(!type || !rules[type]) return;
    const rule = rules[type];

    // Block invalid keypress
    input.addEventListener('keypress', function(e){
      const char = String.fromCharCode(e.which || e.keyCode);
      if(!rule.allow.test(char)) e.preventDefault();
    });

    // Block paste of invalid chars
    input.addEventListener('paste', function(e){
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const filtered = pasted.split('').filter(c => rule.allow.test(c)).join('');
      const start = this.selectionStart, end = this.selectionEnd;
      const current = this.value;
      const newVal = (current.slice(0,start) + filtered + current.slice(end)).slice(0, rule.maxLen);
      this.value = newVal;
      this.dispatchEvent(new Event('input'));
    });

    // Enforce maxLength
    input.setAttribute('maxlength', rule.maxLen);

    // Live validation on input
    input.addEventListener('input', function(){
      this.value = this.value.split('').filter(c => rule.allow.test(c)).join('').slice(0, rule.maxLen);
      const msg = getOrCreateMsg(this);
      if(this.value.length > 0 && !rule.validate(this.value)){
        this.style.borderColor = '#f44336';
        msg.textContent = rule.msg;
        msg.style.display = 'block';
      } else {
        this.style.borderColor = this.value.length > 0 ? '#4caf50' : '';
        msg.style.display = 'none';
      }
    });

    // Validate on blur
    input.addEventListener('blur', function(){
      const msg = getOrCreateMsg(this);
      if(this.value.length > 0 && !rule.validate(this.value)){
        this.style.borderColor = '#f44336';
        msg.textContent = rule.msg;
        msg.style.display = 'block';
      }
    });
  }

  // Auto-apply to all inputs with data-type on page load
  function init(){
    document.querySelectorAll('input[data-type]').forEach(applyValidation);
    // Watch for dynamically adde\d inputs
    new MutationObserver(mutations => {
      mutations.forEach(m => m.addedNodes.forEach(n => {
        if(n.nodeType===1){
          if(n.matches && n.matches('input[data-type]')) applyValidation(n);
          n.querySelectorAll && n.querySelectorAll('input[data-type]').forEach(applyValidation);
        }
      }));
    }).observe(document.body, {childList:true, subtree:true});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
