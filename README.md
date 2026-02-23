

# 🛡️ Website Safety Signal

A lightweight Chrome Extension that instantly analyzes websites and shows a **privacy risk signal (🟢 Safe / 🟡 Moderate / 🔴 Risky)** based on third-party trackers and cookies.

---

## 🚀 Overview

**Website Safety Signal** automatically scans any webpage you visit and provides a real-time visual privacy indicator.

Instead of manually checking developer tools or privacy policies, users get a quick safety signal displayed as a toast notification.

The extension runs fully on the client side — no external servers, no data collection.

---

## ❓ Problem Statement

Most users:

* Don’t know how many trackers a website loads
* Are unaware of how many cookies are being stored
* Cannot easily judge privacy risk

Existing privacy tools are often:

* Complex
* Heavy
* Overwhelming for non-technical users

---

## ✅ Solution

This extension:

* Detects third-party trackers
* Counts website cookies
* Classifies privacy exposure level
* Displays a simple color-coded signal

All in real-time, automatically.

---

## 🏗️ Architecture

```
User visits website
        ↓
Background Service Worker detects page load
        ↓
Script injected into webpage
        ↓
Resource analysis performed
        ↓
Third-party trackers counted
        ↓
Cookies counted
        ↓
Risk classified
        ↓
Toast notification displayed
```

---

## ⚙️ How It Works

### 1️⃣ Page Load Detection

The extension listens for:

* Tab updates
* Tab switches

When detected, it injects a script into the active page.

---

### 2️⃣ Tracker Detection

Uses:

```js
performance.getEntriesByType("resource")
```

* Collects all loaded resources (scripts, images, etc.)
* Compares their domains with the current site domain
* Counts third-party domains

---

### 3️⃣ Cookie Counting

```js
document.cookie
```

Counts accessible cookies stored by the site.

---

### 4️⃣ Risk Classification Logic

| Trackers | Risk Level  |
| -------- | ----------- |
| 0–3      | 🟢 Safe     |
| 4–9      | 🟡 Moderate |
| 10+      | 🔴 Risky    |

---

### 5️⃣ Toast UI Injection

A styled notification is injected at the top-right corner showing:

* Risk status
* Cookie count
* Tracker count

Auto-dismisses after 3 seconds.

---

## 🛠️ Tech Stack

| Component          | Technology            |
| ------------------ | --------------------- |
| Extension Platform | Chrome Manifest v3    |
| Background Engine  | Service Worker        |
| Script Injection   | chrome.scripting API  |
| Resource Analysis  | Performance API       |
| UI                 | Dynamic DOM injection |

---

## 📂 Project Structure

```
website-safety-signal/
│
├── manifest.json
├── background.js
├── popup.html
└── README.md
```

---

## 🔐 Permissions Used

* `tabs` → Detect tab changes
* `scripting` → Inject analysis script
* `cookies` → Access cookie information
* `storage` → Reserved for future enhancements
* `<all_urls>` → Analyze all websites

---

## 🎯 Use Cases

* Privacy-conscious users
* Developers analyzing third-party scripts
* Students learning browser security
* Cybersecurity enthusiasts

---

## 🔮 Future Enhancements

* Tracker reputation database integration
* Privacy score (0–100 system)
* Phishing detection
* Company-level tracker breakdown
* Detailed popup analytics dashboard
* Dark mode UI
* Historical tracking report

---

## 🧪 How to Install (Developer Mode)

1. Clone the repository
2. Open Chrome
3. Go to `chrome://extensions/`
4. Enable **Developer Mode**
5. Click **Load Unpacked**
6. Select the project folder
7. Start browsing — the safety signal will appear automatically

---

## 📌 Limitations

* Cannot access HttpOnly cookies
* Basic tracker detection (domain-based heuristic)
* Does not block trackers — only analyzes

---

## 🧑‍💻 Author

**Sanjay**
Computer Science Student 
