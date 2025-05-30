🧍‍♂️ Customer Frontend – Voice-First Order Flow
🔧 Purpose:
Provide a seamless, multilingual voice interface for walk-in or kiosk-based customers to:

Place orders for coffee or bakery items

Track their order in real time

Receive uplifting messages when the order is ready

📱 Features

| Feature                   | Description                                       |
| ------------------------- | ------------------------------------------------- |
| **Voice Order Interface** | Web Speech API (supports English, Hindi, Korean)  |
| **Menu-Free Flow**        | No visual menu — system interprets voice directly |
| **QR Code Generator**     | After placing order, user gets order ID as QR     |
| **Order Status Tracking** | Real-time order updates via Firestore listener    |
| **Pickup Notification**   | “Your coffee is ready ☀️” screen (multi-language) |

🖼️ UI Flow

/                     → Language selection & “Start Order”
/order                → Voice capture screen
/order/confirmation   → Order summary + QR Code
/track/:orderId       → Order status live page
/order/ready          → Uplifting pickup message (optional)

🔌 Backend Integration
| Frontend Action    | Backend Endpoint                                       |
| ------------------ | ------------------------------------------------------ |
| Send voice input   | `POST /api/order`                                      |
| Poll order status  | `GET /api/order/:id/status` or Firestore stream        |
| Get pickup message | `GET /api/order/:id/message` or subscribe to Firestore |

Data Payload from FE to BE
{
  "voiceInput": "One cappuccino and a blueberry muffin",
  "language": "en-US"
}


2. 👨‍🍳 Shop Owner Frontend – Order & Trend Management
🔧 Purpose:
Provide the baristas / manager with an operational dashboard to:

View incoming orders in real time

Update status (preparing → ready)

Review trends (best-sellers, slow days)

Improve workflow and customer service
