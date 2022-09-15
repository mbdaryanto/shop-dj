# shop-dj
Simple Shop

# client
to build client

    yarn && yarn build

# server
to setup server
create venv (recommended)

    python3 -m venv venv
    source venv/bin/activate

install requirements (python dependency)

    pip install -r requirements.txt

generate secret key

    python make_env.py

run migration

    python manage.py migrate

run server

    python manage.py runserver