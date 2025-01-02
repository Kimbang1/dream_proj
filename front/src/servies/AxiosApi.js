import axios from "axios";

//액시오스 인스턴스 생성
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, //환경변수 사용
  timeout: 5000, //요청제한시간
  withCredentials: true, //쿠키를 요청에 포함하도록 설정
  headers: {
    "Content-Type": "application/json",
  },
});

//요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // Authorization 헤더에 accessToken 추가(쿠키에서 자동으로 포함됨)
    // axios는 'withCredentials' 설정을 통해 자동으로 쿠키를 포함 함.
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

//응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    // 응답 성공 처리
    console.log("Response:", response);
    return response;
  },
  async (error) => {
    // 에러 상태 처리
    if (error.response) {
      const status = error.response.status;

      let isRefreshing = false; // 토큰 재발급 중인지를 추적하는 변수
      let failedQueue = []; // 재시도해야 할 요청들을 저장할 큐큐

      const processQueue = (token, error) => {
        failedQueue.forEach((prom) => {
          if (token) {
            prom.resolve(token);
          } else {
            prom.reject(error);
          }
        });
        failedQueue = [];
      };

      // 잘못된 요청
      if (status === 400) {
        alert("잘못된 요청입니다. 다시 시도해주세요.");
      }

      // 인증 실패(로그인 정보가 잘못된 경우)
      else if (
        status === 401 &&
        error.config.url !== "/auth/login" &&
        error.config.url !== "/auth/refresh"
      ) {
        if (!isRefreshing) {
          // refreshToken을 사용하여 새로운 accessToken을 요청
          isRefreshing = true;
          try {
            const refreshResponse = await axios.post(
              "/auth/refresh",
              {},
              { withCredentials: true }
            );
            const newAccessToken = refreshResponse.data.accessToken;

            processQueue(newAccessToken, null);
            return instance(error.config);
          } catch (refreshError) {
            processQueue(null, refreshError);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // 다른 요청은 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              error.config.headers["Authorization"] = `Bearer ${token}`;
              resolve(instance(error.config));
            },
            reject: (err) => reject(err),
          });
        });
      }

      // 409 상태 처리 (중복된 회원)
      else if (status === 409) {
        alert("이미 가입된 회원입니다.");
      }

      // 500 상태 처리 (서버 오류)
      else if (status === 500) {
        alert("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } else {
      // 서버로부터 응답을 받지 못한 경우(ex: 네트워크 오류)
      alert("네트워크 오류가 발생했습니다.");
    }

    return Promise.reject(error);
  }
);
export default instance;
