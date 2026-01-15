export const translations = {
  ar: {
    common: {
      password: "كلمة المرور",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      rememberMe: "تذكرني",
      forgotPassword: "هل نسيت كلمة المرور؟",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      language: "اللغة",
      enterUsername: "يرجى إدخال اسم المستخدم",
      enterPassword: "يرجى إدخال كلمة المرور",
      invalidEmail: "البريد الإلكتروني غير صحيح",
      passwordRequired: "كلمة المرور مطلوبة",
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
    },
    login: {
      title: "تسجيل الدخول",
      subtitle: "مرحبا بك في نظام سيجما للاستقدام",
      welcome: "أهلا وسهلا",
      description: "نظام سيجما للاستقدام",
      usernameLabel: "اسم المستخدم أو البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      rememberMeLabel: "تذكرني في المرة القادمة",
      forgotPasswordLink: "هل نسيت كلمة المرور؟",
      loginButton: "تسجيل الدخول",
      loginError: "فشل تسجيل الدخول. يرجى التحقق من بيانات الدخول.",
      loginSuccess: "تم تسجيل الدخول بنجاح",
    },
  },
  en: {
    common: {
      password: "Password",
      username: "Username",
      email: "Email",
      rememberMe: "Remember Me",
      forgotPassword: "Forgot Password?",
      login: "Login",
      logout: "Logout",
      language: "Language",
      enterUsername: "Please enter username",
      enterPassword: "Please enter password",
      invalidEmail: "Invalid email address",
      passwordRequired: "Password is required",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
    login: {
      title: "Login",
      subtitle: "Welcome to Sigma Recruitment System",
      welcome: "Welcome",
      description:
        "Sigma Recruitment Company System",
      usernameLabel: "Username or Email",
      passwordLabel: "Password",
      rememberMeLabel: "Remember me next time",
      forgotPasswordLink: "Forgot Password?",
      loginButton: "Login",
      loginError: "Login failed. Please check your credentials.",
      loginSuccess: "Logged in successfully",
    },
  },
};

export type Language = "ar" | "en";
export type TranslationKey = keyof typeof translations.ar;

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};
