import React, { useState, useEffect, useRef } from "react";
import "./FileExplorer.css";

interface FileExplorerItem {
	type: string;
	name: string;
	data?: FileExplorerItem[];
	meta?: string;
}

interface FileExplorerProps {
	explorerData: FileExplorerItem[];
}

const FileExplorer: React.FC<FileExplorerProps> = ({ explorerData }) => {
	const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
	const [activeFile, setActiveFile] = useState<string | null>(null);
	const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number;} | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [logs, setLogs] = useState<string[]>([]);
	const fileRefs = useRef<{ [key: string]: HTMLParagraphElement | null }>({});

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (activeFile && fileRefs.current[activeFile]) {
				const index = explorerData.findIndex(
					(item) => item.name === activeFile
				);
				if (event.key === "ArrowDown") {
					if (index < explorerData.length - 1) {
						const nextFile = explorerData[index + 1].name;
						setActiveFile(nextFile);
						updateLogs(`Arrow Down Key Pressed Event Triggered`);
					}
				} else if (event.key === "ArrowUp") {
					if (index > 0) {
						const prevFile = explorerData[index - 1].name;
						setActiveFile(prevFile);
						updateLogs(`Arrow Up Key Pressed Event Triggered`);
					}
				}
			} else {
				const activeElement = document.activeElement;
				if (activeElement && activeElement instanceof HTMLElement) {
					const nodeName = activeElement.nodeName.toLowerCase();
					if (nodeName === "p") {
						const fileElement =
							activeElement as HTMLParagraphElement;
						const fileName = fileElement.textContent || "";
						const index = explorerData.findIndex(
							(item) => item.name === fileName.trim()
						);
						if (event.key === "ArrowDown") {
							if (index < explorerData.length - 1) {
								const nextFile = explorerData[index + 1].name;
								setActiveFile(nextFile);
								updateLogs(`Arrow Up Key Pressed Event Triggered`);
							}
						} else if (event.key === "ArrowUp") {
							if (index > 0) {
								const prevFile = explorerData[index - 1].name;
								setActiveFile(prevFile);
								updateLogs(`Arrow Down Key Pressed Event Triggered`);
							}
						}
					}
				}
			}
		};

		const handleClickOutsideContextMenu = (event:MouseEvent) => {
			if (contextMenuPosition && !(event?.target as HTMLElement).closest("#context-menu")) {
				handleCloseContextMenu();
				updateLogs(`Menu closed due to outside click Event Triggered`);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		window.addEventListener("click", handleClickOutsideContextMenu);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("click", handleClickOutsideContextMenu);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeFile, explorerData, contextMenuPosition]);

	const toggleFolder = (folderName: string) => {
		if (expandedFolders.includes(folderName)) {
			setExpandedFolders(expandedFolders.filter((name) => name !== folderName));
			updateLogs(`Folder collapsed Event Triggered`);
		} else {
			setExpandedFolders([...expandedFolders, folderName]);
			updateLogs(`Folder expand Event Triggered`);
		}
	};

	const handleClickFile = (fileName: string) => {
		setActiveFile(fileName === activeFile ? null : fileName);
		updateLogs(`Item ${fileName} clicked Event Triggered`);
	};

	const handleContextMenu = (
		event: React.MouseEvent<HTMLDivElement>,
		fileName: string
	) => {
		event.preventDefault();
		setContextMenuPosition({ x: event.clientX, y: event.clientY });
		setActiveFile(fileName);
		updateLogs(`Context Menu open Event Triggered`);
	};

	const handleCopy = (fileName: string) => {
		updateLogs(`Context Menu Copy option for item ${fileName} clicked Event Triggered`);
		handleCloseContextMenu();
	};

	const handleDelete = (fileName: string) => {
		updateLogs(`Context Menu Delete option for item ${fileName} clicked Event Triggered`);
		handleCloseContextMenu();
	};

	const handleRename = (fileName: string) => {
		updateLogs(`Context Menu Remove option for item ${fileName} clicked Event Triggered`);
		handleCloseContextMenu();
	};

	const handleCloseContextMenu = () => {
		setContextMenuPosition(null);
		setActiveFile(null);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		updateLogs(`Search Event Triggered with value ${event.target.value}`);
	};

	const filterData = (data: FileExplorerItem[]): FileExplorerItem[] => {
		return data.filter((item) => {
			if (item.type === "folder") {
				const subFolderData = item.data ? filterData(item.data) : [];
				return (
					subFolderData.length > 0 ||
					item.name.toLowerCase().includes(searchTerm.toLowerCase())
				);
			} else {
				return item.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			}
		});
	};

	const renderFileExplorer = (data: FileExplorerItem[]) => {
		const highlightSearchTerm = (text: string) => {
			const lowerCaseText = text.toLowerCase();
			const lowerCaseSearchTerm = searchTerm.toLowerCase();
			const index = lowerCaseText.indexOf(lowerCaseSearchTerm);
			if (index !== -1) {
				const before = text.substring(0, index);
				const highlighted = text.substring(
					index,
					index + searchTerm.length
				);
				const after = text.substring(index + searchTerm.length);
				return (
					<>
						{before}
						<span className="highlight">{highlighted}</span>
						{after}
					</>
				);
			}
			return text;
		};

		return filterData(data).map((item, index) => {
			if (item.type === "folder") {
				const isExpanded = expandedFolders.includes(item.name);
				return (
					<div key={index}>
						<p
							style={{ cursor: "pointer" }}
							onClick={() => toggleFolder(item.name)}
							ref={(ref) => (fileRefs.current[item.name] = ref)}
							onContextMenu={(e) =>
								handleContextMenu(e, item.name)
							}
							tabIndex={0}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									toggleFolder(item.name);
								}
							}}
						>
							<span className="expander-icon">{!isExpanded ? '➕' : '➖'}</span>
							<span>📁</span>
							<span className="file-name">{highlightSearchTerm(item.name)}</span>

						</p>
						{isExpanded && item.data && (
							<div style={{ marginLeft: "20px" }}>
								{renderFileExplorer(item.data)}
							</div>
						)}
					</div>
				);
			} else {
				return (
					<div key={index}>
						<p
							style={{
								cursor: "pointer",
								fontWeight:
									activeFile === item.name
										? "bold"
										: "normal",
								backgroundColor:
									activeFile === item.name
										? "#ffffcc"
										: "transparent",
							}}
							onClick={() => handleClickFile(item.name)}
							onContextMenu={(e) =>
								handleContextMenu(e, item.name)
							}
							ref={(ref) => (fileRefs.current[item.name] = ref)}
							tabIndex={0}>
							<span>📄</span>
							<span className="file-name">{highlightSearchTerm(item.name)}</span>
						</p>
					</div>
				);
			}
		});
	};

	const updateLogs = (newLog:string) => {
		const existingLogs = [...logs];
		existingLogs.push(newLog);
		setLogs(existingLogs);
	};

	return (
		<div className="file-explorer container">
			<h2>File Explorer</h2>
			<div className="row">
				<div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
					<input
						type="search"
						placeholder="Search..."
						value={searchTerm}
						onChange={handleSearchChange}
						className="search-input"
					/>
					<div className="file-list-wrapper">
						{explorerData.length === 0 ? (<p>No files or folders found.</p> ) : ( renderFileExplorer(explorerData))}
					</div>
					{(contextMenuPosition && activeFile) && (
						<div
							className="context-menu"
							style={{ top  : contextMenuPosition.y, left : contextMenuPosition.x }}>
							<div className="context-menu-item" onClick={() => handleCopy(activeFile)}>📋 Copy</div>
							<div className="context-menu-item" onClick={() => handleDelete(activeFile)}>🗑️ Delete</div>
							<div className="context-menu-item" onClick={() => handleRename(activeFile)}>✍🏼 Rename</div>
						</div>
					)}
				</div>
				<div className="col-xs-12 col-sm-6 col-md-9 col-lg-9">
					<div className="action-area">
						{
							logs.length ? (
								<>
									<h4>
										<span>File Explorer Events :</span>
										<span id="clear-log-btn" onClick={() => setLogs([])}>Clear Logs</span>
									</h4>
									<ul>{ logs.map((log, index) => (<li>{log}</li>)) }</ul>
								</>
							) : null
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FileExplorer;
