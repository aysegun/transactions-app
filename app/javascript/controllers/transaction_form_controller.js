import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['caseInfoField', 'courtField', 'courtNumberField', 'transactionTypeField'];

  connect() {
    console.log('Connected to transaction-form controller');
    console.log('Transaction type field target:', this.transactionTypeFieldTarget);
    this.updateFields();
  }

  updateFields() {
    const transactionType = this.transactionTypeFieldTarget.querySelector('select').value;
    // const transactionType = this.transactionTypeFieldTarget.value;
    console.log('Transaction type changed:', transactionType);
    this.toggleFieldsVisibility(transactionType === 'expense');
  }

  toggleFieldsVisibility(isExpense) {
    this.caseInfoFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtNumberFieldTarget.style.display = isExpense ? 'block' : 'none';
  }

  transactionTypeChanged() {
    const transactionType = this.transactionTypeFieldTarget.value;
    console.log('Transaction type changed event triggered!');
    this.updateFields();
  }

  caseOptionsChanged() {
    console.log('Inside caseOptionsChanged');
    const selectedType = this.transactionTypeFieldTarget.querySelector('select').value;
    // const selectedType = this.transactionTypeFieldTarget.value;
    const clientId = this.element.dataset.clientId;
    console.log('Selected Type:', selectedType);
    console.log('Client ID:', clientId);

    if(clientId) {

      fetch(`/clients/${clientId}/case_options?transaction_type=${selectedType}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Network response was not ok (${response.status}: ${response.statusText})`);
          }
          return response.json();
      })
      .then(data => {
          this.caseInfoFieldTarget.innerHTML = data.options_html;
          this.captureSelectedCaseId();
      })
      .catch(error => {
          console.error(`Fetch error:`, error.message);
      });
    }
  }

  captureSelectedCaseId() {
    const caseDropdown = this.caseInfoFieldTarget.querySelector('select');

    if (caseDropdown) {
        const selectedCaseId = caseDropdown.value;
        console.log('Selected Case ID:', selectedCaseId);
    }
  }

}
