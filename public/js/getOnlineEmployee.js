document.addEventListener('DOMContentLoaded', function() {
    async function fetchOnlineEmployees() {
        try {
            const response = await fetch('/online-employees');
            const employees = await response.json();
            const employeeSelect = document.getElementById('online-user-select');

            employeeSelect.innerHTML = ''; // Clear existing options

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.textContent = '--Select--';
            defaultOption.value = ''; // Optional: Set value to an empty string
            defaultOption.disabled = true;
            defaultOption.selected = true;
            employeeSelect.appendChild(defaultOption);

            // Add online employee options
            employees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.username;
                option.textContent = employee.username;
                employeeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching online employees:', error);
        }
    }

    fetchOnlineEmployees();
});
