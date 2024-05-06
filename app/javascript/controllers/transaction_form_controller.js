import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['caseInfoField', 'courtField', 'courtNumberField', 'transactionTypeField', 'caseIdField'];
  //casesData = null;

  connect() {
     //console.log('Cases dataset:', this.element.dataset.cases);
    // this.cases = JSON.parse(this.element.dataset.cases);
    // console.log('Parsed cases:', this.cases);

    console.log('Connected to transaction-form controller');
    console.log('Transaction type field target:', this.transactionTypeFieldTarget);
    console.log('Case ID field target:', this.caseIdFieldTarget);
    console.log('Case ID field target value:', this.caseIdFieldTarget.value || 'Value not selected');



    const casesData = JSON.parse(this.element.dataset.cases);
    console.log('Parsed cases:', casesData);

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

  // caseOptionsChanged() {

  //   this.fetchCaseOptions();
  // }
  // caseOptionsChanged() {
  //   const caseDropdown = this.caseInfoFieldTarget.querySelector('select');
  //   const selectedCaseId = caseDropdown.value;
  //   console.log('Selected Case ID:', selectedCaseId);
  //   this.fetchCaseOptions(selectedCaseId);
  // }
  caseOptionsChanged() {
    console.log('Case options changed event triggered!');
    const caseDropdown = this.caseInfoFieldTarget.querySelector('select');
    if (caseDropdown) {
      const selectedCaseId = caseDropdown.value;
      console.log('Selected Case ID:', selectedCaseId);
      this.fetchCaseOptions(selectedCaseId);
    } else {
      console.error('Case dropdown element not found.');
    }
  }



  // async fetchCaseOptions() {
  //   const selectedType = this.transactionTypeFieldTarget.querySelector('select').value;
  //   const selectedCases = this.cases ? this.cases.filter(c => c.transaction_type === selectedType) : [];
  //   const clientId = this.element.dataset.clientId;

  //   if (clientId) {
  //     try {
  //       const response = await fetch(`/clients/${clientId}/case_options?transaction_type=${selectedType}&timestamp=${Date.now()}`);

  //       if (!response.ok) {
  //         throw new Error(`Fetch error: ${response.statusText}`);
  //       }

  //       const contentType = response.headers.get('content-type');
  //       if (contentType && contentType.includes('text/vnd.turbo-stream.html')) {
  //         const turboStreamContent = await response.text();
  //         this.element.insertAdjacentHTML('beforeend', turboStreamContent);
  //       } else {
  //         const jsonData = await response.json();
  //         this.caseInfoFieldTarget.innerHTML = '';

  //         for (const caseData of jsonData.cases) {
  //           const option = document.createElement('option');
  //           option.value = caseData.id;
  //           option.text = caseData.court;
  //           this.caseInfoFieldTarget.appendChild(option);
  //         }


  //         console.log('caseIdFieldTarget:', this.caseIdFieldTarget);
  //         const selectElement = this.caseIdFieldTarget.querySelector('select');
  //         console.log('selectElement:', selectElement);
  //         if (selectElement) {
  //           selectElement.value = selectedCaseId;
  //         }

  //       }
  //     } catch (error) {
  //       console.error('Error fetching case options:', error.message);
  //       this.caseInfoFieldTarget.innerHTML = '<option value="">Error loading case options</option>';
  //     }
  //   }
  // }
  async fetchCaseOptions(selectedCaseId) {
    const selectedType = this.transactionTypeFieldTarget.querySelector('select').value;
    const clientId = this.element.dataset.clientId;
    console.log('Fetch URL:', `/clients/${clientId}/case_options?transaction_type=${selectedType}&selected_case_id=${selectedCaseId}&timestamp=${Date.now()}`);

    if (clientId) {
      try {
        let url = `/clients/${clientId}/case_options?transaction_type=${selectedType}&timestamp=${Date.now()}`;

        // If a selectedCaseId is provided, append it to the URL
        if (selectedCaseId) {
          url += `&selected_case_id=${selectedCaseId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Fetch error: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/vnd.turbo-stream.html')) {
          const turboStreamContent = await response.text();
          this.element.insertAdjacentHTML('beforeend', turboStreamContent);
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
        console.error('Error fetching case options:', error.message);
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
      this.updateFields(); // Always update fields when a case is selected
    } else {
      console.log('No case selected.');
      // Handle the case where no case is selected, e.g., reset fields or display a message
    }
  }

}
