require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session'); // 세션 미들웨서 설정 (아래 session 사용에 필요)

const app = express();

// ====== Middleware 설정 ====== \\
app.use(express.urlencoded({ extended: true })); // HTML <form> </form> 전송에 필요
app.use(express.json());  // JavaScript fetch 나 axios 전송에 필요

// ===== 세션 설정 ===== \\ : 로그인 후 세션을 저장하면 RAM 에 저장되며 서버가 재시작 되면 사라짐 (저장된 세션의 ID와 PATH 는 Client 에 쿠키 형태로 저장장)
app.use(session({                   // module 에서 session 으로 할당된 객체를 사용
    secret: process.env.SESSION_SECRET || 'my_secret_key',  // 보안을 위해 환경변수 사용 권장
    resave: false,               // 세션을 매 요청마다 다시 저장하지 않음
    saveUninitialized: false,    // 로그인 등 세션에 변화가 없으면 저장하지 않음
    cookie: {
      maxAge: 1000 * 60 * 60,    // 쿠키 유효시간: 1시간 (밀리초 단위) : Client 의 세션 유지 시간 (아무 활동이 없으면 사라지게 하는 시간- 맨 끝자리수가 분)
      httpOnly: true,            // 클라이언트 JS에서 쿠키 접근 차단
      secure: false              // HTTPS 환경에서는 true로 설정
    }
  }));

// ===== 정적 파일 제공 ===== \\
app.use(express.static(path.join(__dirname, 'public')));  // 정적파일 [현재 실행중인(server.js)디렉토리/public]

// ===== EJS 뷰 설정 ===== \\
app.set('view engine', 'ejs');                      // view 엔진 : 확장자 ejs
app.set('views', path.join(__dirname, 'views'));    // views 가 있는 곳: 현재 실행중인(server.js) 디렉토리/views ==> 경로만 지정하는 역할


// ===== Express 웹서버에서 라우터를 연결하는 핵심역할 : 라우터 연결 ===== \\
const startRoutes = require('./server/routes/start');  // start.js 라우터 파일 연결 (시작화면 start.ejs 와 연결위해)
app.use('/', startRoutes);   // 라우터 등록 : router.get(), router.post() 를 처리 가능

const authRoutes = require('./server/routes/auth'); // ./routes/auth.js 파일을 불러옴 (라우터 객체를 받음)
app.use('/', authRoutes);   // 라우터 등록 : router.get(), router.post() 를 처리 가능

const dashboardRoutes = require('./server/routes/dashboard'); // ./routes/dashboard.js 파일을 불러옴 (라우터 객체를 받음)
app.use('/', dashboardRoutes);   // 라우터 등록 : 로그인 authController 에서 과정을 거쳐 res.redirect('/dashboard') 한 것도 라우터로 처리리

const generalRoutes = require('./server/routes/general'); // ./routes/dashboard.js 파일을 불러옴 (라우터 객체를 받음)
app.use('/', generalRoutes);   // 라우터 등록 : 로그인 authController 에서 과정을 거쳐 res.redirect('/dashboard') 한 것도 라우터로 처리리

const employeesRoutes = require('./server/routes/employees'); // ./routes/dashboard.js 파일을 불러옴 (라우터 객체를 받음)
app.use('/', employeesRoutes);   // 라우터 등록 : 로그인 authController 에서 과정을 거쳐 res.redirect('/dashboard') 한 것도 라우터로 처리리


// ====== 서버 시작 ====== \\
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});


