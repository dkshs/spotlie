#!/bin/sh

# Used for deployment on Railway
curl "$GCP_CREDENTIALS_URL" -o ./gcpCredentials.json && python manage.py collectstatic
