// import { Controller } from "@hotwired/stimulus"

// export default class extends Controller {
//   static targets = ['caseInfoField', 'courtField', 'courtNumberField', 'transactionTypeField', 'caseIdField'];

//   connect() {

//     console.log('Connected to transaction-form controller');
//     console.log('Transaction type field target:', this.transactionTypeFieldTarget);
//     console.log('Case ID field target:', this.caseIdFieldTarget);
//     console.log('Case ID field target value:', this.caseIdFieldTarget.value || 'Value not selected');

//     this.element.addEventListener('submit', this.handleSubmit.bind(this));

//     this.updateFields();
//   }


//   updateFields(selectedCaseId = null) {
//     const transactionType = this.transactionTypeFieldTarget.querySelector('select').value;
//     const caseDropdown = this.caseInfoFieldTarget.querySelector('select');
//     const caseId = selectedCaseId !== null ? selectedCaseId : (caseDropdown ? caseDropdown.value.trim() : null);

//     console.log('Update Fields called');
//     console.log('Transaction type changed:', transactionType);
//     console.log('Case ID changed:', caseId);

//     if (caseId) {
//       this.caseIdFieldTarget.value = caseId;
//       console.log('Case ID field target value set to:', this.caseIdFieldTarget.value);
//     } else {
//       this.caseIdFieldTarget.value = '';
//       console.log('Case ID field target value set to empty');
//     }
//     this.toggleFieldsVisibility(transactionType, caseId);
//   }

//   toggleFieldsVisibility(transactionType, caseId) {
//     console.log('Toggle Fields Visibility called');
//     console.log('caseId:', caseId);
//     console.log('transactionType:', transactionType);

//     const isExpense = transactionType === 'expense';
//     const isNewCase = caseId === 'new_case';
//     console.log('isExpense:', isExpense);
//     console.log('isNewCase:', isNewCase);

//     this.caseInfoFieldTarget.style.display = isExpense ? 'block' : 'none';
//     this.courtFieldTarget.style.display = isNewCase ? 'block' : 'none';
//     this.courtNumberFieldTarget.style.display = isNewCase ? 'block' : 'none';

//     console.log('caseId:', caseId); // Added this line
//     console.log('transactionType:', transactionType); // Added this line
//   }

//   transactionTypeChanged() {
//     console.log('Transaction type changed event triggered!');
//     const caseId = this.caseInfoFieldTarget.querySelector('select').value.trim();
//     this.updateFields(caseId);
//   }

//   caseOptionsChanged() {
//     console.log('Case options changed event triggered!');
//     const caseDropdown = this.caseInfoFieldTarget.querySelector('select');
//     const selectedCaseId = caseDropdown ? caseDropdown.value.trim() : null;
//     console.log('Selected case ID:', selectedCaseId);

//     this.updateFields(selectedCaseId);

//     this.fetchCaseOptions(selectedCaseId);
//   }


//   fetchCaseOptions(selectedCaseId) {
//     console.log('Fetching case options...');
//     const selectedType = this.transactionTypeFieldTarget.querySelector('select').value;
//     const clientId = this.element.dataset.clientId;
//     const url = `/clients/${clientId}/case_options`;

//     const params = new URLSearchParams({
//         transaction_type: selectedType,
//         timestamp: Date.now(),
//         ...(selectedCaseId && { selected_case_id: selectedCaseId })
//     });
//     const finalUrl = `${url}?${params}`;
//     console.log('Final URL:', finalUrl);

//     fetch(finalUrl)
//       .then(response => {
//         console.log('Fetch response:', response);
//           if (!response.ok) {
//               throw new Error(`Fetch error: ${response.statusText}`);
//           }
//           const contentType = response.headers.get('content-type');
//           if (contentType && contentType.includes('text/vnd.turbo-stream.html')) {
//               return response.text();
//           } else {
//               return response.json();
//           }
//       })
//     .then(data => {
//       console.log('Fetch data:', data);
//         if (typeof data === 'string') {
//           this.element.insertAdjacentHTML('beforeend', data);
//           const caseDropdown = this.caseInfoFieldTarget.querySelector('select');
//           caseDropdown.value = selectedCaseId;
//           this.caseIdFieldTarget.value = selectedCaseId;
//           console.log('Case ID field target value updated to:', this.caseIdFieldTarget.value);

//         } else {
//           this.updateCaseOptions(data, selectedCaseId);
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching case options:', error.message);
//         this.caseInfoFieldTarget.innerHTML = '<option value="">Error loading case options</option>';
//     });
//   }

//   updateCaseOptions(jsonData,selectedCaseId) {
//     console.log('Update Case Options called');
//     console.log('JSON Data:', jsonData);

//     if (!selectedCaseId) {
//       selectedCaseId = this.caseIdFieldTarget.value;
//     }

//     this.caseInfoFieldTarget.innerHTML = '';
//     jsonData.cases.forEach(caseData => {
//       const option = document.createElement('option');
//       option.value = caseData.id;
//       option.text = caseData.court;
//       if (caseData.id == selectedCaseId) {
//         option.selected = true;
//       }
//       this.caseInfoFieldTarget.appendChild(option);
//     });

//     this.caseIdFieldTarget.value = selectedCaseId;
//     console.log('Case ID field target value updated to:', this.caseIdFieldTarget.value);

//   }

//   populateCaseOptions(casesData) {
//     console.log('Populating initial case options');
//     this.caseInfoFieldTarget.innerHTML = '';
//     casesData.forEach(caseData => {
//       const option = document.createElement('option');
//       option.value = caseData.id;
//       option.text = caseData.court;
//       this.caseInfoFieldTarget.appendChild(option);
//     });
//   }
// }

import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = ['transactionTypeField', 'caseIdField', 'caseInfoField'];

  connect() {
    console.log('Connected to transaction-form controller');
    console.log('Transaction type field target:', this.transactionTypeFieldTarget);
    console.log('Case ID field target:', this.caseIdFieldTarget);
    console.log('Case ID field target value:', this.caseIdFieldTarget.value || 'Value not selected');

    this.element.addEventListener('submit', this.handleSubmit.bind(this));

    this.updateFields();
  }

  updateFields(selectedCaseId = null) {
    const transactionType = this.transactionTypeFieldTarget.querySelector('select').value;
    const caseDropdown = this.caseInfoFieldTarget.querySelector('select#transaction_case_id_select');
    const caseId = selectedCaseId !== null ? selectedCaseId : (caseDropdown ? caseDropdown.value.trim() : null);

    console.log('Update Fields called');
    console.log('Transaction type changed:', transactionType);
    console.log('Case ID changed:', caseId);

    if (caseId) {
      this.caseIdFieldTarget.value = caseId;
      console.log('Case ID field target value set to:', this.caseIdFieldTarget.value);
    } else {
      this.caseIdFieldTarget.value = '';
      console.log('Case ID field target value set to empty');
    }
    this.toggleFieldsVisibility(transactionType, caseId);
  }

  toggleFieldsVisibility(transactionType, caseId) {
    console.log('Toggle Fields Visibility called');
    console.log('caseId:', caseId);
    console.log('transactionType:', transactionType);

    const isExpense = transactionType === 'expense';
    const isNewCase = caseId === 'new_case';

    console.log('isExpense:', isExpense);
    console.log('isNewCase:', isNewCase);

    this.caseInfoFieldTarget.hidden = isNewCase;
    this.transactionTypeFieldTarget.hidden = !isExpense;
  }

  transactionTypeChanged() {
    console.log('Transaction type changed event triggered!');
    this.updateFields();
  }

  caseOptionsChanged(event) {
    const selectedCaseId = event.target.value;
    console.log('Case options changed event triggered!');
    console.log('Selected case ID:', selectedCaseId);
    this.updateFields(selectedCaseId);
  }

  handleSubmit(event) {
    event.preventDefault();
    const formElement = this.element.querySelector('form');
    const formData = new FormData(formElement);

    formData.set('transaction[case_id]', this.caseIdFieldTarget.value);
    console.log('Form data being submitted:', Object.fromEntries(formData.entries()));

    fetch(formElement.action, {
      method: formElement.method,
      body: formData,
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    })
    .then(response => {
      if (response.ok) {
        console.log('Form submitted successfully');
        return response.text();
      } else {
        return Promise.reject(response);
      }
    })
    .then(html => {
      document.open();
      document.write(html);
      document.close();
    })
    .catch(error => {
      console.error('Form submission failed:', error);
    });
  }
}
