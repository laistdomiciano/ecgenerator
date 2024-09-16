from flask import Flask, request, session, render_template, redirect, url_for, flash
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
# from backend.app.models import User
import requests
import os


app = Flask(__name__, template_folder='templates', static_folder='static')


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
app.secret_key = os.environ.get('FRONTEND_SECRET_KEY', '1234secret')

BACKEND_API_URL = os.environ.get('BACKEND_API_URL', 'https://ecgenerator-backend.onrender.com')


@login_manager.user_loader
def load_user(user_id):
    """
    Load the user by making a request to the backend to get the user info
    """
    headers = {
        'Authorization': f"Bearer {session.get('access_token')}"
    }
    response = requests.get(f"{BACKEND_API_URL}/users/{user_id}", headers=headers)

    if response.status_code == 200:
        user_data = response.json()
        return User(user_data)
    return None

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        data = {
            'name': request.form.get('name'),
            'email': request.form.get('email'),
            'username': request.form.get('username'),
            'password1': request.form.get('password1'),
            'password2': request.form.get('password2')
        }

        response = requests.post(f"{BACKEND_API_URL}/signup", json=data)
        result = response.json()

        if response.status_code == 200 and result.get('success'):
            return redirect(url_for('login'))
        else:
            error = result.get('error', 'An error occurred during signup.')
            return render_template('signup.html', error=error)

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = {
            'username': request.form.get('username'),
            'password': request.form.get('password')
        }

        response = requests.post(f"{BACKEND_API_URL}/login", json=data)
        result = response.json()

        if response.status_code == 200 and 'token' in result:
            # session['user'] = result['user']
            # session['access_token'] = result['token']
            return render_template('dashboard.html')
            # return redirect(url_for('dashboard'))
        else:
            error = result.get('error', 'Invalid credentials.')
            return render_template('login.html', error=error)

    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    session.pop('access_token', None)
    session.pop('user', None)
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    print("Inside Dashboard")
    return render_template('dashboard.html', user=session.get('user'))

@app.route('/create_employee', methods=['GET', 'POST'])
@login_required
def create_employee():
    if request.method == 'POST':
        # Collect the form data from the HTML form
        form_data = {
            'employee_name': request.form.get('employee_name'),
            'company_name': request.form.get('company_name'),
            'start_date': request.form.get('start_date'),
            'job_title': request.form.get('job_title'),
            'job_responsibilities': request.form.get('job_responsibilities'),
            'salary': request.form.get('salary'),
            'benefits': request.form.get('benefits'),
            'work_hours': request.form.get('work_hours'),
            'leave_days': request.form.get('leave_days'),
            'notice_period': request.form.get('notice_period'),
            'hourly_rate': request.form.get('hourly_rate'),
            'number_of_hours': request.form.get('number_of_hours'),
            'description_of_services': request.form.get('description_of_services'),
            'fee_amount': request.form.get('fee_amount'),
            'payment_schedule': request.form.get('payment_schedule'),
            'ownership_terms': request.form.get('ownership_terms'),
            'company_representative': request.form.get('company_representative'),
            'client_representative': request.form.get('client_representative')
        }

        headers = {
            'Authorization': f"Bearer {session.get('access_token')}"
        }

        response = requests.post(f"{BACKEND_API_URL}/create_employee", json=form_data, headers=headers)
        result = response.json()

        if response.status_code == 201:

            flash(f"Employee {form_data['employee_name']} created successfully.", 'success')
            return redirect(url_for('dashboard'))
        else:
            error = result.get('error', 'An error occurred while creating the employee.')
            return render_template('create_employee.html', error=error)

    return render_template('create_employee.html')



@app.route('/create_contract', methods=['GET'])
@login_required
def create_contract():
    headers = {
        'Authorization': f"Bearer {session.get('access_token')}"
    }

    response_contract = requests.get(f"{BACKEND_API_URL}/create_contract", headers=headers)
    response_employee = requests.get(f"{BACKEND_API_URL}/create_contract", headers=headers)
    contracts = response_contract.json()
    employees = response_employee.json()

    if response_contract.status_code and response_employee.status_code == 200:
        return render_template('create_contract.html', employees=employees, contracts=contracts)
    else:
        error_contracts = employees.get('error', 'An error occurred while retrieving employees.')
        error_employees = employees.get('error', 'An error occurred while retrieving employees.')
        return render_template('create_contract.html', error_contracts=error_contracts,error_employees=error_employees)


@app.route('/update_user/<int:user_id>', methods=['GET', 'POST'])
@login_required
def update_user(user_id):
    if request.method == 'POST':
        form_data = {
            'name': request.form.get('name'),
            'email': request.form.get('email'),
            'password': request.form.get('password')
        }

        headers = {
            'Authorization': f"Bearer {session.get('access_token')}"
        }

        response = requests.put(f"{BACKEND_API_URL}/update_user/{user_id}", json=form_data, headers=headers)
        result = response.json()

        if response.status_code == 200:
            flash("User information updated successfully.")
            return redirect(url_for('dashboard'))
        else:
            error = result.get('error', 'An error occurred while updating the user.')
            return render_template('update_user.html', error=error, user=session.get('user'))

    return render_template('update_user.html', user=session.get('user'))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)




