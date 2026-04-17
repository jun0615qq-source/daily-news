const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const nodemailer = require('nodemailer');
const admin = require('../config/firebase');

const router = express.Router();

// 인증 코드 임시 저장 (TTL 10분)
const pendingCache = new NodeCache({ stdTTL: 600 });

const codeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '너무 많은 인증 요청입니다. 1시간 후 다시 시도하세요.' },
});

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

// POST /api/auth/send-code — 인증 코드 발송
router.post(
  '/send-code',
  codeLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('displayName').isString().trim().isLength({ min: 1, max: 50 }),
    body('password').isString().isLength({ min: 8, max: 100 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, displayName, password } = req.body;

      // 이미 가입된 이메일인지 확인
      try {
        await admin.auth().getUserByEmail(email);
        return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
      } catch (err) {
        if (err.code !== 'auth/user-not-found') throw err;
      }

      const code = String(Math.floor(100000 + Math.random() * 900000));
      pendingCache.set(`pending_${email}`, { code, displayName, password, attempts: 0 });

      if (process.env.SMTP_USER) {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"데일리 뉴스" <${process.env.SMTP_USER}>`,
          to: email,
          subject: '[데일리 뉴스] 이메일 인증 코드',
          html: `
            <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:24px">
              <h2 style="color:#333;margin-bottom:8px">이메일 인증</h2>
              <p style="color:#555">안녕하세요, <strong>${displayName}</strong>님!<br>
              아래 6자리 코드를 입력해 회원가입을 완료하세요.</p>
              <div style="background:#f4f4f4;border-radius:12px;padding:20px;text-align:center;margin:24px 0">
                <span style="font-size:40px;font-weight:900;letter-spacing:10px;color:#222">${code}</span>
              </div>
              <p style="color:#999;font-size:12px">이 코드는 10분간 유효합니다.<br>
              본인이 요청하지 않았다면 이 메일을 무시하세요.</p>
            </div>
          `,
        });
      } else {
        // 개발 환경: 콘솔에 출력
        console.log(`[AUTH] 인증 코드 (개발용) ${email} → ${code}`);
      }

      res.json({ message: '인증 코드를 이메일로 발송했습니다.' });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/verify-code — 코드 검증 후 계정 생성
router.post(
  '/verify-code',
  [
    body('email').isEmail().normalizeEmail(),
    body('code').isString().trim().isLength({ min: 6, max: 6 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, code } = req.body;
      const pending = pendingCache.get(`pending_${email}`);

      if (!pending) {
        return res.status(400).json({ error: '인증 코드가 만료되었습니다. 다시 시도하세요.' });
      }

      pending.attempts += 1;

      if (pending.attempts > 5) {
        pendingCache.del(`pending_${email}`);
        return res.status(400).json({ error: '시도 횟수를 초과했습니다. 처음부터 다시 시도하세요.' });
      }

      pendingCache.set(`pending_${email}`, pending);

      if (pending.code !== code) {
        const left = 5 - pending.attempts + 1;
        return res.status(400).json({ error: `인증 코드가 올바르지 않습니다. (${left}회 남음)` });
      }

      // Firebase 계정 생성 (emailVerified: true)
      const userRecord = await admin.auth().createUser({
        email,
        password: pending.password,
        displayName: pending.displayName,
        emailVerified: true,
      });

      const customToken = await admin.auth().createCustomToken(userRecord.uid);
      pendingCache.del(`pending_${email}`);

      res.json({ customToken, displayName: pending.displayName });
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        pendingCache.del(`pending_${req.body.email}`);
        return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
      }
      next(err);
    }
  }
);

module.exports = router;
