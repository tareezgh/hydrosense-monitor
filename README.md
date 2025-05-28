# HydroSense Monitor

A responsive dashboard for visualizing hydroponic sensor data (pH, temperature, EC) with alert classification, charts, and tests.


### Features:

- Ingests real-time-like sensor readings (pH, temperature, EC)

- Flags alerts using rule-based classification

- Visualizes readings with table and interactive charts

- Highlights abnormal readings with tooltips and summaries

- Random call results renders with popup


### Tech Stack

- **Frontend**: React, TypeScript, Vite, Chart.js, Tailwind CSS

- **Backend**: Python, FastAPI

- **Testing**: Pytest, React Testing Library, Jest

- **CI/CD**: GitHub Actions

## Getting Started

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/tareezgh/hydrosense-monitor.git
cd hydrosense-monitor
```
## Setup & Run Instructions

### Backend

#### CLI

1. **Install dependencies**  
   Navigate to the `backend` directory and install Python dependencies:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Run the backend server**  
   ```bash
   ./run.sh
   ```
   This starts a FastAPI server on port 8000.


---

### Frontend

#### CLI

1. **Install dependencies**  
   Navigate to the `frontend` directory and run:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**  
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).


###
---

## Design Decisions & Rule Thresholds

- **Backend API**: Built with FastAPI for rapid development and async support.
- **Frontend**: Built with React, TypeScript, and Vite.
- **CORS**: The backend allows requests from `http://localhost:5173` for local development.
- **In-memory Storage**: Alerts are stored in-memory (not persistent).
- **User Input & Random Behavior**: If the unit ID input is empty, the system automatically generates a random unitId (e.g., unit-123) for testing, a popup appears to show the classification result and reading details.

- **Rule Thresholds**:
  - **pH Classification**:  
    - If `pH < 5.5` or `pH > 7.0` → `"Needs Attention"`
    - Otherwise → `"Healthy"`
  - These thresholds are defined in `backend/app/api/sensor.py`.

---

## Open-ended Enhancement

To make the dashboard more insightful for growers, I implemented a SensorLineChart component to visualize recent pH, temperature, and EC readings. It:

Highlights abnormal values visually

Includes tooltips for easy context

Helps detect trends and make better decisions


You can find the implementation in `frontend/src/components/SensorLineChart.tsx`

- Renders a responsive line chart using Chart.js
- Highlights out-of-range pH readings (e.g., <5.5 or >7)
- Adds timeline dots with tooltips for each reading
- Shows a summary message based on recent classifications


##  Production-Critical Test Cases

These are real-world edge cases that could break the app if not handled properly:

1. **Malformed JSON Input**
   - Description: If the API receives malformed JSON, it should return a 422 Unprocessable Entity with a clear error message and not crash the server. For example: sending a plain string instead of a JSON object.

2. **Extreme Sensor Values**
   - Sensor readings that fall far outside realistic ranges should be validated and either rejected or flagged. For example: pH = 50 or temp = -300°C should be rejected 

Implemented test: Malformed JSON Input in `test_sensor_api.py`


## Automated Tests

### Backend (Python + Pytest)

- `test_sensor_api.py` covers payload validation, classification logic, and edge cases.

To run the backend tests:

```bash
cd backend
source venv/bin/activate  # or `.\venv\Scripts\activate` on Windows
PYTHONPATH=. pytest -v

```
Tests include:

 - Input validation

 - Classification logic (Healthy vs Needs Attention)

 - Alert storage and retrieval

 - Edge case handling (e.g. malformed JSON)


### Frontend (Jest + React Testing Library)


To run the frontend tests:

```bash
cd frontend
npm test
```
Tests cover:

 - Alert Table Component rendering

 - Color styling based on classification

 - Fetch Alerts flow

 - Send Random Reading behavior

 - Chart rendering and enhancement behavior

[▶️ Watch demo video](https://drive.google.com/file/d/1_aTMvt_TSjCy3bKhukdehpO8xHWybZSG/view?usp=drive_link)