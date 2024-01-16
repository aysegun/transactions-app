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
    this.courtFieldTarget.style.display = isNewCase ? 'block' : 'none';
    this.courtNumberFieldTarget.style.display = isNewCase ? 'block' : 'none';
  }

  transactionTypeChanged() {
    console.log('Transaction type changed event triggered!');
    this.updateFields();
  }

  caseOptionsChanged() {
    this.fetchCaseOptions();
  }

  async fetchCaseOptions() {
    // console.log('TurboStreams:', TurboStreams)

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

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/vnd.turbo-stream.html')) {
          const turboStreamContent = await response.text();
          TurboStreams.append(turboStreamContent);
        } else {
          const jsonData = await response.json();
          this.caseInfoFieldTarget.innerHTML = '';

          for (const caseData of jsonData.cases) {
            const option = document.createElement('option');
            option.value = caseData.id;
            option.text = caseData.court;
            this.caseInfoFieldTarget.appendChild(option);
          }
        }
      } catch (error) {
          console.error('Error processing JSON:', error.message );
          this.caseInfoFieldTarget.innerHTML = '<option value="">Error loading case options</option>';
    }
    }
  }

  captureSelectedCaseId() {
    const caseDropdown = this.caseInfoFieldTarget.querySelector('select');
    console.log('Case Dropdown:', caseDropdown);

    if (caseDropdown) {
        const selectedCaseId = caseDropdown.value;
        console.log('Selected Case ID:', selectedCaseId);
        if (selectedCaseId !== null) {
          this.updateFields();
        }
    }
  }

}
