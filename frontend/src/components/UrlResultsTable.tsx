import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { fetchUrls } from "../api/urlService";

export type UrlResult = {
  ID: number;
  Link: string;
  Title: string;
  HTMLVersion: string;
  InternalLinks: number;
  ExternalLinks: number;
  BrokenLinks: number;
  Status: string;
  CreatedAt: string;
};

export const UrlResultsTable = ({
  urls,
  onSelectionChange,
  setUrls,
}: {
  urls: UrlResult[];
  onSelectionChange?: (ids: number[]) => void;
  setUrls?: React.Dispatch<React.SetStateAction<UrlResult[]>>;
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<keyof UrlResult | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [urlList, setUrlList] = useState<UrlResult[]>(urls);

  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIds((prev) => {
      const validIds = urls.map((u) => u.ID);
      const updated = prev.filter((id) => validIds.includes(id));
      onSelectionChange?.(updated);
      return updated;
    });
  }, [urls]);

  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    setUrlList(urls);
  }, [urls]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const toggleSort = (key: keyof UrlResult) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/urls/${id}`);
      setUrlList((prev) => prev.filter((url) => url.ID !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      setDeleteModalId(null);

      // Notify parent
      setUrls?.((prev) => prev.filter((url) => url.ID !== id));
      toast.success("URL deleted successfully!");
      await fetchUrls();
    } catch (error) {
      console.error("❌ Failed to delete URL:", error);
      toast.success("URL add successfully!");

      toast.error("Failed to delete. Please try again.");
    }
  };

  const filtered = urlList.filter(
    (url) =>
      url.Link.toLowerCase().includes(search.toLowerCase()) ||
      url.Title.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = sortBy
    ? [...filtered].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      })
    : filtered;

  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pageCount = Math.ceil(filtered.length / itemsPerPage);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      onSelectionChange?.(updated);
      return updated;
    });
  };

  const toggleSelectAll = () => {
    const allIds = paginated.map((url) => url.ID);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    const updated = allSelected
      ? selectedIds.filter((id) => !allIds.includes(id))
      : [...new Set([...selectedIds, ...allIds])];
    setSelectedIds(updated);
    onSelectionChange?.(updated);
  };

  return (
    <div className="relative">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            URL Results
          </h3>
          <input
            type="text"
            placeholder="Search by title or link"
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm w-64 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                <th className="p-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={toggleSelectAll}
                    checked={paginated.every((url) =>
                      selectedIds.includes(url.ID)
                    )}
                  />
                </th>
                {[
                  { label: "Title", key: "Title" },
                  { label: "Link", key: "Link" },
                  { label: "HTML Version", key: "HTMLVersion" },
                  { label: "Internal", key: "InternalLinks" },
                  { label: "External", key: "ExternalLinks" },
                  { label: "Status", key: "Status" },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    className="p-3 cursor-pointer"
                    onClick={() => toggleSort(key as keyof UrlResult)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {sortBy === key ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronUp className="w-4 h-4 opacity-20" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((url) => (
                <tr
                  key={url.ID}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedIds.includes(url.ID)}
                      onChange={() => toggleSelect(url.ID)}
                    />
                  </td>
                  <td className="p-3">{url.Title || "—"}</td>
                  <td className="p-3 text-blue-600 underline">{url.Link}</td>
                  <td className="p-3">{url.HTMLVersion || "—"}</td>
                  <td className="p-3">{url.InternalLinks}</td>
                  <td className="p-3">{url.ExternalLinks}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs font-semibold uppercase ${
                        url.Status === "done"
                          ? "bg-green-500"
                          : url.Status === "running"
                          ? "bg-yellow-500 text-black"
                          : url.Status === "error"
                          ? "bg-red-700 text-white"
                          : "bg-blue-500"
                      }`}
                    >
                      {url.Status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/urls/${url.ID}`)}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModalId(url.ID)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-500">
                    No matching results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="flex justify-end gap-2 mt-6 text-sm">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg border transition cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this URL? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModalId)}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
