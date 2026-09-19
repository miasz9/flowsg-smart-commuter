# flowsg-smart-commuter
A smart commuter companion that recommends routes based on disruptions, crowding and rewards.

# FlowSG

FlowSG is a smart commuter application designed to help commuters in Singapore make more informed travel decisions.

Instead of recommending routes based only on travel time, FlowSG allows users to compare routes based on factors such as **crowding, travel time, accessibility, and sheltered travel**.

The default route preference is **Least Crowded**, with the aim of helping commuters discover suitable alternatives to congested routes.

FlowSG also includes personalised travel updates and a prototype reward system that encourages commuters to consider eligible alternative routes.

---

## Setting Up the Project

### 1. Clone the Repository

```bash
git clone https://github.com/miasz9/flowsg-smart-commuter.git
```

### 2. Navigate to the Frontend Folder

```bash
cd flowsg-smart-commuter/frontend
```

### 3. Install Dependencies

Ensure that Node.js and npm are installed.

Then run:

```bash
npm install
```

### 4. Environment Variables

If API credentials are required, create a `.env.local` file in the `frontend` folder.

For example:

```bash
LTA_ACCOUNT_KEY=your_api_key
```

Do not commit API keys or the `.env.local` file to GitHub.

---

## Running the App

1. Open the project in VS Code.

2. Open a new terminal.

3. Ensure that the terminal is inside the `frontend` folder.

4. Run:

```bash
npm run dev
```

5. Open the local URL displayed in the terminal.

For a Vite development server, this is typically:

```text
http://localhost:5173
```

---

## Using FlowSG

### Home

The Home screen provides commuters with:

- Personalised travel updates
- Destination search
- Saved destinations
- Map and journey information
- Access to Routes, Rewards, and Me

Travel alerts are designed to show information that is relevant to the commuter instead of displaying only general transport announcements.

---

### Routes

After selecting a destination, users can compare available routes.

Routes can be sorted according to the following preferences:

- **Least Crowded** — default
- Fastest
- Most Accessible
- Most Sheltered

Each route can display information such as:

- Estimated travel time
- Crowding level
- Route information
- Reward points

Users can select a route to begin their journey.

---

### Active Journey

After selecting a route, FlowSG displays the selected journey and its relevant information.

This includes:

- Selected route
- Estimated journey time
- Crowding level
- Available reward points

Users can complete the journey to simulate receiving the associated reward points.

---

### Rewards

FlowSG includes a prototype reward system that encourages commuters to consider suitable alternative routes.

Eligible routes may offer additional points.

For example:

```text
Usual Route
42 min
High crowding
0 points

Alternative Route
46 min
Low crowding
+20 points
```

After completing an eligible journey, the points are added to the user's reward balance.

Reward values in the current prototype are simulated for demonstration purposes.

---

### Me / Settings

The Me page allows users to manage their journey preferences.

Users can select their default route preference from:

```text
Least Crowded
Fastest
Most Accessible
Most Sheltered
```

The default setting is:

```text
Least Crowded
```

Changing this preference affects how routes are sorted and recommended to the user.

The page also contains settings for saved locations and account-related options.

---

## Application Flow

The main FlowSG user journey is:

```text
Welcome to FlowSG
        ↓
Create an account
        ↓
Connect SimplyGo
(if an approved integration is available)
        ↓
Set home and common destinations
        ↓
Select journey preferences
        ↓
Home
        ↓
Search / Select destination
        ↓
Compare routes
        ↓
Select route
        ↓
Active journey
        ↓
Complete journey
        ↓
Receive reward points
```

The main application navigation contains:

```text
Home | Routes | Rewards | Me
```

---

## Route Preferences

FlowSG allows route recommendations to reflect different commuter priorities.

### Least Crowded

Prioritises routes with lower estimated crowding.

This is the default preference.

### Fastest

Prioritises routes with the lowest estimated travel time.

### Most Accessible

Prioritises routes with better accessibility characteristics.

### Most Sheltered

Prioritises routes with greater sheltered travel where relevant information is available.

---

## Technologies Used

- React
- JavaScript
- CSS
- Node.js
- npm
- Vite
- Leaflet

---

## Data Sources

FlowSG is designed to support transport and contextual information from sources including:

### LTA DataMall

Potential transport information includes:

- Train service alerts
- Real-time station crowd density
- Forecast station crowd density
- Bus arrival information
- Bus occupancy information
- Public transport network information
- Facilities maintenance information

### OneMap

OneMap can be used for location and routing functionality.

### data.gov.sg

Weather information can be used to support future weather-aware and sheltered-route recommendations.

---

## Prototype Assumptions

FlowSG is currently a hackathon prototype.

Some information used in the application may be simulated, including:

- Routes
- Journey times
- Crowding levels
- Accessibility information
- Sheltered-route information
- Reward points

Simulated information is used to demonstrate the intended user experience when live data is unavailable or has not yet been integrated.

The reward system is also a prototype and does not represent an official LTA or SimplyGo rewards programme.

---

## Important Notes

- FlowSG is a prototype and should not be treated as an official journey-planning service.
- Route recommendations may contain simulated information.
- Reward points are illustrative.
- Live transport conditions may change after a recommendation is generated.
- SimplyGo connectivity should only be implemented if an approved integration is available.
- API credentials must not be committed to the GitHub repository.
- API keys should be stored using environment variables such as `.env.local`.

---

## Future Improvements

Future versions of FlowSG could include:

- Live LTA DataMall integration
- Live OneMap routing
- Real-time crowding information
- Forecast crowding information
- Live disruption alerts
- Weather-aware route recommendations
- Accessibility-aware routing
- Sheltered walking recommendations
- Dynamic reward points
- User authentication
- Persistent user preferences
- Journey history
- Push notifications
- Approved SimplyGo integration

---

## Project Goal

FlowSG explores how public transport journey planning can move beyond simply asking:

> What is the fastest route?

and instead help commuters answer:

> What route best suits my needs right now?

By combining personalised route preferences, transport conditions, alternative journeys, and incentives, FlowSG aims to provide commuters with clearer and more useful travel choices.
