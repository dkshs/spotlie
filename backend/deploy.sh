#!/bin/sh

# Used for deployment on Railway
python manage.py collectstatic
curl "$GCP_CREDENTIALS_URL" -o ./gcpCredentials.json
