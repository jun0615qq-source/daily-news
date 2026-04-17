const admin = require('firebase-admin');

if (!admin.apps.length) {
  // Firebase 환경 변수가 설정되어 있으면 초기화
  if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // 개발 환경: Firebase 없이 동작 (인증 미들웨어 비활성화)
    console.warn('⚠️  Firebase 환경 변수가 설정되지 않았습니다. 인증 기능이 비활성화됩니다.');
    admin.initializeApp({ projectId: 'demo-project' });
  }
}

module.exports = admin;
