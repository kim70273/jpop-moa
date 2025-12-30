import axios from 'axios';

const api = axios.create({
  // 이 URL은 클라이언트의 브라우저에서 접근 가능해야 합니다.
  // 백엔드 서버가 3000 포트에서 실행된다고 가정합니다.
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
