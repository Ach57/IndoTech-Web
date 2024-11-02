document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('request-form');
    const summaryBlock = document.getElementById('summary-block');
    const closeSummaryButton = document.getElementById('close-summary');
    const doorTypeSelect = document.getElementById('doorType');
    const stockYesRadio = document.getElementById('stock-yes');

    // Ensure the summary block is hidden initially
    summaryBlock.style.display = 'none';

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent traditional form submission

        // Get form values
        const doorType = doorTypeSelect.value;
        const doorCategory = document.getElementById('doorCategory').value;
        const partSelect = document.getElementById('partSelect').value;
        const typeSelect = document.getElementById('typeSelect').value;
        const length = document.getElementById('length').value;
        const quantity = document.getElementById('quantity').value;
        const projectNumber = document.getElementById('project-number').value;
        const onlineEmployee = document.getElementById('online-user-select').value;
        const estimatedTime = document.getElementById('duration').value;

        // Populate summary block
        document.getElementById('summary-door-type').textContent = doorType;
        document.getElementById('summary-door-category').textContent = doorCategory;
        document.getElementById('summary-part').textContent = partSelect;
        document.getElementById('summary-type').textContent = typeSelect;
        document.getElementById('summary-length').textContent = length;
        document.getElementById('summary-quantity').textContent = quantity;
        document.getElementById('summary-project-number').textContent = projectNumber;
        document.getElementById('summary-online-employee').textContent = onlineEmployee;
        document.getElementById('summary-estimated-time').textContent = estimatedTime;

        // Check if the user selected "Yes" for stock parts and gather stock data
        let stockData = '';

        if (stockYesRadio.checked) {
            const category = document.getElementById('categorySelect').value;
            const object = document.getElementById('objectSelect').value;
            const type = document.getElementById('typeInput').value;
            const qty = document.getElementById('qtyInput').value;

            stockData = `Category: ${category}, Object: ${object}, Type: ${type}, Qty: ${qty}`;
        }

        // Add stock data to summary if available
        if (stockData) {
            document.getElementById('summary-stock-data').textContent = stockData;
            document.getElementById('hidden-stock-data').value = stockData;
        } else {
            document.getElementById('summary-stock-data').textContent = 'None';
            document.getElementById('hidden-stock-data').value = 'None';
        }

        var projectExist = false;
        for (let i = 0; i<localStorage.length;i++){
            const keyValue = localStorage.key(i).split('-')[1];
            if (projectNumber === keyValue){
                projectExist=true;
                break
            }
        }

        if (!projectExist){
            // Populate hidden fields
            document.getElementById('hidden-door-type').value = doorType;
            document.getElementById('hidden-door-category').value = doorCategory;
            document.getElementById('hidden-part').value = partSelect;
            document.getElementById('hidden-type').value = typeSelect;
            document.getElementById('hidden-length').value = length;
            document.getElementById('hidden-quantity').value = quantity;
            document.getElementById('hidden-project-number').value = projectNumber;
            document.getElementById('hidden-online-employee').value = onlineEmployee;
            document.getElementById('hidden-estimated-time').value = estimatedTime;

            // Show the summary block
            summaryBlock.style.display = 'block';


        }else{
            alert(`This project Name already exists ${projectNumber}`);
        }

        
    });

    // Closing the summary block
    closeSummaryButton.addEventListener('click', function() {
        summaryBlock.style.display = 'none';
    });
});
