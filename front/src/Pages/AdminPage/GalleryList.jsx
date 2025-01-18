import React, { useState } from "react";
import { useGalleryDelete } from "../../hook/useDeletGallery"; // 삭제 기능
import { useGalleryLoad } from "../../hook/useGalleryLoad"; // 갤러리 구현 기능
import { useNavigate } from "react-router-dom";

function GalleryList() {
  const { deleteGalleryItems } = useGalleryDelete();
  const { items, managerInfo, loader } = useGalleryLoad();
  const navigate = useNavigate();

  // 상태 관리
  const [deleteReason, setDeleteReason] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [manager, setManager] = useState(""); // 작성자 이름 상태

  console.log(manager); // 디버깅: 작성자 이름 확인
  console.log(deleteReason);

  // 랜덤 높이 설정 함수
  const getRandomHeight = () => Math.floor(Math.random() * 10) + 1;

  // 체크박스 상태 관리 함수
  const handleCheckboxChange = (link_id, isChecked) => {
    console.log("선택 된거야?", selectedIds);
    console.log("link_id: ", link_id);
    setSelectedIds((prevSelectedIds) => {
      if (isChecked) {
        return [...prevSelectedIds, link_id];
      } else {
        return prevSelectedIds.filter((id) => id !== link_id);
      }
    });
  };

  // 상세 페이지 이동
  const handleDetails = (e, linkId) => {
    e.preventDefault();
    navigate("/DetailsPage", { state: { linkId } });
  };

  // 삭제 처리
  const handleDelete = () => {
    console.log("삭제 버튼 눌림");
    console.log("작성자", manager);
    console.log("내용", deleteReason);

    if (deleteGalleryItems(selectedIds, deleteReason, manager, managerInfo.uuid)) {
      setDeleteReason(""); // 삭제 사유 초기화
      setManager(""); // 작성자 이름 초기화
      setSelectedIds([]); // 선택된 ID 초기화
    }
    navigate("/GalleryList");
  };

  return (
    <div className="GalleryList">
      <div className="GalleryListView">
        {items.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            작성된 글이 없습니다.
          </p>
        ) : (
          <div className="masonry">
            {items.map((item) => (
              <div
                className="item"
                key={item.link_id}
                style={{ gridRowEnd: `span ${getRandomHeight()}` }}
              >
                <div className="checkArea">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(item.link_id, e.target.checked)
                    }
                  />
                </div>
                <img
                  onClick={(e) => handleDetails(e, item.link_id)}
                  src={`/contentImage/${item.up_filename}`}
                  alt={item.up_filename}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
            <div
              ref={loader}
              style={{ height: "50px", background: "transparent" }}
            />
          </div>
        )}
      </div>

      <div className="AdminfunctionAreaG">
        <div className="AdminNameArea">
          <h3>관리자: @{managerInfo.tagId}</h3>
        </div>

        <div className="RealNameG">
          <input
            className="RealWriterName"
            type="text"
            placeholder="작성의 이름을 쓰세요."
            value={manager} // 작성자 이름 상태값
            onChange={(e) => setManager(e.target.value)} // onChange로 작성자 이름 상태 업데이트
          />
        </div>

        <div className="delreason">
          <input
            type="text"
            maxLength={80}
            placeholder="사유를 입력하세요"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)} // 삭제 사유 상태값
          />
        </div>

        <div className="delArea">
          <button className="delete" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default GalleryList;
