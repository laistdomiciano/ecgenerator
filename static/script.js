// frontend/static/js/scripts.js

document.addEventListener("DOMContentLoaded", function () {
    // Initialize Bootstrap tooltips if needed
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // Handle form validations
    (function () {
        'use strict'
        var forms = document.querySelectorAll('.needs-validation')

        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    form.classList.add('was-validated')
                }, false)
            })
    })()

    // Handle contract generation
    handleContractGeneration()
})

function handleContractGeneration() {
    const contractItems = document.querySelectorAll('.dropdown-item[data-type]')
    const contractModal = new bootstrap.Modal(document.getElementById('contractModal'))
    const contractTypeName = document.getElementById('contractTypeName')
    const confirmGenerateBtn = document.getElementById('confirmGenerate')

    let selectedType = ''

    contractItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault()
            selectedType = this.getAttribute('data-type')
            const typeText = this.textContent
            contractTypeName.textContent = typeText
            contractModal.show()
        })
    })

    confirmGenerateBtn.addEventListener('click', function () {
        if (selectedType) {
            generateContract(selectedType)
            contractModal.hide()
        }
    })
}

function generateContract(contractType) {
    const token = getToken()

    fetch(`${BACKEND_API_URL}/create_contract`, {  // Ensure BACKEND_API_URL is defined
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ type: contractType })  // Adjust based on backend requirements
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message or redirect
            alert("Contract created successfully! You can download it from your contracts section.")
            // Optionally, redirect to contracts page
        } else {
            alert("Failed to create contract: " + data.error)
        }
    })
    .catch(error => console.error("Error:", error))
}

function getToken() {
    return sessionStorage.getItem('access_token') || null
}

document.addEventListener("DOMContentLoaded", function () {
    handleEmployeeCreation();
});

function handleEmployeeCreation() {
    const employeeForm = document.getElementById('create-employee-form');
    if (employeeForm) {
        employeeForm.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!this.checkValidity()) {
                event.stopPropagation();
            } else {
                const formData = new FormData(this);
                const token = getToken();

                fetch(`${BACKEND_API_URL}/create_employee`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Employee created successfully');
                        window.location.href = '/dashboard';
                    } else {
                        alert('Error: ' + data.error);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
            employeeForm.classList.add('was-validated');
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadEmployeesWithoutContracts();
    handleContractGeneration();
});

function loadEmployeesWithoutContracts() {
    const token = getToken();
    fetch(`${BACKEND_API_URL}/employees_wo_contract`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const employeeList = document.getElementById('employees-list');
        if (data.length > 0) {
            data.forEach(employee => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                listItem.innerHTML = `${employee.employee_name} <button class="btn btn-primary" data-id="${employee.id}" data-name="${employee.employee_name}">Generate Contract</button>`;
                employeeList.appendChild(listItem);
            });
            setupContractButtons();
        } else {
            employeeList.innerHTML = `<li class="list-group-item">No employees found without contracts.</li>`;
        }
    })
    .catch(error => console.error('Error:', error));
}

function setupContractButtons() {
    const buttons = document.querySelectorAll('[data-id]');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const employeeName = this.getAttribute('data-name');
            const employeeId = this.getAttribute('data-id');
            const modal = new bootstrap.Modal(document.getElementById('contractModal'));
            document.getElementById('employee-name').textContent = employeeName;
            document.getElementById('confirmGenerateContract').setAttribute('data-id', employeeId);
            modal.show();
        });
    });
}

function handleContractGeneration() {
    const confirmBtn = document.getElementById('confirmGenerateContract');
    confirmBtn.addEventListener('click', function () {
        const employeeId = this.getAttribute('data-id');
        const token = getToken();

        fetch(`${BACKEND_API_URL}/create_contract/1/${employeeId}`, { // Assuming contract_type_id is 1
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Contract generated successfully.');
                window.location.reload();
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });
}