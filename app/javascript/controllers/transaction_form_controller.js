import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['caseInfoField', 'courtField', 'courtNumberField', 'transactionType'];

  connect() {
    this.updateFields();
  }

  updateFields() {
    const transactionType = this.transactionTypeTarget.value;
    console.log('Transaction type changed:', transactionType);
    this.toggleFieldsVisibility(transactionType === 'expense');
  }

  toggleFieldsVisibility(isExpense) {
    this.caseInfoFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtNumberFieldTarget.style.display = isExpense ? 'block' : 'none';
  }

  transactionTypeChanged() {
    const transactionType = this.transactionTypeTarget.value;
    console.log('Transaction type changed event triggered!');
    this.updateFields();
  }

  caseOptionsChanged() {
    const selectedType = this.transactionTypeTarget.value;

    // Fetching case options
    fetch('/shared/case_options?transaction_type=' + selectedType)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        // Assuming your caseDropdown is a target with an appropriate identifier
        this.caseInfoFieldTarget.innerHTML = data;
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }
}
