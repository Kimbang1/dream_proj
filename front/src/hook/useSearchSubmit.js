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
      performSearch(searchMonitor);
      setSearchMonitor("");
    }
  };

  const performSearch = async (query) => {
    try {
      const response = await AxiosApi.get("/contents/search", {
        params: { query },
      });
      console.log("검색 결과: ", response.data);
      navigate(`/SearchRes?query=${encodeURIComponent(query)}`, {
        state: { searchResults: response.data },
      });
    } catch (error) {
      console.error("검색 요청 실패: ", error);
    }
  };

  const handleSearchClick = (query) => {
    setRecentSearch((prev) => {
      const newSearches = [query, ...prev.filter((item) => item !== query)];
      return newSearches.slice(0, 5);
    });
    performSearch(query);
  };

  return {
    searchMonitor,
    setSearchMonitor,
    handleSearchSubmit,
    handleSearchClick,
    recentSearch,
    setRecentSearch,
  };
};

export default useSearchSubmit;
