import React, { useEffect, useState } from "react";
import AxiosApi from "../../servies/AxiosApi"; // axios로 API 호출

function UserList() {
  // 상태 관리: 유저 데이터
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(true);
  // API 호출 (컴포넌트가 렌더링될 때 한 번 실행)
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await AxiosApi.get("/user/info");
        if (Array.isArray(response.data)) {
          setUsers(response.data); // 배열일 때만 상태 업데이트
        } else {
          console.error("API 응답이 배열이 아닙니다:", response.data);
          setUsers([]); // 비정상 데이터 처리
        }
      } catch (error) {
        console.error("유저 데이터를 가져오는 중 오류 발생:", error);
        setUsers([]); // 오류 발생 시 빈 배열로 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    }
    fetchUsers();
  }, []); // 의존성 배열을 빈 배열로 설정하여 한 번만 실행

  return (
    <div className="UserListframe">
      <div className="listView">
        <div className="UserSearchArea">
          <input
            className="AdminUseSearch"
            type="text"
            placeholder="회원 검색"
          />
          <img id="dodbogi" src="/images/dodbogi.png" alt="돋보기" />
        </div>

        <div className="BtnfunctionArea">
          <button className="triplets AlluserLsit">회원 전체 보기</button>
          <button className="triplets onlyAdmin">관리자들만 보기</button>
          <button className="triplets array">
            정렬 선택
            <label htmlFor=""></label>
          </button>
        </div>

        {/* 유저 리스트 출력 */}
        <div className="ListBox">
          {loading ? (
            <div>로딩 중...</div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="userItem">
                <input type="checkbox" />
                <img
                  src={user.image}
                  alt={`${user.name} 이미지`}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <span>
                  {user.name} / {user.role}
                </span>
              </div>
            ))
          ) : (
            <div>유저 데이터가 없습니다.</div>
          )}
        </div>

        <div className="AdminCommitClear">
          <button className="twins Commit">관리자 등록</button>
          <button className="twins Clear">관리자 해제</button>
        </div>
      </div>

      <div className="AdminfunctionArea">
        <div className="checkBoxArea">
          <div className="Sb StopArea">
            <input type="checkBox" />
            <div className="spanArea">
              <span>계정 정지</span>
            </div>
          </div>
          <div className="Sb  ClearArea">
            <input type="checkBox" />
            <div className="spanArea">
              <span>계정 삭제</span>
            </div>
          </div>
        </div>
        <div className="AdminNameArea">
          <h3>관리자 이름</h3>
        </div>

        <div className="stopreason">
          <input type="text" maxLength={80} placeholder="사유를 입력하세요" />
        </div>

        <div className="stopListArea">
          <div className="stopLsit">
            <input type="checkbox" />
            <div className="List">정지 15일</div>
          </div>
          <div className="stopLsit">
            <input type="checkbox" />
            <div className="List">정지 30일</div>
          </div>
          <div className="stopLsit">
            <input type="checkbox" />
            <div className="List">정지 90일</div>
          </div>
          <div className="stopLsit">
            <input
              id="giganArea"
              type="text"
              placeholder="기간을 입력해주세요"
            />
          </div>
        </div>
        <div className="executionArea">
          <button className="execution">실행</button>
        </div>
      </div>
    </div>
  );
}

export default UserList;
