import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

puppeteer.use(StealthPlugin());

// Ambil parameter dari command line
const keyword = process.argv[2];
const maxPage = parseInt(process.argv[3], 10);

if (!keyword || isNaN(maxPage)) {
	console.error("Keyword dan jumlah halaman (maxPage) diperlukan.");
	process.exit(1);
}

console.log(`Keyword: ${keyword}, Max Page: ${maxPage}`);

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Sesuaikan path Chrome
		defaultViewport: null,
		args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
	});

	const page = await browser.newPage();

	page.setDefaultTimeout(120000); // Set timeout default untuk semua operasi
	page.setDefaultNavigationTimeout(120000); // Set timeout untuk navigasi

	await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36");
	await page.setViewport({ width: 1366, height: 768 });
	await page.setExtraHTTPHeaders({
		"accept-language": "en-US,en;q=0.9",
	});

	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, "webdriver", { get: () => false });
	});

	const searchUrl = `https://www.aliexpress.com/w/wholesale-${keyword}.html?sortType=total_tranpro_desc`;

	console.log("Starter URL:", searchUrl);
	await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 120000 });

	await handleCaptcha(page);

	// Fungsi untuk mendapatkan tab baru dari browser
	async function getTab(browser) {
		const pages = await browser.pages(); // Ambil semua tab yang ada
		for (const page of pages) {
			const url = await page.url();
			if (url === "about:blank") {
				return page; // Gunakan tab kosong jika tersedia
			}
		}
		return await browser.newPage(); // Jika tidak ada tab kosong, buka tab baru
	}

	// Gunakan fungsi untuk jelajahi halaman dan kumpulkan URL produk
	const productUrls = await scrapePages(page, maxPage);

	console.log("Total Produk:", productUrls.length);

	const productData = [];

	for (let i = 0; i < productUrls.length; i++) {
		const url = productUrls[i];
		console.log(`⏳ Scraping [${i + 1}/${productUrls.length}] ${url}`);

		const productPage = await getTab(browser);

		try {
			await retryOperation(() => productPage.goto(url, { waitUntil: "networkidle2", timeout: 60000 }));

			// Tangani CAPTCHA jika muncul
			await handleCaptcha(productPage);

			await productPage.waitForSelector("div.pdp-info-right", {
				timeout: 20000,
			});

			const data = await productPage.evaluate(() => {
				const getText = (selector) => {
					const el = document.querySelector(selector);
					return el ? el.innerText.trim() : "N/A";
				};

				const getAllImgUrls = () => {
					const images = Array.from(document.querySelectorAll("div.slider--item--RpyeewA img"));
					return images.map((img) => img.src || img.getAttribute("data-src")).filter(Boolean);
				};

				const getSKUs = () => {
					const skuGroups = document.querySelectorAll("div.sku-item--skus--StEhULs");
					const result = [];

					skuGroups.forEach((group) => {
						const items = Array.from(group.querySelectorAll("div[data-sku-col]"));
						items.forEach((item) => {
							const title = item.getAttribute("title") || item.innerText.trim();
							const img = item.querySelector("img");
							const imgSrc = img ? img.src : null;
							result.push(imgSrc ? `${title} | ${imgSrc}` : title);
						});
					});
					return result.length > 0 ? result.join(" | ") : "N/A";
				};

				const getShippingPrice = () => {
					const elements = Array.from(document.querySelectorAll("div.dynamic-shipping-line.dynamic-shipping-titleLayout span"));
					for (let el of elements) {
						const text = el.innerText.trim();
						if (/^Shipping:/i.test(text) || /^Free shipping$/i.test(text)) {
							return text.replace(/^Shipping:\s*/, "") || "Free shipping";
						}
					}
					return "N/A";
				};

				const getDeliveryDate = () => {
					const el = document.querySelector("div.dynamic-shipping-line.dynamic-shipping-contentLayout strong");
					return el ? el.innerText.trim() : "N/A";
				};

				const getAvailableStock = () => {
					const el = document.querySelector('span[data-spm-anchor-id*="available"]');
					if (!el) return "N/A";
					const match = el.innerText.match(/\d+/);
					return match ? match[0] : "N/A";
				};

				const getSpecs = () => {
					const specBlocks = document.querySelectorAll("div.product-specs div");
					const specs = Array.from(specBlocks).map((el) => el.innerText.trim());
					return specs.join(" | ") || "N/A";
				};

				const getDescriptionText = () => {
					const desc = document.querySelector("div.product-description div");
					return desc ? desc.innerText.trim() : "N/A";
				};

				const getDescriptionImages = () => {
					const imgs = Array.from(document.querySelectorAll("div.product-description img")).map((img) => img.src || img.getAttribute("data-src"));
					return imgs.filter(Boolean).join(" | ") || "N/A";
				};

				return {
					title: getText("div.title--wrap--UUHae_g h1"),
					price_current: getText("span.price--currentPriceText--V8_y_b5"),
					price_original: getText("div.price--original--wEueRiZ span.price--originalText--gxVO5_d"),
					discount: getText("div.price--original--wEueRiZ span.price--discount--Y9uG2LK"),
					coupon: getText("div.coupon-block--content--VGXFfl4 span"),
					tax_info: getText("div.vat-installment--wrap--MyYzjZo"),
					rating: getText("a.reviewer--rating--xrWWFzx strong"),
					sold: getText("span.reviewer--sold--ytPeoEy"),
					only_left: getText("span[data-spm-anchor-id*='Only']"),
					max_per_buyer: getText("div.quantity--info--jnoo_pD div div"),
					available: getAvailableStock(),
					reviews: getText("a.reviewer--reviews--cx7Zs_V"),
					colors:
						Array.from(document.querySelectorAll('[class*="sku-property-item"] [class*="sku-property-text"]'))
							.map((el) => el.innerText.trim())
							.join(", ") || "N/A",
					images: getAllImgUrls(),
					sku: getSKUs(),
					store_name: getText("span.store-detail--storeName--Lk2FVZ4"),
					shipping_price: getShippingPrice(),
					delivery_date: getDeliveryDate(),
					specifications: getSpecs(),
					description_text: getDescriptionText(),
					description_images: getDescriptionImages(),
					url: window.location.href,
				};
			});

			data.product_id = extractProductId(data.url);

			data.imageColumns = {};
			data.images.forEach((img, idx) => {
				data.imageColumns[`images${idx + 1}`] = img;
			});
			delete data.images;

			productData.push(data);
		} catch (err) {
			console.error(`❌ Gagal scrape ${url}:`, err.message);
		} finally {
			await releaseTab(productPage);
		}
	}

	const allImageKeys = new Set();
	productData.forEach((p) => {
		Object.keys(p.imageColumns).forEach((key) => allImageKeys.add(key));
	});

	const imageColumns = [...allImageKeys].sort((a, b) => {
		const numA = parseInt(a.replace("images", ""));
		const numB = parseInt(b.replace("images", ""));
		return numA - numB;
	});

	const csvHeader = [
		"Product ID",
		"Title",
		"Specifications",
		"Description Text",
		"Description Images",
		"SKU",
		"Colors",
		"Current Price",
		"Original Price",
		"Discount",
		"Coupon",
		"Tax Info",
		"Rating",
		"Reviews",
		"Sold",
		"Only Left",
		"Max/Buyer",
		"Available",
		"Shipping Price",
		"Delivery Date",
		"Store Name",
		"URL",
		...imageColumns,
	].join(",");

	const csvRows = productData.map((p) => {
		const baseCols = [
			p.product_id,
			p.title,
			p.specifications,
			p.description_text,
			p.description_images,
			p.sku,
			p.colors,
			p.price_current,
			p.price_original,
			p.discount,
			p.coupon,
			p.tax_info,
			p.rating,
			p.reviews,
			p.sold,
			p.only_left,
			p.max_per_buyer,
			p.available,
			p.shipping_price,
			p.delivery_date,
			p.store_name,
			p.url,
		];

		const imageCols = imageColumns.map((col) => p.imageColumns[col] || "N/A");
		return [...baseCols, ...imageCols].map((v) => `"${(v || "N/A").replace(/"/g, '""')}"`).join(",");
	});

	const outputPath = path.join(__dirname, `aliexpress_${keyword}_page${maxPage}.csv`);
	fs.writeFileSync(outputPath, csvHeader + "\n" + csvRows.join("\n"), "utf8");
	console.log(`✅ Data berhasil disimpan di: ${outputPath}`);

	await browser.close();
})();

// Fungsi scroll otomatis
async function autoScroll(page) {
	await page.evaluate(async () => {
		await new Promise((resolve) => {
			let totalHeight = 0;
			const distance = 500;
			const timer = setInterval(() => {
				window.scrollBy(0, distance);
				totalHeight += distance;
				if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
					clearInterval(timer);
					resolve();
				}
			}, 300);
		});
	});
}

// Fungsi klik pagination dan kumpulkan URL produk
async function scrapePages(page, maxPage) {
	const allUrls = new Set();

	for (let currentPage = 1; currentPage <= maxPage; currentPage++) {
		console.log(`📄 Halaman ${currentPage}...`);
		await autoScroll(page);
		await page.waitForSelector("a[href*='/item/']", { timeout: 10000 }).catch(() => console.warn("⚠️ Produk tidak ditemukan"));

		const urls = await page.evaluate(() => {
			return Array.from(document.querySelectorAll("a[href*='/item/']"))
				.map((a) => (a.href.startsWith("http") ? a.href : "https:" + a.getAttribute("href")))
				.filter((href) => href.includes("/item/"));
		});

		urls.forEach((url) => allUrls.add(url));

		// Klik pagination jika belum halaman terakhir
		if (currentPage < maxPage) {
			await page.evaluate((nextPage) => {
				const pages = Array.from(document.querySelectorAll("li.comet-pagination-item"));
				const target = pages.find((el) => el.textContent.trim() == nextPage.toString());
				if (target) target.click();
			}, currentPage + 1);

			await new Promise((r) => setTimeout(r, 5000)); // Tunggu efek klik 5 detik
		}
	}
	return [...allUrls];
}

// Ekstrak ID produk dari URL
function extractProductId(url) {
	const match = url.match(/\/item\/(\d+)\.html/);
	return match ? match[1] : "N/A";
}

// Fungsi untuk menangani CAPTCHA
async function handleCaptcha(page) {
	const captchaFrame = await page.$('iframe[src*="recaptcha"]');
	if (captchaFrame) {
		console.log("CAPTCHA terdeteksi!");

		const frames = page.frames();
		const recaptchaFrame = frames.find((frame) => frame.url().includes("recaptcha"));

		if (recaptchaFrame) {
			const checkbox = await recaptchaFrame.$("#recaptcha-anchor");
			if (checkbox) {
				await checkbox.click();
				console.log("Simulasi klik pada checkbox berhasil.");

				// Tunggu hingga CAPTCHA selesai diverifikasi
				await page.waitForFunction(
					() => {
						const iframe = document.querySelector('iframe[src*="recaptcha"]');
						if (!iframe) return true; // CAPTCHA selesai jika iframe hilang
						return false;
					},
					{ timeout: 60000 }
				);
				console.log("CAPTCHA berhasil diselesaikan.");
			} else {
				console.log("Checkbox tidak ditemukan.");
			}
		}
	}
}
