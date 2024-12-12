import React from "react";
// react-router-dom을 사용하기 위해 API import
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Test from "../pagetest/Test";
import Res from "../pagetest/Res";

// Router라는 함수 만든 뒤 아래와 같이 작성
// BrowserRouter를 Router로 감싸는 이유: SPA의 장점인 브라우저 새로고침 없이 다른 페이지로 이동이 가능해진다.
function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Test/>} />
                <Route path="/res" element={<Res />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
