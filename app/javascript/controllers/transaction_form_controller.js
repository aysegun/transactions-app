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
    const selectedType = this.transactionTypeFieldTarget.value;

    fetch('/shared/case_options?transaction_type=' + selectedType)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })

      .then(data => {
        this.caseInfoFieldTarget.innerHTML = data;
      })

      .catch(error => {
        console.error('Fetch error:', error);
      });
  }
}
