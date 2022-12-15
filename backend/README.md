# WeText Backend

### 1. Create Virtual Env

`python3 -m venv <environment_name>`

### 2. Activate Virtual Ennvironment

`source <environment_name>/bin/activate`

### 3. Install Required Packages

`pip install -r requirements.txt`

### 4. Fetch Database Changes

`python manage.py makemigrations`

`python manage.py migrate`

### 5. Create Admin User

`python manage.py createsuperuser`

### 6. Start The Server Run

`python manage.py runserver`
