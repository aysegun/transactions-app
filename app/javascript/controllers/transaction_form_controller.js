import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['caseInfoField', 'courtField', 'courtNumberField', 'transactionType'];
  connect() {
    console.log(`controller connected`)
    this.updateFields();
  }

  updateFields() {
    const transactionType = this.transactionTypeTarget.value;
    this.toggleFieldsVisibility(transactionType === 'expense');
  }

  toggleFieldsVisibility(isExpense) {
    this.caseInfoFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtFieldTarget.style.display = isExpense ? 'block' : 'none';
    this.courtNumberFieldTarget.style.display = isExpense ? 'block' : 'none';
  }

  transactionTypeChanged() {
    this.updateFields();
  }

}
