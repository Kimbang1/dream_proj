// useSearchSubmit.js
import { useState } from "react";
import AxiosApi from "../servies/AxiosApi";
import { useNavigate } from "react-router-dom";

const useSearchSubmit = () => {
  const [searchMonitor, setSearchMonitor] = useState("");
  const [recentSearch, setRecentSearch] = useState([]);
  const navigate = useNavigate();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchMonitor.trim() !== "") {
      setRecentSearch((prev) => {
        const newSearches = [searchMonitor, ...prev];
        return newSearches.slice(0, 5);
      });
      setSearchMonitor("");

      try {
        const response = await AxiosApi.get("/contents/search", {
          params: { query: searchMonitor },
        });
        console.log("검색 결과: ", response.data);
        navigate(`/SearchRes?query=${encodeURIComponent(searchMonitor)}`, {
          state: { searchResults: response.data },
        });
      } catch (error) {
        console.error("검색 요청 실패: ", error);
      }
    }
  };

  return {
    searchMonitor,
    setSearchMonitor,
    handleSearchSubmit,
    recentSearch,
    setRecentSearch,
  };
};

export default useSearchSubmit;
