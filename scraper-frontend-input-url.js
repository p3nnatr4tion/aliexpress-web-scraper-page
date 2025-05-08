import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

puppeteer.use(StealthPlugin());

// Ambil URL produk dari command line
const productUrl = process.argv[2];

if (!productUrl) {
	console.error("URL produk diperlukan.");
	process.exit(1);
}

console.log(`Scraping URL produk: ${productUrl}`);

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
		defaultViewport: null,
		args: ["--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
	});

	const page = await browser.newPage();

	page.setDefaultTimeout(120000);
	page.setDefaultNavigationTimeout(120000);

	await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36");
	await page.setViewport({ width: 1366, height: 768 });
	await page.setExtraHTTPHeaders({
		"accept-language": "en-US,en;q=0.9",
	});

	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, "webdriver", { get: () => false });
	});

	try {
		await page.goto(productUrl, { waitUntil: "networkidle2", timeout: 120000 });
		await handleCaptcha(page);

		const productData = await page.evaluate(() => {
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

		productData.product_id = extractProductId(productData.url);

		productData.imageColumns = {};
		productData.images.forEach((img, idx) => {
			productData.imageColumns[`images${idx + 1}`] = img;
		});
		delete productData.images;

		const allImageKeys = Object.keys(productData.imageColumns);

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
			...allImageKeys,
		].join(",");

		const csvRow = [
			productData.product_id,
			productData.title,
			productData.specifications,
			productData.description_text,
			productData.description_images,
			productData.sku,
			productData.colors,
			productData.price_current,
			productData.price_original,
			productData.discount,
			productData.coupon,
			productData.tax_info,
			productData.rating,
			productData.reviews,
			productData.sold,
			productData.only_left,
			productData.max_per_buyer,
			productData.available,
			productData.shipping_price,
			productData.delivery_date,
			productData.store_name,
			productData.url,
			...allImageKeys.map((key) => productData.imageColumns[key] || "N/A"),
		]
			.map((v) => `"${(v || "N/A").replace(/"/g, '""')}"`)
			.join(",");

		const today = new Date().toISOString().split("T")[0];
		const outputPath = path.join(__dirname, `aliexpress_${today}.csv`);

		let fileContent = "";
		if (fs.existsSync(outputPath)) {
			fileContent = fs.readFileSync(outputPath, "utf8");
		}

		if (!fileContent.includes(csvHeader)) {
			fs.appendFileSync(outputPath, csvHeader + "\n", "utf8");
		}

		fs.appendFileSync(outputPath, csvRow + "\n", "utf8");
		console.log(`✅ Data berhasil disimpan di: ${outputPath}`);
	} catch (err) {
		console.error("Gagal scrape URL produk:", err.message);
	} finally {
		await browser.close();
	}
})();

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
