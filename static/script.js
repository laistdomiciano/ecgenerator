document.addEventListener("DOMContentLoaded", function () {
    loadContractTypes();
    loadEmployeesWithoutContracts();
    setupGenerateButton();
});

let selectedEmployeeId = '';
let selectedContractTypeId = '';

function loadContractTypes() {
    const token = getToken();
    fetch(`${BACKEND_API_URL}/get_contract_types`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const contractList = document.getElementById('contract-types-list');
        contractList.innerHTML = ''; // Clear the list before adding new items
        if (data.length > 0) {
            data.forEach(contract => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a class="dropdown-item" href="#" data-type="${contract.id}">${contract.name}</a>`;
                listItem.addEventListener('click', function () {
                    selectedContractTypeId = contract.id;
                    console.log('Contract Type selected:', selectedContractTypeId); // Log the selected contract type
                    checkEnableGenerateButton();
                });
                contractList.appendChild(listItem);
            });
        } else {
            contractList.innerHTML = `<li class="list-group-item">No contract types available.</li>`;
        }
    })
    .catch(error => console.error('Error loading contract types:', error));
}

function loadEmployeesWithoutContracts() {
    const token = getToken();
    fetch(`${BACKEND_API_URL}/employees_wo_contract`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const employeeList = document.getElementById('employees-list');
        employeeList.innerHTML = ''; // Clear the list before adding new items
        if (data.length > 0) {
            data.forEach(employee => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a class="dropdown-item" href="#" data-id="${employee.id}">${employee.employee_name}</a>`;
                listItem.addEventListener('click', function () {
                    selectedEmployeeId = employee.id;
                    console.log('Employee selected:', selectedEmployeeId); // Log the selected employee
                    checkEnableGenerateButton();
                });
                employeeList.appendChild(listItem);
            });
        } else {
            employeeList.innerHTML = `<li class="list-group-item">No employees found without contracts.</li>`;
        }
    })
    .catch(error => console.error('Error loading employees:', error));
}

function setupGenerateButton() {
    const generateBtn = document.getElementById('generateContractBtn');
    generateBtn.addEventListener('click', function () {
        if (selectedEmployeeId && selectedContractTypeId) {
            generateContract(selectedEmployeeId, selectedContractTypeId);
        } else {
            alert('Please select both employee and contract type.');
        }
    });
}

// Enable the Generate button only when both employee and contract type are selected
function checkEnableGenerateButton() {
    const generateBtn = document.getElementById('generateContractBtn');
    console.log('Checking if Generate button should be enabled:', selectedEmployeeId, selectedContractTypeId); // Log to check the condition
    if (selectedEmployeeId && selectedContractTypeId) {
        generateBtn.disabled = false;  // Enable the button
    } else {
        generateBtn.disabled = true;  // Keep it disabled
    }
}

function generateContract(employeeId, contractTypeId) {
    const token = getToken();

    fetch(`${BACKEND_API_URL}/create_contract/${contractTypeId}/${employeeId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Contract generated successfully. PDF URL: ' + data.pdf_url);
            window.location.reload();  // Reload the page to refresh the contract status
        } else {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => console.error('Error generating contract:', error));
}

function getToken() {
    return sessionStorage.getItem('access_token') || null;
}
