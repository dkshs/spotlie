# SpotLie - Backend

SpotLie backend.

## Running Locally With Docker

### Prerequisites

- Docker; if you don't have it yet, follow the [installation instructions](https://docs.docker.com/get-docker/#supported-platforms).
- Docker Compose; refer to the official documentation for the [installation guide](https://docs.docker.com/compose/install/).

### Build the Stack

This can take a while, especially the first time you run this particular command on your development system:

```bash
docker compose -f local.yml build
```

Generally, if you want to emulate production environment use `production.yml` instead. And this is true for any other actions you might need to perform: whenever a switch is required, just do it!

### Run the Stack

This brings up both Django, PostgreSQL and PGAdmin. The first time it is run it might take a while to get started, but subsequent runs will occur quickly.

Open a terminal at the project root and run the following for local development:

```bash
docker compose -f local.yml up
```

You can also set the environment variable `COMPOSE_FILE` pointing to `local.yml` like this:

```bash
export COMPOSE_FILE=local.yml
```

And then run:

```bash
docker compose up
```

To run in a detached (background) mode, just:

```bash
docker compose up -d
```

The site should start and be accessible at <http://localhost:8000>.

### Execute Management Commands

As with any shell command that we wish to run in our container, this is done using the `docker-compose -f local.yml run --rm` command:

```bash
docker compose -f local.yml run --rm django python manage.py migrate
docker compose -f local.yml run --rm django python manage.py createsuperuser
```

Here, `django` is the target service we are executing the commands against. Also, please note that the `docker exec` does not work for running management commands.

You can also enter the container using `zsh`:

```bash
docker compose -f local.yml exec django zsh
```

### Configuring the Environment

The necessary project variables are in `.envs.example/`. Run the following command to have your variables:

```bash
cp -r .envs.example/ .envs/
```

The postgres variables are already configured, just assign the Django ones:

```env
# Clerk
# ------------------------------------------------------------------------------
CLERK_SECRET_KEY=""
WEBHOOK_SECRET="" # Secret key of your application's webhook in Clerk
JWKS_URL="" # This key is used to verify Clerk generated JWTs.
```
