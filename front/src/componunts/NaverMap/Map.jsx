import React, { useEffect } from "react";

function Map(){

    useEffect(()=>{
        //네이버 지도 초기화
        const mapDiv = document.getElementById("map");
        const map = new window.naver.maps.Map(mapDiv,{

        center:new window.naver.maps.LaLng(37.5665,123.9780),   //서울 중심 좌표
        zoom:10,    //줌 레벨            
        });
    },[]); //빈 배열 : 컴포넌트 마운트 시 한번만 실행
    return(
            <div className="mapview" style={{height:"100vh",width:"100%"}}>
                <div id="map" style={{height:"100vh",width:"100%"}}>

                </div>
            </div>
    );
}

export default Map;