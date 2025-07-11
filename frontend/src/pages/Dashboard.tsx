import { useEffect, useState } from "react";
import api from "../api/axios";
import { StatsCards } from "../components/StatsCards";
import { LinksChart } from "../components/LinksChart";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchURLs = async () => {
      try {
        const res = await api.get("/urls");
        setUrls(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch URLs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchURLs();
  }, []);

  return (
    <div className="flex-1 p-6 overflow-auto h-full ">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <div className="text-center text-gray-400 animate-pulse py-10">
          Loading data...
        </div>
      ) : (
        <>
          <StatsCards urls={urls} />
          <div className="grid grid-cols-1 w-full mt-6">
            <LinksChart urls={urls} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
