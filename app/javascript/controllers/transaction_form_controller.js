import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['caseInfoField', 'courtField', 'courtNumberField', 'transactionTypeField', 'caseIdField'];

  connect() {
    console.log('Connected to transaction-form controller');
    console.log('Transaction type field target:', this.transactionTypeFieldTarget);
    console.log('Case ID field target:', this.caseIdFieldTarget);

    this.updateFields();
  }

  updateFields() {
    const transactionType = this.transactionTypeFieldTarget.querySelector('select').value;
    const caseDropdown = this.caseIdFieldTarget.querySelector('select');
    console.log('Case Dropdown:', caseDropdown);
    const caseId = caseDropdown ? caseDropdown.value : null;

    console.log('Transaction type changed:', transactionType);
    console.log('Case ID changed:', caseId);

    this.toggleFieldsVisibility(transactionType, caseId);

  }

  toggleFieldsVisibility(transactionType, caseId) {
    const isExpense = transactionType === 'expense';
    const isNewCase = caseId === 'new_case';
    console.log('isExpense:', isExpense);
    console.log('isNewCase:', isNewCase);

    this.caseInfoFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtFieldTarget.style.display = isNewCase && isExpense ? 'block' : 'none';
    this.courtNumberFieldTarget.style.display = isNewCase && isExpense ? 'block' : 'none';
  }

  transactionTypeChanged() {
    console.log('Transaction type changed event triggered!');
    this.updateFields();
  }

  caseOptionsChanged() {
    this.fetchCaseOptions();
  }

  async fetchCaseOptions() {
    const selectedType = this.transactionTypeFieldTarget.querySelector('select').value;
    const clientId = this.element.dataset.clientId;
    console.log('Client ID:', clientId);

    if (clientId) {
      try {
        const response = await fetch(`/clients/${clientId}/case_options?transaction_type=${selectedType}&timestamp=${Date.now()}`);
        console.log('Fetch response:', response);
        if (!response.ok) {
          throw new Error(`Fetch error: ${response.statusText}`);
        }
        const jsonData = await response.json();
        // const turboStreamContent = await response.text();
        // const parser = new DOMParser();
        // const xmlDoc = parser.parseFromString(turboStreamContent, 'application/xml');
        // const optionsHtml = xmlDoc.querySelector('turbo-stream template').innerHTML;

        //this.caseInfoFieldTarget.insertAdjacentHTML('beforeend', optionsHtml);
        this.caseInfoFieldTarget.innerHTML = '';

        // this.captureSelectedCaseId();
        for (const caseData of jsonData.cases) {
          const option = document.createElement('option');
          option.value = caseData.id;
          option.text = caseData.court;
          this.caseInfoFieldTarget.appendChild(option);
        }
      } catch (error) {
        console.error('Fetch error:', error.message);
      }
    }
  }

  captureSelectedCaseId() {
    const caseDropdown = this.caseInfoFieldTarget.querySelector('select');
    console.log('Case Dropdown:', caseDropdown);

    if (caseDropdown) {
        const selectedCaseId = caseDropdown.value;
        console.log('Selected Case ID:', selectedCaseId);
        // this.updateFields();
        if (selectedCaseId !== null) {
          this.updateFields();
        }
    }
  }

}
