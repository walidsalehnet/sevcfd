import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword, confirmPasswordReset } from "firebase/auth";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAvygm6fbt1M-nLkiLO5WWmnjZAt4UZzUo",
  authDomain: "wedoonet-f9c77.firebaseapp.com",
  projectId: "wedoonet-f9c77",
  storageBucket: "wedoonet-f9c77.firebasestorage.app",
  messagingSenderId: "480179600251",
  appId: "1:480179600251:web:01b39d7ae4fca3cf5fdbde",
  measurementId: "G-RSQ7GRB1BJ"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// إعداد Recaptcha للتحقق من الهوية
window.onload = function () {
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': function (response) {
      onSignUpSubmit();
    }
  }, auth);
};

// التحقق من كلمة السر
function validatePassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    alert("كلمة السر وتأكيد كلمة السر غير متطابقتين");
    return false;
  }
  return true;
}

// إنشاء حساب جديد
function signUp() {
  const phoneNumber = document.getElementById("phoneNumberSignup").value;
  const password = document.getElementById("passwordSignup").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // التحقق من تطابق كلمة السر
  if (!validatePassword(password, confirmPassword)) return;

  const appVerifier = window.recaptchaVerifier;
  
  // إرسال الكود عبر SMS
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      const verificationCode = prompt("أدخل كود التحقق المرسل إلى هاتفك");
      confirmationResult.confirm(verificationCode)
        .then((result) => {
          // حساب تم إنشاؤه بنجاح
          alert("تم إنشاء الحساب بنجاح");
          document.getElementById("confirmationMessage").style.display = 'block';
          setTimeout(() => {
            window.location.href = "login.html"; // تحويل إلى صفحة تسجيل الدخول بعد قليل
          }, 2000);
        })
        .catch((error) => {
          // فشل في التحقق من الكود
          document.getElementById("errorMessage").style.display = 'block';
        });
    })
    .catch((error) => {
      // فشل في إرسال الكود
      alert("فشل في إرسال كود التحقق");
    });
}

// إضافة حدث عند إرسال النموذج
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault(); // منع إرسال النموذج بشكل افتراضي
  signUp();
});
