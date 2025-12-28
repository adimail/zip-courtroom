# zip-courtroom

Next.js dashboard tracking ["Zip"](https://www.linkedin.com/games/zip/) puzzle times. Fetches data from Google Sheets and includes a playable client-side clone of the game. Built as a casual, friendly app for a small group of friends to enjoy some healthy competition.

## Preview

|                   **Courtroom Dashboard**                    |
| :----------------------------------------------------------: |
|        ![Main Dashboard](./public/screenshots/1.jpeg)        |
| _Landing page with daily verdict and historical match list._ |

|                   **Statistics & Analytics**                   |
| :------------------------------------------------------------: |
|        ![Stats Dashboard](./public/screenshots/2.jpeg)         |
| _Statistics page with win rates, response times, and streaks._ |

|                                        **The Zip Game**                                         |
| :---------------------------------------------------------------------------------------------: |
|                         ![Game Interface](./public/screenshots/3.jpeg)                          |
| _Fully playable client-side clone of the [linkedin game](https://www.linkedin.com/games/zip/)._ |

## Environment Variables

Create a `.env.local` file. You need a Google Cloud Service Account with `spreadsheets.readonly` scope.

```bash
GOOGLE_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

_Note: The [Spreadsheet](https://docs.google.com/spreadsheets/d/1YQ2xoLyN4pXqhuicquJZGWbV6x7wy8vqeCQ5FT05g_0) ID is hardcoded in `app/api/matches/route.ts`._

## Running Locally

1.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    ```

2.  **Run development server:**

    ```bash
    npm run dev
    ```

3.  **Open:** `http://localhost:3000`

## Key Directories

- `app/api/`: Server-side logic for fetching Google Sheets data.
- `app/game/`: The playable Zip game logic.
- `app/stats/`: Statistics dashboard.
- `modules/game/`: Game engine (Hamiltonian path generator, solver, serializer).
- `lib/courtroom.ts`: Data processing, verdict logic, and deterministic quote generation.
