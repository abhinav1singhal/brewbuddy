# ☕️ BrewBuddy — Multi-Agent Coffee & Bakery Shop Automation with Google ADK

**BrewBuddy** is a smart, multi-agent system built using the **Google Agent Development Kit (ADK)** and **Modular Code Protocol (MCP)** to automate real-world operations in a coffee + bakery shop. From handling walk-in orders to tracking muffin freshness, BrewBuddy agents collaborate to streamline the entire customer experience.

> 🏆 Built for [Hackathon Name], showcasing the power of Google’s ecosystem in solving real-life retail challenges.

---

## 🚀 Features

✅ In-store kiosk ordering (touch + voice)  
✅ Real-time order prep & pickup coordination  
✅ Smart bakery inventory with freshness tracking  
✅ Dynamic recommendations & loyalty rewards  
✅ Analytics dashboard powered by BigQuery  
✅ Modular, multi-agent architecture using ADK + MCP

---

## 🧱 Agent Architecture

| Agent Name     | Role                                                  |
|----------------|-------------------------------------------------------|
| `OrderAgent`    | Handles all order intake (web, kiosk, voice)         |
| `PrepAgent`     | Assigns barista & bakery tasks, updates order status |
| `InventoryAgent`| Tracks ingredient & supply stock                     |
| `BakeryAgent`   | Manages bakery inventory & freshness alerts          |
| `KioskAgent`    | UI + voice for in-store ordering                     |
| `CustomerAgent` | Notifies customers with QR-based order tracking      |
| `FeedbackAgent` | Gathers reviews, summarizes insights                 |
| `LoyaltyAgent`  | Tracks purchases & awards points                     |
| `AnalyticsAgent`| Tracks KPIs like sales, spoilage, queue length       |

---

## 🖥️ Tech Stack

| Layer       | Tooling                                   |
|-------------|--------------------------------------------|
| Agents      | Google ADK (Python) + MCP (Pub/Sub topics) |
| Frontend UI | Flutter Web (Kiosk) + Firebase Hosting     |
| Backend     | FastAPI + Google Cloud Run                 |
| Voice       | Gemini + Dialogflow                        |
| Storage     | Firestore, Google Sheets                   |
| Analytics   | BigQuery + Looker Studio                   |
| Messaging   | Firebase Cloud Messaging (FCM)             |

---

## 📦 Project Structure

---

## 🧪 Example Flow: In-Person Bakery Order

1. Customer walks in and uses touchscreen kiosk.
2. `KioskAgent` accepts the order (or voice input).
3. `OrderAgent` processes and checks availability.
4. `BakeryAgent` checks freshness and flags discounts if needed.
5. `PrepAgent` schedules baking and alerts staff.
6. `CustomerAgent` displays order status with QR tracking.
7. `LoyaltyAgent` awards points for combos.
8. `FeedbackAgent` prompts for post-order rating.

---

## 🧠 Why This Project?

- ✅ Real-world relevance
- 🔁 Demonstrates agent-to-agent coordination
- 📊 Uses full spectrum of Google Cloud capabilities
- 🔧 Built with modularity (MCP + ADK)
- 🔍 Hackathon-ready + expandable

---

## 🛠️ Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/your-handle/brewbuddy.git
   cd brewbuddy

│ ├── bakery_inventory_sheet.json
│ └── bigquery_config.json
│
└── README.md


