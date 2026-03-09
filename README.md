# Brain Dump & Sort

A simple and effective app to clear your mind and organize your thoughts into actionable steps.

## Features
- **Brain Dump**: Write down everything on your mind.
- **Sort Thoughts**: Categorize thoughts into Action, Later, or Let Go.
- **Action Plan**: Focus on the next small step for your action items.
- **Reflection**: A space to reflect on your current state of mind.
- **Internationalization**: Support for 20+ languages.

## Tech Stack
- **Vite**
- **TypeScript**
- **React**
- **shadcn-ui**
- **Tailwind CSS**
- **i18next** (for internationalization)

## Getting Started

### Prerequisites
- Node.js & npm installed

### Installation
1. Clone the repository
   ```sh
   git clone https://github.com/adikh276-arch/brain-dump-and-sort
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Run the development server
   ```sh
   npm run dev
   ```

## Docker Deployment

Build the Docker image:
```sh
docker build -t brain-dump-and-sort .
```

Run the container:
```sh
docker run -p 80:80 brain-dump-and-sort
```
