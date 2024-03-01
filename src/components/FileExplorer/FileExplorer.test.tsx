import { fireEvent, render } from "@testing-library/react";
import FileExplorer from "./FileExplorer";

test("renders FileExplorer component", () => {
	render(<FileExplorer explorerData={[]} />);
});

test("initializes with correct initial state", () => {
	const { getByPlaceholderText } = render(<FileExplorer explorerData={[]} />);
	const searchInput = getByPlaceholderText("Search...");
	expect((searchInput as HTMLInputElement).value).toBe("");
});

test("search functionality works correctly", () => {
	const explorerData = [
		{ type: "folder", name: "Folder 1", data: [] },
		{ type: "file", name: "file1.txt" },
		{ type: "folder", name: "Folder 2", data: [] },
	];

	const { getByPlaceholderText, getByText, queryByText } = render(
		<FileExplorer explorerData={explorerData} />
	);

	const searchInput = getByPlaceholderText("Search...");

	fireEvent.change(searchInput, { target: { value: "folder" } });

	expect(getByText("Folder 1")).toBeInTheDocument();
	expect(getByText("Folder 2")).toBeInTheDocument();
	expect(queryByText("file1.txt")).toBeNull();
});

test("folder toggle works correctly", () => {
	const explorerData = [
		{ type: "folder", name: "Folder 1", data: [] },
		{ type: "file", name: "file1.txt" },
	];

	const { getByText, queryByText } = render(
		<FileExplorer explorerData={explorerData} />
	);

	expect(queryByText("file1.txt")).toBeNull();

	fireEvent.click(getByText("Folder 1"));

	expect(getByText("file1.txt")).toBeInTheDocument();
});

test("context menu works correctly", () => {
	const explorerData = [
		{ type: "folder", name: "Folder 1", data: [] },
		{ type: "file", name: "file1.txt" },
	];

	const { getByText, queryByText } = render(
		<FileExplorer explorerData={explorerData} />
	);

	fireEvent.contextMenu(getByText("file1.txt"));

	expect(queryByText("📋 Copy")).toBeInTheDocument();
	expect(queryByText("🗑️ Delete")).toBeInTheDocument();
	expect(queryByText("✍🏼 Rename")).toBeInTheDocument();
});
