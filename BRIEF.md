# Project Brief: Mobile First Smart Panel Energy Management App

## Project Overview
- Build a **mobile first web application** for a company that makes a smart electrical panel for homes. The panel monitors energy consumption at the breaker level and allows homeowners to view real time usage, understand electricity pricing, and control or schedule circuits remotely.
- The application should help users make smarter decisions about when and how they use electricity. It should be especially useful in quick, everyday moments when a user is checking their phone between tasks, away from home, or trying to reduce their bill without needing to understand complex energy data.
- This is not just a monitoring dashboard. It should tell a practical story:
    > Electricity is not equally expensive at all times, and homeowners can save money by understanding circuit level energy use and shifting consumption to cheaper hours.



## Core Product Story / Point of View
- The app should communicate a clear, helpful idea:
    - Some circuits consume much more power than others
    - Electricity prices change throughout the day
    - Using high demand appliances during peak pricing hours costs more
    - Users can save money by shifting usage to off peak periods
    - The smart panel makes this simple by showing usage clearly and allowing direct control of breakers

- Because this is about storytelling, the app should not just show energy metrics. It should communicate a clear narrative such as:
    > Your highest energy costs come from a few high draw circuits used during expensive hours. With visibility and scheduling, you can shift usage and reduce your bill.

- This is what makes it more than a utility control panel. It becomes an interactive data story about cost, timing, and behavior.

### Key Takeaway
> The smartest way to save on electricity is not just to use less power, but to use it at better times.



## Target Audience
- This application is intended for:
    - Homeowners with a smart electrical panel
    - EV owners
    - Energy conscious consumers
    - Home owners who have solar panels and/or home backup battery systems and want to monitor how much power they are generating or consuming
    - People who travel and want remote control of home energy use
    - Homeowners who want to reduce bills without managing complicated smart home systems



## Mobile First Context
- While this is a web app, this app should be designed around **mobile usage first**, not just a desktop app that has been scaled down.
- The user is likely:
    - Standing in their kitchen or garage
    - Away from home checking their house remotely
    - Looking quickly between tasks
    - Using one hand
    - Needing fast, glanceable information
    - Trying to take a single action quickly, like turning off a circuit or checking whether now is a good time to charge a car

### Mobile Design Implications
- Prioritize the most important information at the top
- Make actions large and thumb friendly
- Keep pages focused and uncluttered
- Use cards and stacked layouts
- Make metrics readable at a glance
- Avoid dense tables or overly complex chart interactions
- Surface the best action to take right now



## Primary User Jobs
- The app should do a few things very well:
    1. **See current energy use quickly**
    2. **Understand whether electricity is expensive right now**
    3. **Identify which circuits are using the most power**
    4. **Turn circuits on or off remotely**
    5. **Schedule circuits to run during cheaper hours**
    6. **Put the home into a low power mode when away**
    7. **Review historical energy patterns and costs**



## Main App Experience

### Home Page
- The home page should be the main mobile dashboard. It should provide a quick, actionable overview of the entire homes electrical system status.

#### Home Page Content
- Current home power consumption
- Current electricity price
- Indicator for whether current time is peak, mid peak, or off peak
- A list or grid of **circuit breaker components**
- A **power analytics** section with interactive charts and useful metrics
- Quick actions such as:
  - Turn on low power mode
  - See highest usage circuits
  - View cheapest charging times
  - Navigate to detailed circuit pages
  - Ability to add a new circuit to the list of circuits



## Core UI Component: Circuit Breaker Card
- A major part of this application should be a reusable, componentized **Circuit Breaker Card**.
- Each breaker card should display:
    - Editable circuit name
    - Circuit status: on or off
    - Current power draw
    - Small usage trend indicator
    - Category or icon if useful, such as EV charger, HVAC, kitchen, lighting
    - Tap target to navigate to the detailed circuit page

### Circuit Labels
- EV Charger
- HVAC
- Water Heater
- Kitchen Outlets
- Oven
- Dryer
- Basement Lights
- Office
- Garage
- Refrigerator

### Component Expectations
- This component should be:
    - Reusable
    - Configurable through props
    - Used throughout the app with no duplicated logic
    - Built with DRY best practices
    - Flexible enough to support different states like on, off, scheduled, high usage, warning, or offline



## Circuit Detail Page
- When a user taps a breaker card, they should go to a dedicated page for that specific circuit.
- This page should include more detailed information and controls for that breaker.

### Circuit Detail Features
- Circuit name editing
- Current status: on or off
- Real time power consumption
- Historical usage chart that can be filtered across different timeframes
- Estimated cost over time
- Schedule editor
- Manual toggle control
- Peak hour warnings
- Option to set preferred run times
- Usage summary such as:
  - daily energy use
  - weekly energy use
  - monthly cost estimate
- Notes or recommendations such as:
  - “This circuit costs significantly more during 4 PM to 8 PM”
  - “Best time to run: after 9 PM”
  - “This circuit was one of the top 3 energy consumers this week”



## Power Analytics Section
- The home page should also include a **Power Analytics** section that gives useful insight across the whole panel.
- This section should help users understand the broader story of their power consumption.

### Recommended Analytics
- Current total household power usage
- Current electricity rate
- Peak hour schedule for today
- Energy use over time
- Most power hungry circuits
- Cost over time
- Percentage of total usage by circuit
- Estimated monthly bill
- Peak vs off peak usage comparison
- Potential savings if usage shifts to cheaper hours
- if the user has solar panels, include solar generation and net metering metrics

### Recommended Charts
- **Line chart** for power consumption over time
- **Bar chart** for highest usage circuits
- **Doughnut chart** for percent of total consumption by circuit
- **Time of use chart** showing expensive vs cheap hours
- Optional small sparkline trends inside circuit cards



## Key Product Features

### 1. Real Time Monitoring
- Users can see:
    - Live power draw by circuit
    - Total household power draw
    - Circuit status

### 2. Time of Use Pricing Awareness
- The app should show:
    - What electricity costs right now
    - What the upcoming rate periods are
    - When peak pricing starts and ends
    - How current usage aligns with expensive periods

### 3. Circuit Control
- Users should be able to:
    - Turn individual breakers on or off
    - Enable or disable low power mode
    - Remotely manage high load circuits

### 4. Scheduling
- Users should be able to:
    - Set run windows for breakers
    - Choose preferred hours
    - Avoid peak pricing periods
    - Automate things like EV charging or heavy appliances

### 5. Home Modes
- Include optional home wide presets such as:
    - **Normal Mode**
    - **Low Power Mode**
    - **Vacation Mode**
    - **Night Mode**
- These modes can affect groups of circuits at once.
- include the ability to create new, custom home modes that allow the user to select groups of specific circuits to control at once



## Suggested User Flows

### Flow 1: Quick Glance
- User opens app and immediately sees:
    - Current usage
    - Current price tier
    - Top energy consuming circuits
    - Whether anything should be turned off

### Flow 2: Remote Action
- User is away from home, sees a high consumption circuit, opens that breaker, and turns it off.

### Flow 3: Schedule Optimization
- User opens EV charger circuit details and schedules charging for off peak hours.

### Flow 4: Away Mode
- User activates low power or vacation mode before traveling.



## Data Model Ideas
- Use fake data generated with **faker.js** and store it in **SQLite**.

### Example Entities

#### Circuits
- `id`
- `name`
- `category`
- `status`
- `currentWatts`
- `voltage`
- `room`
- `schedulingEnabled`

#### UsageHistory
- `id`
- `circuitId`
- `timestamp`
- `watts`
- `estimatedCost`

#### PricingPeriods
- `id`
- `startTime`
- `endTime`
- `rateType`
- `pricePerKwh`

#### Schedules
- `id`
- `circuitId`
- `dayOfWeek`
- `startTime`
- `endTime`
- `enabled`

#### Modes
- `id`
- `modeName`
- `affectedCircuits`
- `description`

- You do not need true real time data. Simulated near real time updates are perfectly fine for the assignment.



## Technology Requirements
- **Vite**
- **React with TypeScript**
- **Material UI**
- **faker.js**
- **SQLite**
- **Chart.js**
- **react-chartjs-2**
- **Express** <- use this to build the server and restAPI



## Architecture / Build Expectations
- This app should be **highly componentized** and follow **DRY principles**.

### Important Implementation Expectations
- Create custom components and reuse them wherever possible
- Keep logic modular
- Separate presentation from business logic
- Use reusable chart wrappers where appropriate
- Use shared types and interfaces
- Use composable Material UI components
- Avoid repeating layout or state logic across pages
- Build reusable hooks for fetching or transforming circuit and analytics data



## Component Structure

### Layout and Navigation
- `AppShell`
- `TopNav`
- `BottomNavigation`
- `PageContainer`

### Home Page
- `HomeDashboard`
- `SummaryCard`
- `RateStatusBanner`
- `QuickActions`
- `CircuitGrid`
- `CircuitBreakerCard`
- `PowerAnalyticsPanel`

### Circuit Details
- `CircuitDetailPage`
- `CircuitHeader`
- `CircuitUsageChart`
- `CircuitScheduleEditor`
- `CircuitToggleControl`
- `CircuitInsightsCard`

### Analytics
- `UsageOverTimeChart`
- `TopCircuitsChart`
- `ConsumptionBreakdownChart`
- `PeakHoursChart`

### Shared Utilities

- `formatEnergy`
- `formatCurrency`
- `getCurrentRatePeriod`
- `estimateCircuitCost`
- `groupUsageByTime`
- `calculateCircuitPercentages`



## Mobile UX Requirements
- This web app needs to be mobile first and must adhere to these requirements:
    - Design for narrow screens first
    - Use sticky bottom navigation if helpful
    - Ensure large tap targets
    - Make charts readable on mobile
    - Keep controls simple and lightweight
    - Prioritize glanceability and single action workflows
    - Use expandable cards or accordions for extra details
    - Minimize text density
    - Surface the most important insight at the top of the screen



## Visual Design Guidelines
- The app should feel:
    - Modern
    - Trustworthy
    - Technical but approachable
    - Useful in real life
    - Polished like a consumer energy product

- A good visual direction would be:
    - Clean white or dark surfaces
    - Accent colors for peak vs off peak pricing
    - Clear success and warning states
    - Subtle energy themed iconography
    - Card based layout with strong hierarchy



## Success Criteria
- This application is successful if:
    - The app feels clearly mobile first
    - A user can quickly understand what is happening in their home
    - The home page highlights useful, actionable insights
    - Circuit breaker cards are reusable and well componentized
    - Circuit detail pages allow meaningful control and scheduling
    - The analytics section supports the story instead of overwhelming the user
    - The codebase is modular, DRY, and clean
    - The required tech stack is used correctly



## Next Steps:
1. Read this entire brief, then stop. Don't build anything until I instruct you to.
2. Create the application scaffolding using the tech stack mentioned above and file structure. Make sure the current folder, 'capstone-303', is the root for this app. Do not generate any data yet.
3. Install the additional dependencies and libraries that will be necessary to build this application. Do not generate any data yet.
4. STOP. Do not continue until instructed to do so.
5. Build the basic UI using placeholders for everything, do not use any data. Just use containers with labels for where different UI elements will go so I can approve the overall composition before going further. Utilize custom components and reuse them as much as possible because we will leverage these and change them in the future.
6. Start building necessary API routes including but not limited to GET and POST routes for fetching data related to the breakers and power usage, adding new breakers, creating a new schedule, etc.
7. STOP. Do not continue until instructed to do so.
8. Use faker.js to generate realistic fake data for circuits, historical usage, pricing periods, and schedules. Store the data in SQLite. 
9. STOP. Do not continue until instructed to do so.
10. When a user taps a circuit breaker card, they should go to a circuit detail page that shows detailed historical usage, estimated costs, a schedule editor, manual on/off controls, and the ability to rename the circuit. Users should be able to schedule a circuit to run only during selected times in order to avoid peak electricity pricing. If more API routes are needed to support this functionality, build them.
11. STOP. Do not continue until instructed to do so.
12. The power analytics section on the home page should include charts and metrics such as:
    - Household power use over time
    - Highest usage circuits
    - Percent of total consumption by circuit
    - Current and upcoming peak pricing windows
    - Estimated cost trends
    - Potential savings from shifting usage to off peak hours