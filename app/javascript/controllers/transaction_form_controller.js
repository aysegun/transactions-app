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
        const response = await fetch(`/clients/${clientId}/case_options?transaction_type=${selectedType}`);
        const data = await response.json();

        this.caseInfoFieldTarget.insertAdjacentHTML('beforeend', data.options_html);
        this.captureSelectedCaseId();

      } catch (error) {
        console.error('Fetch error:', error.message);
      }
    }
  }

  captureSelectedCaseId() {
    const caseDropdown = this.caseInfoFieldTarget.querySelector('select');

    if (caseDropdown) {
        const selectedCaseId = caseDropdown.value;
        console.log('Selected Case ID:', selectedCaseId);
        this.updateFields();
    }
  }

}
