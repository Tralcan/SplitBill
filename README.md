# Split it Right

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Environment Setup

This application uses the Google Gemini API for AI features. You will need an API key to run it.

### Local Development

1.  **Get an API Key**: Obtain your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
2.  **Create an environment file**: Copy the `.env.example` file to a new file named `.env` in the root of the project.
    ```bash
    cp .env.example .env
    ```
3.  **Set the API Key**: Open the new `.env` file and replace `YOUR_API_KEY_HERE` with your actual Google API key.

    ```
    # .env
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

The `.env` file is ignored by Git, so your key will not be committed.

### Deployment (e.g., on Vercel)

When you deploy your application, you will need to set the `GOOGLE_API_KEY` as an environment variable in your hosting provider's settings. For example, in Vercel, you would add this in your project's "Settings" > "Environment Variables" section.

-   **Name**: `GOOGLE_API_KEY`
-   **Value**: `YOUR_API_KEY_HERE`
