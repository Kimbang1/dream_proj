import axios from "axios";

//액시오스 인스턴스 생성
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, //환경변수 사용
  timeout: 5000, //요청제한시간(5초)
  withCredentials: true, //쿠키를 요청에 포함하도록 설정
  headers: {
    "Content-Type": "application/json", //요청 데이터 형식을 json으로 설정
  },
});

// 리프레시 요청용 별도 axios 인스턴스 생성
const refreshInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = []; // 요청을 대기 시키는 배열

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed() {
  refreshSubscribers.forEach((callback) => callback()); //갱신된 토크으로 대기 요청을 실행
  refreshSubscribers = [];                              // 대기 목록 초기화
}

//요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    //요청을 보내기 전에 실행되는 로직
    return config;
  },
  (error) => {
    //요청을 보내는 중에 발생한 오류 처리
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
    const originalRequest = error.config;
    if (error.response && error.response.status === 600) {
      console.log("이거 타나?");
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // 새 토큰 요청
          await refreshInstance.post("/auth/refresh", {});
          isRefreshing = false;

          // 대기 중인 요청 실행
          onRefreshed();
        } catch (refreshError) {
          console.error("토큰 리프레시 실패: ", refreshError);
          isRefreshing = false;
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // 요청 대기
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(instance(originalRequest));
        });
      });
    }

    // 에러 상태 처리
    if (error.response) {
      const status = error.response.status;

      // 잘못된 요청
      if (status === 400) {
        alert("잘못된 요청입니다. 다시 시도해주세요.");
      }

      // 인증 실패(로그인 정보가 잘못된 경우)
      else if (status === 401) {
        alert("로그인 정보가 올바르지 않습니다.");
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
