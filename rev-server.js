require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

// ===== Middleware 설정 =====\\
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==== 세션 설정 ====== \\
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false
}));

// ===== 로그인 여부 확인 미들웨어 =====
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}


// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));  // 정적파일 [현재 실행중인(server.js)디렉토리/public]

// EJS 뷰 설정
app.set('view engine', 'ejs');                      // view 엔진 : 확장자 ejs
app.set('views', path.join(__dirname, 'views'));    // views 가 있는 곳: 현재 실행중인(server.js) 디렉토리/views ==> 경로만 지정하는 역할


// 라우터 등록
const startRoutes = require('./server/routes/start');   // ./server/routes/start.js 속에서  최초 시작 page route.geet)'/' 요청 받기
const authRoutes = require('./server/routes/rev-auth');   // ./server/routes/auth.js 속에서  route.get, route.post, route.delete 를 주고 받을 수 있게
const indexRoutes = require('./server/routes/index'); // ./server/routes

// 라우터 적용
app.use('/', startRoutes);   // 최초 시작 라우트로 설정정
app.use('/', authRoutes);   // 인증 관련 라우트 우선 ==> 이 라우터에서 
app.use('/', indexRoutes);  // 일반 페이지 라우트

// ===== 서버 시작 =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
