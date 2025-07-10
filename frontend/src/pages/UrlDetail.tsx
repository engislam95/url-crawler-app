import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LinksChart } from "../components/LinksChart";
import api from "../api/axios";
import type { UrlResult } from "../components/UrlResultsTable";
import { ArrowLeft } from "lucide-react";

const UrlDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState<UrlResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/urls/${id}`);
        setUrl(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch URL detail", err);
        setError("Failed to load URL details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleBack = () => navigate(-1);

  if (loading) {
    return <div className="p-6 text-gray-200">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>;
  }

  if (!url) {
    return <div className="p-6 text-gray-400">No data found for this URL.</div>;
  }

  const urls = [url]; // for LinksChart
  const brokenLinks = Array.from({ length: url.BrokenLinks || 0 }, (_, i) => ({
    link: `${url.Link}/broken-${i + 1}`,
    status: 404,
    type: i % 2 === 0 ? "internal" : "external",
  }));

  return (
    <div className="p-6 text-white ">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="bg-blue-950  mb-5 cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to List
      </button>

      <h1 className="text-2xl font-bold mb-4">{url.Title || "Untitled"}</h1>

      {/* Basic Info */}
      <div className="mb-4 space-y-2">
        <p>
          <span className="font-medium text-gray-300">Link:</span>{" "}
          <a
            href={url.Link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            {url.Link}
          </a>
        </p>
        <p>
          <span className="font-medium text-gray-300">HTML Version:</span>{" "}
          {url.HTMLVersion || "—"}
        </p>
        <p>
          <span className="font-medium text-gray-300">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              url.Status === "done"
                ? "bg-green-500"
                : url.Status === "running"
                ? "bg-yellow-500 text-black"
                : "bg-blue-500"
            }`}
          >
            {url.Status}
          </span>
        </p>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 rounded-xl p-4 mb-6">
        <LinksChart urls={urls} />
      </div>

      {/* Broken Links Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Broken Links</h2>
        <div className="overflow-auto border border-gray-700 rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-3">Link</th>
                <th className="p-3">Status Code</th>
                <th className="p-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {brokenLinks.length > 0 ? (
                brokenLinks.map((link, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-700 hover:bg-gray-800"
                  >
                    <td className="p-3 text-blue-400 underline break-all">
                      {link.link}
                    </td>
                    <td className="p-3 text-red-400">{link.status}</td>
                    <td className="p-3 text-gray-300 capitalize">
                      {link.type}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No broken links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UrlDetail;
