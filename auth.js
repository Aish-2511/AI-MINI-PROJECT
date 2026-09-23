// Authentication & User Session Module
const Auth = {
  currentUser: null,

  init: function() {
    this.bindEvents();
    // Default logged-out view opens Landing Page if unauthenticated
    const savedUser = localStorage.getItem('eduai_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.showAuthenticatedState();
    } else {
      this.showPublicLanding();
    }
  },

  showPublicLanding: function() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('top-header').style.display = 'none';
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-landing').classList.add('active');
  },

  showAuthenticatedState: function() {
    document.getElementById('sidebar').style.display = 'flex';
    document.getElementById('top-header').style.display = 'flex';
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-home').classList.add('active');

    if (this.currentUser) {
      document.querySelectorAll('.user-name-display').forEach(el => el.textContent = this.currentUser.username || 'Aishwarya');
      document.querySelectorAll('.user-email-display').forEach(el => el.textContent = this.currentUser.email || 'aishwarya@college.edu');
    }
    Toast.show(`Welcome back, ${this.currentUser ? this.currentUser.username : 'Aishwarya'}! 👋`, 'success');
  },

  validatePasswordRules: function(password) {
    const rules = {
      len: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      num: /[0-9]/.test(password),
      spec: /[^A-Za-z0-9]/.test(password)
    };

    // Update UI rule checklist items
    this.updateRuleCheck('rule-len', rules.len);
    this.updateRuleCheck('rule-upper', rules.upper);
    this.updateRuleCheck('rule-lower', rules.lower);
    this.updateRuleCheck('rule-num', rules.num);
    this.updateRuleCheck('rule-spec', rules.spec);

    return rules.len && rules.upper && rules.lower && rules.num && rules.spec;
  },

  updateRuleCheck: function(elementId, isValid) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (isValid) {
      el.className = 'password-rule valid';
      el.querySelector('i').className = 'fa-solid fa-circle-check';
    } else {
      el.className = 'password-rule invalid';
      el.querySelector('i').className = 'fa-regular fa-circle-xmark';
    }
  },

  bindEvents: function() {
    // Password Live Validation on Signup Form
    const signupPasswordInput = document.getElementById('signup-password');
    if (signupPasswordInput) {
      signupPasswordInput.addEventListener('input', (e) => {
        this.validatePasswordRules(e.target.value);
      });
    }

    // Toggle Password Visibility (Eye icon)
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const targetId = this.dataset.target;
        const input = document.getElementById(targetId);
        if (input) {
          if (input.type === 'password') {
            input.type = 'text';
            this.querySelector('i').className = 'fa-regular fa-eye-slash';
          } else {
            input.type = 'password';
            this.querySelector('i').className = 'fa-regular fa-eye';
          }
        }
      });
    });

    // Sign In Form Submit
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
      signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        if (!email || !password) {
          Toast.show('Please fill in all required fields.', 'error');
          return;
        }

        this.currentUser = { email: email, username: email.split('@')[0] };
        localStorage.setItem('eduai_user', JSON.stringify(this.currentUser));
        this.showAuthenticatedState();
      });
    }

    // Signup Form Submit
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (username.length < 4) {
          Toast.show('Username must be at least 4 characters long.', 'error');
          return;
        }

        if (!this.validatePasswordRules(password)) {
          Toast.show('Please satisfy all password security requirements.', 'error');
          return;
        }

        if (password !== confirmPassword) {
          Toast.show('Passwords do not match.', 'error');
          return;
        }

        this.currentUser = { username: username, email: email };
        localStorage.setItem('eduai_user', JSON.stringify(this.currentUser));
        Toast.show('Account created successfully! 🚀', 'success');
        this.showAuthenticatedState();
      });
    }

    // SSO Buttons (Google / Microsoft)
    document.querySelectorAll('.sso-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentUser = { username: 'Aishwarya', email: 'aishwarya@college.edu' };
        localStorage.setItem('eduai_user', JSON.stringify(this.currentUser));
        Toast.show('Signed in with SSO! 🎉', 'success');
        this.showAuthenticatedState();
      });
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('eduai_user');
        this.currentUser = null;
        Toast.show('Signed out successfully.', 'info');
        this.showPublicLanding();
      });
    }
  }
};
