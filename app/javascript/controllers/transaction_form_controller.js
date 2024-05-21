import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['caseInfoField', 'courtField', 'courtNumberField', 'transactionTypeField', 'caseIdField'];

  connect() {

    console.log('Connected to transaction-form controller');
    console.log('Transaction type field target:', this.transactionTypeFieldTarget);
    console.log('Case ID field target:', this.caseIdFieldTarget);
    console.log('Case ID field target value:', this.caseIdFieldTarget.value || 'Value not selected');

    const casesData = JSON.parse(this.element.dataset.cases);
    console.log('Parsed cases:', casesData);
    this.updateFields();
  }


  updateFields(selectedCaseId = null) {
    const transactionType = this.transactionTypeFieldTarget.querySelector('select').value;
    const caseDropdown = this.caseInfoFieldTarget.querySelector('select');
    const caseId = selectedCaseId !== null ? selectedCaseId : (caseDropdown ? caseDropdown.value.trim() : null);

    console.log('Update Fields called');
    console.log('Transaction type changed:', transactionType);
    console.log('Case ID changed:', caseId);

    if (caseId) {
      this.caseIdFieldTarget.value = caseId;
      console.log('Case ID field target value set to:', this.caseIdFieldTarget.value);
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

    this.caseInfoFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtFieldTarget.style.display = isNewCase ? 'block' : 'none';
    this.courtNumberFieldTarget.style.display = isNewCase ? 'block' : 'none';
  }

  transactionTypeChanged() {
    console.log('Transaction type changed event triggered!');
    this.updateFields();
  }


  caseOptionsChanged() {
    console.log('Case options changed event triggered!');
    const caseDropdown = this.caseInfoFieldTarget.querySelector('select');
    const selectedCaseId = caseDropdown ? caseDropdown.value.trim() : null;
    console.log('Selected case ID:', selectedCaseId);

    this.updateFields(selectedCaseId);

    this.fetchCaseOptions(selectedCaseId);
  }

  fetchCaseOptions(selectedCaseId) {
    console.log('Fetching case options...');
    const selectedType = this.transactionTypeFieldTarget.querySelector('select').value;
    const clientId = this.element.dataset.clientId;
    const url = `/clients/${clientId}/case_options`;

    const params = new URLSearchParams({
        transaction_type: selectedType,
        timestamp: Date.now(),
        ...(selectedCaseId && { selected_case_id: selectedCaseId })
    });
    const finalUrl = `${url}?${params}`;
    console.log('Final URL:', finalUrl);

    fetch(finalUrl)
      .then(response => {
        console.log('Fetch response:', response);
          if (!response.ok) {
              throw new Error(`Fetch error: ${response.statusText}`);
          }
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/vnd.turbo-stream.html')) {
              return response.text();
          } else {
              return response.json();
          }
      })
    .then(data => {
      console.log('Fetch data:', data);
        if (typeof data === 'string') {
          this.element.insertAdjacentHTML('beforeend', data);

        } else {
            // this.updateCaseOptions(data);
            this.updateCaseOptions(data, selectedCaseId);
        }
    })
    .catch(error => {
        console.error('Error fetching case options:', error.message);
        this.caseInfoFieldTarget.innerHTML = '<option value="">Error loading case options</option>';
    });
  }

  updateCaseOptions(jsonData,selectedCaseId) {
    console.log('Update Case Options called');
    console.log('JSON Data:', jsonData);

    this.caseInfoFieldTarget.innerHTML = '';
    jsonData.cases.forEach(caseData => {
      const option = document.createElement('option');
      option.value = caseData.id;
      option.text = caseData.court;
      if (caseData.id == selectedCaseId) {
        option.selected = true;
      }
      this.caseInfoFieldTarget.appendChild(option);
    });

    this.caseIdFieldTarget.value = selectedCaseId;
    console.log('Case ID field target value updated to:', this.caseIdFieldTarget.value);

  }

  populateCaseOptions(casesData) {
    console.log('Populating initial case options');
    this.caseInfoFieldTarget.innerHTML = '';
    casesData.forEach(caseData => {
      const option = document.createElement('option');
      option.value = caseData.id;
      option.text = caseData.court;
      this.caseInfoFieldTarget.appendChild(option);
    });
  }
}
