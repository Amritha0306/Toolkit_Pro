# ToolKit Pro — Built for Digital Heroes

A comprehensive, responsive, single-page web toolkit hosting 9 powerful tools designed with modern aesthetics (glassmorphism, interactive animations, and dark mode). Built entirely using vanilla HTML5, CSS3, and JavaScript.

## 🔗 Live Demo & Links
- **Live Deployment URL:** *(https://toolkit-pro-gilt.vercel.app/)]*
---

## 🛠️ Mandatory Requirements Checklist
- [x] **Fully Functional Tools:** Every single tool works client-side and produces correct outputs.
- [x] **"Built for Digital Heroes" Button:** Prominently featured in the header and footer, matching the exact spelling and casing, linking directly to [https://digitalheroesco.com](https://digitalheroesco.com).
- [x] **Contact Visibility:** Author's full name (**Amritha**) and reachable email (**amritharameshkanchan317@gmail.com**) are clearly displayed on the page.
- [x] **Vercel Live URL:** Configured with `vercel.json` for seamless deployment.
- [x] **Public GitHub Repo Link:** Clean commit history.
- [x] **Portfolio Integration:** Structured metadata and layout ready to be featured in your personal portfolio.

---

## ⚡ The 9 Included Tools

1. **🧾 GST Calculator**
   - Add (Exclusive) or remove (Inclusive) GST.
   - Choose standard rates (5%, 12%, 18%, 28%) or enter a custom percentage.
   - Outputs clear breakdown of Pre-GST, CGST, SGST, Total GST, and Grand Total.

2. **🏦 EMI / Loan Calculator**
   - Enter Loan Amount, Annual Interest Rate, and Tenure in Months.
   - Instantly calculates Monthly EMI, Total Principal, Total Interest Payable, and Grand Total Payment.

3. **🖼️ Image Compressor**
   - Drag-and-drop or select JPG, PNG, and WebP files.
   - Adjust target quality percentage dynamically.
   - Provides side-by-side original/compressed preview, size calculations (and percentage saved), and a single-click download.

4. **📱 QR Code Generator**
   - Generate custom high-resolution QR codes from any text or URL.
   - Customize foreground and background colors.
   - Select size options and download the generated code as a PNG.

5. **💱 Currency Converter**
   - Fast conversions between 13 major currencies (INR, USD, EUR, GBP, JPY, AED, SGD, CAD, AUD, CHF, CNY, SAR, MYR).
   - Base rates defined on INR.
   - Displays target amount, current exchange rate, and inverse rate.

6. **🍽️ Split the Bill**
   - Split a dining or general expense bill among any number of people.
   - Apply tip percentage and discounts.
   - Shows total bill, discount applied, tip addition, grand total, and exact share per person.

7. **🎂 Age Calculator**
   - Calculate your precise age in Years, Months, and Days relative to a specific target date.
   - Shows additional statistics: total days lived, weeks, months, and hours.
   - Tells you exactly how many days remain until your next birthday.

8. **📝 Word & Character Counter**
   - Live word, character (with and without spaces), sentence, and paragraph counts as you type.
   - Calculates estimated reading time (based on average 200 WPM).

9. **🎨 Color Palette Generator**
   - Select any base color.
   - Generate palettes based on color theory relationships: Analogous, Complementary, Triadic, Tetradic, or Monochromatic Shades.
   - Click any swatch to instantly copy its HEX code to your clipboard with a confirmation toast.

---

## 🎨 Design & Aesthetics
- **Core Theme:** Sophisticated dark mode base (`#07080f`) with glassmorphism overlays and vibrant neon gradients (indigo, violet, cyan).
- **Typography:** Sleek Inter typography with strong weight hierarchy.
- **Interactions:** Subtle hover lifts on interactive toolcards, scale transitions, custom focus outlines, and smooth scrolling.
- **Responsive Layout:** Adapts dynamically to desktop (3x3 grid), tablet (2-column grid), and mobile screens (2-column compact grid).

---

## 📂 Project Structure
```bash
Digital_heores/
├── index.html   # Main structural page containing the home grid and all tool panels
├── style.css    # Comprehensive dark mode design system, layout grid, and mobile optimization
├── app.js       # Complete client-side application logic for all 9 tools
├── vercel.json  # Deployment configuration for Vercel static hosting
└── README.md    # Documentation of requirements, features, and setup instructions
```

---

## 🚀 How to Setup & Deploy

### 1. Local Run
To preview locally, start a simple HTTP server in the repository directory:
```bash
# Using Python 3
python -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

### 2. Git Setup
Ensure your local changes are committed:
```bash
git init
git add .
git commit -m "Initial commit: Complete 9-tool suite for Digital Heroes"
```

### 3. Deploy to Vercel
1. Push your repository to your public GitHub account.
2. Sign in to [Vercel](https://vercel.com).
3. Click **Add New** > **Project** and import your public repository.
4. Leave all build settings default (Vercel automatically detects static HTML/CSS/JS and applies the `vercel.json` config).
5. Click **Deploy**.
6. Copy the generated deployment URL and update this README.md!
