import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import Register from "../Register";
import api from "../../api/axios";

vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("Login Page", () => {
  // render login page
  it("renders email and password inputs", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login now/i })
    ).toBeInTheDocument();
  });

  // Login
  it("submits login form successfully", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;

    mockedPost.mockResolvedValueOnce({
      data: { token: "test-token" },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login now/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("test-token");
    });
  });
});

// Register
it("registers a new user successfully", async () => {
  const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;

  mockedPost.mockResolvedValueOnce({
    data: { message: "Registration successful" },
  });

  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: "newuser@example.com" },
  });

  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: "strongpass123" },
  });

  fireEvent.click(screen.getByRole("button", { name: /register now/i }));

  await waitFor(() => {
    expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
  });
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
