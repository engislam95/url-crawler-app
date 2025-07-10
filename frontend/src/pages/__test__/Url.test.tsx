import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UrlResultsTable } from "../../components/UrlResultsTable";
import { MemoryRouter } from "react-router-dom";

const mockUrls = [
  {
    ID: 1,
    Link: "https://example.com",
    Title: "Example Domain",
    HTMLVersion: "HTML5",
    InternalLinks: 5,
    ExternalLinks: 2,
    BrokenLinks: 0,
    Status: "done",
    CreatedAt: "2025-07-08T15:50:20.343+03:00",
  },
];

describe("UrlResultsTable", () => {
  it("renders URL table with data", () => {
    render(
      <MemoryRouter>
        <UrlResultsTable urls={mockUrls} />
      </MemoryRouter>
    );

    expect(screen.getByText(/example domain/i)).toBeInTheDocument();
    expect(screen.getByText(/https:\/\/example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/html5/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });
});
