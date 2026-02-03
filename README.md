# 🛡️ Everseal - Secure Product Authentication System

**Everseal** is a high-security anti-counterfeiting solution that leverages NFC technology and AES-CMAC cryptography to verify product authenticity in real-time. It features a Next.js consumer interface, a NestJS secure backend, and a real-time Admin Dashboard for monitoring threats.

![Dashboard Preview](https://via.placeholder.com/800x400.png?text=Everseal+Admin+Dashboard+Preview)

## 🚀 Technology Stack

-   **Frontend**: Next.js 14, Tailwind CSS, Recharts, Lucide React
-   **Backend**: NestJS, Passport (JWT), Aes-Cmac (Cryptography)
-   **Database**: PostgreSQL (Dockerized) *[Currently running in Mock Mode for easy demo]*
-   **Security**: AES-128 CMAC (RFC 4493), Anti-Replay Counter Mechanism

---

## 🛠️ Getting Started

Follow these steps to run the Everseal system locally.

### Prerequisites
-   Node.js (v18+)
-   Docker (Optional, for real database)

### 1. Start the Backend (API & Verifier)
The backend runs on port `4000`.

```bash
cd backend
npm install
npm run start:dev
```
*Wait for: "Nest application successfully started"*

### 2. Start the Frontend (Consumer Client & Admin Panel)
The frontend runs on port `3000`.

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 How to Demo

### Scenario A: Consumer Verification
1.  Navigate to the **Landing Page** at [http://localhost:3000](http://localhost:3000).
2.  Click **"Scan Valid Tag"** (Simulates tapping a genuine NFC chip).
3.  You will see a **Green "Verified" Screen** with product details and blockchain transaction hash.
4.  Click **"Scan Replay Attack"** to simulate a copied URL -> You will see a **Red "Warning" Screen**.

### Scenario B: Admin Dashboard & Real-time Monitoring
1.  Login to the Admin Dashboard at [http://localhost:3000/auth/login](http://localhost:3000/auth/login).
    -   **Email**: `admin@everseal.com`
    -   **Password**: `password123` *(or click "Tap to Auto-fill")*
2.  You will see the **Dashboard**:
    -   **Live Stats**: Total scans, success rate.
    -   **Real-time Chart**: Visualizes traffic (Valid vs Threats).
    -   **Live Logs**: Updates instantly when new scans happen.
3.  **Try it out**: Keep the Dashboard open, go back to the Landing Page in another tab, and scan a tag. Watch the Dashboard update automatically!

### Scenario C: Minting New Tags
1.  In the Dashboard, look for the **"Generate Valid Test Tag"** card.
2.  Click **"Mint New URL"**.
3.  The system acts as a "Factory", generating a fresh Counter + AES-CMAC Signature.
4.  Click **"Open Link"** to verify your newly minted tag.

---

## 🔒 Security Architecture

### 1. AES-CMAC Signature
Every NFC URL contains a `cmac` parameter. This is a cryptographic signature of the `UID` and `Counter` derived from a secret AES-128 Key stored securely on the server (and physically on the tag).
-   `GET /verify?uid={ID}&ctr={COUNT}&cmac={SIGNATURE}`

### 2. Anti-Replay Mechanism
The system tracks the `scanCount` for every tag.
-   If `ctr (URL) <= stored_ctr (DB)`: **REJECTED**.
-   This prevents attackers from simply "copy-pasting" a valid URL. Each scan must have a higher counter (which only the physical NFC chip can generate).

---

## 📂 Project Structure

```
everseal/
├── backend/                # NestJS Server
│   ├── src/verifier/       # Core Security Logic (AES-CMAC)
│   ├── src/auth/           # JWT Authentication
│   └── ...
├── frontend/               # Next.js Client
│   ├── app/verify/         # Consumer Verification Page
│   ├── app/admin/          # Secure Dashboard
│   └── ...
└── README.md
```

## 📄 License
Private Portfolio Project.
