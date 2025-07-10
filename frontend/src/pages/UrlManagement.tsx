import { useEffect, useState } from "react";
import { UrlResultsTable, type UrlResult } from "../components/UrlResultsTable";
import api from "../api/axios";
import { RefreshCcw, Plus } from "lucide-react";
import toast from "react-hot-toast";

const UrlManagement = () => {
  const [urls, setUrls] = useState<UrlResult[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchURLs = async () => {
    try {
      const res = await api.get("/urls");
      setUrls(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch URLs", err);
    }
  };

  useEffect(() => {
    fetchURLs();
  }, []);

  const handleAddUrl = async () => {
    if (!newUrl.trim()) return;
    try {
      setLoading(true);
      const res = await api.post("/urls", { Link: newUrl.trim() });
      setUrls((prev) => [res.data.data, ...prev]);
      setNewUrl("");
      toast.success("URL add successfully!");
    } catch (err) {
      console.error("❌ Failed to add URL:", err);
      toast.error("Failed to add URL. Check if it’s valid or already exists.");
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    if (selectedIds.length === 0) return;
    try {
      setProcessing(true);
      await Promise.all(
        selectedIds.map(async (id) => {
          const targetUrl = urls.find((u) => u.ID === id);
          if (targetUrl) {
            await api.post("/urls", { Link: targetUrl.Link });
          }
        })
      );
      await fetchURLs(); // Refresh state
      toast.success("Re-analyze");
    } catch (err) {
      console.error("❌ Failed to re-analyze selected URLs:", err);
      toast.error("Failed to re-analyze. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 ">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <input
          type="url"
          placeholder="Enter URL to analyze"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          required
          className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-96"
        />
        <button
          onClick={handleAddUrl}
          disabled={loading || !newUrl.trim()}
          className="bg-blue-950 hover:bg-gray-800 cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add URL
        </button>
        <button
          onClick={handleReanalyze}
          disabled={selectedIds.length === 0 || processing}
          className="bg-blue-950 hover:bg-gray-800 cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCcw className="w-4 h-4 animate-spin-slow" />
          Re-analyze Selected
        </button>
      </div>

      <UrlResultsTable
        urls={urls}
        onSelectionChange={setSelectedIds}
        setUrls={setUrls}
      />
    </div>
  );
};

export default UrlManagement;
