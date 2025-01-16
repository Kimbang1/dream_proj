import { useMemo } from "react";

export function useFilterMonitors(users, searchMonitor) {
  const filteredMonitors = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchMonitor.toLowerCase())
    );
  }, [users, searchMonitor]);

  return { filteredMonitors };
}
