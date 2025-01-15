// useFilterMonitors.js
const useFilterMonitors = (monitorsData, searchMonitor) => {
  const filteredMonitors =
    monitorsData?.filter((monitorInfo) =>
      monitorInfo.name.toLowerCase().includes(searchMonitor.toLowerCase())
    ) || [];

  return { filteredMonitors };
};

export default useFilterMonitors;
