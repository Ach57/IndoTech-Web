const doorCategory = document.getElementById('doorCategory');
const additionalOptions = document.getElementById('additionalOptions');
const partSelect = document.getElementById('partSelect');
const typeSelect = document.getElementById('typeSelect');


const partsData = {
    'Guides': {
        parts: ['Profile Angle', 'Profiles Speciales'],
        types: {
            'Profile Angle': ['5x5', '3x5', '3x3'],
            'Profiles Speciales': ['LHR-AV', 'LHR-AR', 'J', 'W']
        }
    },
    'Barre de bas': {
        parts: ['Fer Plat', 'Profile Angle'],
        types: {
            'Profile Angle': ['3x3', '3x5', '5x5'],
            'Fer Plat': ['3"', '5"']

        }
    },
    'C-Channel': {
        parts: ['Profile en C', 'Profile Angle'],
        types: {
            'Profile Angle': ['3x3', '3x5', '5x5'],
            'Profile en C':[""]
        }
    },
    'Tuyau Principale':{
        parts: ['Tuyau', 'Reteneur Rideau'],
        types:{
            'Tuyau': ['6"'],
            'Reteneur Rideau':['6"']
        }
    },
    'Barre anti-vent':{
        parts:['Tuyau'],
        types:{
            'Tuyau': ['4"','5"', '6"', '8"','10"']
        }
    },
    'Ressort':{
        parts:['Shaft'],
        types:{
            'Shaft':['1"']
        }
        
    },
    'Rideau':{
        parts :['Rideau', 'Astragal','Embous'],
        types:{
            'Rideau': ['SBR 1/4"','SBR 1/8"']
        }
    }


};

doorCategory.addEventListener('change', function() {
    const selectedCategory = this.value;
    if (selectedCategory && partsData[selectedCategory]) {
        partSelect.innerHTML = '';
        partsData[selectedCategory].parts.forEach(part => {
            const option = document.createElement('option');
            option.value = part;
            option.textContent = part;
            partSelect.appendChild(option);
        });

        additionalOptions.classList.remove('hidden');
        updateTypeOptions();
    } else {
        additionalOptions.classList.add('hidden');
    }
});


partSelect.addEventListener('change', updateTypeOptions);


function updateTypeOptions() {
    const selectedPart = partSelect.value;
    const selectedCategory = doorCategory.value;

    if (selectedPart && partsData[selectedCategory].types[selectedPart]) {
        typeSelect.innerHTML = '';
        partsData[selectedCategory].types[selectedPart].forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        });
    }else{
        typeSelect.innerHTML ='';
    }
}

