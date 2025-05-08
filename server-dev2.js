import express from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.static(__dirname));

// Serve frontend-v1.html saat akses root URL
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend-v1.html"));
});

// Endpoint untuk scraping berdasarkan keyword
app.post("/start-scraping", (req, res) => {
	const { keyword, pages } = req.body;

	if (!keyword || !pages) {
		return res.status(400).json({ error: "Keyword and pages are required" });
	}

	const scriptPath = path.join(__dirname, "scraper-frontend-key-page.js");
	const command = `node "${scriptPath}" "${keyword}" "${pages}"`;

	console.log(`Executing command: ${command}`);

	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${stderr}`);
			return res.status(500).json({ error: "Scraping failed" });
		}

		const csvFileName = `aliexpress_${keyword}_page${pages}.csv`;
		const csvPath = path.join(__dirname, csvFileName);

		res.download(csvPath, csvFileName, (err) => {
			if (err) {
				console.error(err);
				res.status(500).send("File not found");
			}
		});
	});
});

// Endpoint untuk scraping berdasarkan URL
app.post("/start-scraping-url", (req, res) => {
	const { url } = req.body;

	if (!url) {
		return res.status(400).json({ error: "URL is required" });
	}

	const scriptPath = path.join(__dirname, "scraper-frontend-input-url.js");
	const command = `node "${scriptPath}" "${url}"`;

	console.log(`Executing command: ${command}`);

	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${stderr}`);
			return res.status(500).json({ error: "Scraping failed" });
		}

		const today = new Date().toISOString().split("T")[0];
		const csvFileName = `aliexpress_${today}.csv`;
		const csvPath = path.join(__dirname, csvFileName);

		res.download(csvPath, csvFileName, (err) => {
			if (err) {
				console.error(err);
				res.status(500).send("File not found");
			}
		});
	});
});

// Jalankan server
app.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
});
