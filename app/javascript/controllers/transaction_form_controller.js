import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="transaction-form"
export default class extends Controller {
  static targets = ['caseInfoField', 'courtField', 'courtNumberField'];

  updateFields(event) {
    const transactionType = event.target.value;
    this.toggleFieldsVisibility(transactionType === 'expense');
  }

  toggleFieldsVisibility(isExpense) {
    this.caseInfoFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtNumberFieldTarget.style.display = isExpense ? 'block' : 'none';
  }
}
