const stockYesRadio = document.getElementById('stock-yes');
const stockNoRadio = document.getElementById('stock-no');
const stockPartsContainer = document.getElementById('stock-parts-container');
const categorySelect = document.getElementById('categorySelect');
const objectSelect = document.getElementById('objectSelect');


const categoryObjects = {
    'ENTETE': [
        'Plaque laterales (Moteur)',
        'Plaque laterales (Frein)',
        'Barre renforts',
        'Fer Angle',
        'Pillow Block',
        'Plaque Moteur',
        'Bracket pour Ressorts',
        'T-P-Shaft ASSY (D)',
        'T-P-Shaft ASSY (G)'
    ],
    'Barre Anti-vent': [
        'Retenur Courroies B-A-V',
        'Tendems ASSY',
        'ButtRail'
    ],
    'Guides': [
        'Fer Angle',
        'Charniere de guides'
    ],
    'Barre de bas': [
        'Fer Angle',
        'Barre ALU',
        'Soft Touch'
    ],
    'Rideau': [
        'Bouchons',
        'Plaques de coins'
    ]
};

stockYesRadio.addEventListener('change', function() {
    if (this.checked) {
        stockPartsContainer.classList.remove('hidden');
    }
});

stockNoRadio.addEventListener('change', function() {
    if (this.checked) {
        stockPartsContainer.classList.add('hidden');
    }
});

categorySelect.addEventListener('change', function() {
    const selectedCategory = this.value;
    objectSelect.innerHTML = ''; // Clear previous options
    if (selectedCategory && categoryObjects[selectedCategory]) {
        categoryObjects[selectedCategory].forEach(object => {
            const option = document.createElement('option');
            option.value = object;
            option.textContent = object;
            objectSelect.appendChild(option);
        });
    }
});