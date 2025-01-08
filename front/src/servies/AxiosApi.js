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
    if (error.response && error.response.status === 600) {
      console.log("이거 타나?");
      try {
        // /auth/refresh 엔드포인트로 요청 보내기
        const refreshResponse = await instance.post("/auth/refresh", {});

        // 새 엑세스 토큰은 서버가 쿠키에 담아서 반환하므로,
        // 응답에서 accessToken을 받지 않고 쿠키로 자동 처리됨

        // 원래 요청을 새로운 엑세스 토큰으로 재시도 (자동으로 쿠키가 포함됨)
        const originalRequest = error.config;
        return instance(originalRequest);
      } catch (refreshError) {
        console.log("리프레쉬 토큰이 날아갔습니다:",refreshError);
        alert("세션이 만료 되었으니 다시 로그인 해주세요.")
      }
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
