#!/bin/zsh

# Loading colors
autoload -U colors
colors

# # To do the migrations
# python manage.py migrate

echo "$bold_color$fg[green]Aplicação iniciada${reset_color}"
echo "$bold_color$fg[yellow]Acesse: http://localhost:8000/ \n${reset_color}"

# python manage.py runserver 0.0.0.0:8000
tail -f /dev/null
