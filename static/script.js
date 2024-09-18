document.addEventListener("DOMContentLoaded", function () {
    loadContractTypes();
    loadEmployeesWithoutContracts();
    handleContractGeneration();
});

function loadContractTypes() {
    const token = getToken();
    fetch(`${BACKEND_API_URL}/get_contract_types`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const contractList = document.getElementById('contract-types-list');
        if (data.length > 0) {
            data.forEach(contract => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a class="dropdown-item" href="#" data-type="${contract.id}">${contract.name}</a>`;
                contractList.appendChild(listItem);
            });
        } else {
            contractList.innerHTML = `<li class="list-group-item">No contract types available.</li>`;
        }
    })
    .catch(error => console.error('Error:', error));
}

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
                listItem.innerHTML = `<a class="dropdown-item" href="#" data-id="${employee.id}">${employee.employee_name}</a>`;
                employeeList.appendChild(listItem);
            });
        } else {
            employeeList.innerHTML = `<li class="list-group-item">No employees found without contracts.</li>`;
        }
    })
    .catch(error => console.error('Error:', error));
}

function handleContractGeneration() {
    const confirmBtn = document.getElementById('confirmGenerateContract');
    let selectedEmployeeId = '';
    let selectedContractTypeId = '';

    document.querySelectorAll('#employees-list .dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            selectedEmployeeId = this.getAttribute('data-id');
            document.getElementById('employee-name').textContent = this.textContent;
        });
    });

    document.querySelectorAll('#contract-types-list .dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            selectedContractTypeId = this.getAttribute('data-type');
        });
    });

    confirmBtn.addEventListener('click', function () {
        if (selectedEmployeeId && selectedContractTypeId) {
            generateContract(selectedEmployeeId, selectedContractTypeId);
        } else {
            alert('Please select both employee and contract type.');
        }
    });
}

function generateContract(employeeId, contractTypeId) {
    const token = getToken();
    fetch(`${BACKEND_API_URL}/create_contract`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employee_id: employeeId, contract_type_id: contractTypeId })
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
}

function getToken() {
    return sessionStorage.getItem('access_token') || null;
}
