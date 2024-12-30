import axios from "axios";

//액시오스 인스턴스 생성
const instance = axios.create({
  baseURL: React_APP_API_BASE_URL, //환경변수 사용
  timeout: 5000, //요청제한시간
  withCredentials: true, //쿠키 전송 허용
});

//쿠키 값을 가져오는 함수
const getCookies =(name) =>{
    const cookies = document.cookie.split(";");
    const targetCookie = cookies.find((cookies)=>cookies.startsWith(`${name}=`));
    return targetCookie ? targetCookie.split("=")[1] : [null];
    //해당 쿠키의 값 반환
};

//요청 인터셉터

instance.interceptors.reques.use(
    (config) => {

        //쿠키에서 accessToken,refreshToken 가져오기
       const accessToken = getCookies('token');
       const refreshToken = getCookies("refreshToken");

       if(accessToken){
         config.headers.Authorization = `Bearer ${accessToken}`;
         // Authorization 헤더에 accessToken 추가
       }
       if(refreshToken){
        config.headers["x-refresh-token"]=refreshToken;
        //추가적인 헤더에 refreshToken 추가
       }
       return config;
},
(error)=>{
    console.error("Request Error:",error);
    return Promise.reject(error);
}
);

//응답 인터셉터
instance.interceptors.response.use(
    (response)=>{
        console.log('Response:',response);

        return response;
    },
    (error)=>{
        console.error('ResponseError:',error);

        //401 Unauthorized처리
        if(error.response && error.response.status === 401){
            console.log('Unauthorized.Redirecting to login...');
            //로그인이 필요한 경우 로그인 페이지로 리다이렉트
            window.location.href="/Pages/views/Login";
        }

        return Promise.reject(error);
    }
);
export default instance;