# WeText - Instant Messaging Application

## Running Commands

### Running Web Socket (PORT 9000)

`cd <PROJECT_ROOT_DIR>/chat-socket`

`npm install`

`npm start`

### Running Frontend (PORT 3000)

`cd <PROJECT_ROOT_DIR>/frontend`

`npm install`

`npm start`

### Running Backend (PORT 8000)

`cd <PROJECT_ROOT_DIR>/backend`

`python3 -m venv <environment_name>`

`source <environment_name>/bin/activate`

`pip install -r requirements.txt`

`python manage.py makemigrations`

`python manage.py migrate`

`python manage.py createsuperuser`

`python manage.py runserver`
