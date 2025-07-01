# WashFlow Test App

A simple React app for testing car wash controller functionality.

### Prerequisites

- Node.js (version 18 or higher)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

Copy the example environment file and configure your API URL:

```bash
cp .env.example .env
```

Edit `.env` file and set your API base URL:

```env
VITE_API_BASE_URL=http://*your_ip*:5000
```

If `VITE_API_BASE_URL` is not set, the application will use `${window.location.protocol}//${window.location.hostname}:5000` as the default API URL.

Build the project:

```bash
npm run build
```

Copy cleantrak_washflowtest.service to /etc/systemd/system/ and reload daemon:

```bash
sudo cp ~/WashFlowTestApp/cleantrak_washflowtest.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start cleantrak_washflowtest
sudo systemctl enable cleantrak_washflowtest
```


### Project Structure

```
WashFlowTestApp/
├── src/
│   ├── components/          # UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── App.tsx             # Main component
│   └── main.tsx            # Entry point
├── public/                 # Static files
├── package.json            # Dependencies and scripts
└── README.md              # Documentation
```
