# SpotLie - Frontend

Spotlie frontend.

## Install and run the project

### Global Dependencies

You need to have a main dependency installed:

- Node.js LTS v16 (or any higher version)

Do you use `nvm`? Then you can run `nvm install` in the project folder to install and use the most appropriate version of Node.js.

### Get the repository

```bash
git clone https://github.com/dkshs/spotlie.git
```

### Local Dependencies

So after getting the repository, don't forget to install the project's local dependencies:

```bash
pnpm install
```

### Environment variables

Create a `.env` file similar to [`.env.example`](./.env.example).

Change [Clerk](https://dashboard.clerk.com/) variables according to your project.

```env
# ...

# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY"
NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME="YOUR_JWT_TEMPLATE_NAME"

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# ...
```

### Run the project

To run the project locally, just run the command below:

```bash
pnpm dev
```

- go to <http://localhost:3000> to see the application.

## License

This project is licensed under the **MIT** License - see the [LICENSE](../LICENSE) file for details
