# 백엔드 CORS 설정 가이드 (credentials: true 대응)

프론트에서 `withCredentials: true`(HttpOnly refreshToken 등)를 사용하려면, 백엔드 CORS는 **와일드카드(`*`)를 쓰면 안 되고**, 요청 Origin을 그대로 허용 목록에 넣어서 보내야 합니다.

---

## 1. 필수 응답 헤더

클라이언트가 `credentials: true`로 요청할 때 서버가 **반드시** 내려줘야 할 헤더:

| 헤더 | 값 | 설명 |
|------|-----|------|
| `Access-Control-Allow-Origin` | **요청의 `Origin`과 동일한 값** (예: `http://localhost:3000`) | `*` 사용 불가. 허용할 origin을 하나씩 지정. |
| `Access-Control-Allow-Credentials` | `true` | 쿠키/인증 정보 허용. |
| (선택) `Access-Control-Allow-Methods` | `GET, POST, PUT, PATCH, DELETE, OPTIONS` 등 | preflight 시 허용 메서드. |
| (선택) `Access-Control-Allow-Headers` | `Content-Type, Authorization` 등 | preflight 시 허용 헤더. |

---

## 2. 허용 Origin 목록 (환경별)

- **개발**: `http://localhost:3000` (또는 사용하는 포트)
- **운영**: 프론트 실제 도메인 (예: `https://checktask.p-e.kr` 또는 프론트 전용 도메인)

요청의 `Origin` 헤더가 위 목록에 있으면, 응답의 `Access-Control-Allow-Origin`에는 **그 값 그대로** 넣어주면 됩니다.

---

## 3. 구현 예시

### 3.1 Express (Node.js)

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://checktask.p-e.kr',
  // 운영 프론트 도메인 추가
];

app.use(
  cors({
    origin: (origin, callback) => {
      // origin이 undefined일 수 있음(같은 도메인 요청 등)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,  // Access-Control-Allow-Credentials: true
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

**주의**: `origin: true`나 `origin: '*'`를 쓰면 credentials와 함께 사용할 수 없습니다. 반드시 위처럼 **구체적인 origin 문자열**을 넘겨줘야 합니다.

### 3.2 NestJS

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:3000', 'https://checktask.p-e.kr'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### 3.3 Socket.IO (같은 서버에서 제공 시)

Socket.IO도 HTTP 폴링/핸드셰이크 시 CORS 적용을 받습니다. Express에서 CORS를 이미 위처럼 설정했다면, 같은 앱에 마운트된 Socket.IO에는 보통 동일 설정이 적용됩니다.

Socket 전용으로 따로 두고 싶다면:

```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://checktask.p-e.kr'],
    credentials: true,
  },
});
```

---

## 4. 체크리스트

- [ ] `Access-Control-Allow-Origin`에 `*` 사용하지 않기
- [ ] `Access-Control-Allow-Origin`에 요청 Origin과 동일한 값 사용 (허용 목록에서 선택)
- [ ] `Access-Control-Allow-Credentials: true` 응답에 포함
- [ ] OPTIONS(preflight) 요청에도 위 헤더 동일 적용
- [ ] 개발/운영 도메인을 모두 허용 목록에 추가

이렇게 설정하면 프론트에서 **credentials: true**를 유지해도 CORS 오류 없이 동작합니다.
