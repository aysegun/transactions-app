import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "ratio", "amount", "selection"];

  connect() {
    console.log("Ratio Targets:", this.ratioTargets);
    this.originalAmounts = [];

    const amountTargets = Array.from(this.element.querySelectorAll('[data-collection-target="amount"]'));
    amountTargets.forEach((amountTarget, index) => {
        const originalAmount = parseFloat(amountTarget.value);
        console.log(`Initialization - Original Amount ${index}:`, originalAmount);
        this.originalAmounts[index] = originalAmount;
    });
  }

  calculateAmount(event) {

    const index = event.target.dataset.index;
    const row = event.target.dataset.row;
    console.log("Index and Row:", index, row);

    if (!this.ratioTargets || this.ratioTargets.length === 0) {
      console.error("Ratio targets not yet populated. Skipping calculation.");
      return;
    }

    const selectedRatio = this.element.querySelector(`[data-collection-target="ratio"][data-index="${index}"][data-row="${row}"]`).value;

    console.log("calculateAmount called");
    console.log("Original Amount:", this.originalAmounts[index]);
    console.log("Selected Ratio:", selectedRatio);
    console.log("Index:", index);
    console.log("Row:", row);

    const amountTarget = this.element.querySelector(`[data-collection-target="amount"][data-index="${index}"][data-row="${row}"]`);

    if (!amountTarget) {
      console.error("Amount target not found. Index:", index, "Row:", row);
      return;
    }

    const originalAmount = parseFloat(amountTarget.value) || 0;
    console.log("Amount target:", amountTarget.value);
    console.log("Original Amount:", originalAmount);


    const ratioMap = {
      '9,1%': 0.091,
      '4,55%': 0.0455,
      '2,7%': 0.027,
      'none': 1,
    };

    const ratioMapValue = ratioMap[selectedRatio];

    console.log("Ratio Map Value:", ratioMapValue);

    if (!isNaN(originalAmount) && ratioMapValue !== undefined) {
      let calculatedAmount;

      if (selectedRatio === 'none') {
        calculatedAmount = this.originalAmounts[index];

      } else {
        const calculatedAmountBeforeFix = this.originalAmounts[index] * ratioMapValue;
        console.log("Calculated Amount Before Fix:", calculatedAmountBeforeFix);
        calculatedAmount = parseFloat(calculatedAmountBeforeFix.toFixed(2));
      }

      console.log("Calculated Amount:", calculatedAmount);

      this.setValue(amountTarget, calculatedAmount);

    } else {
      console.error("Ratio is not truthy. Skipping calculation.");
    }
  }
  setValue(target, value) {
    target.value = value;
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }


  updateTable() {
    const selectedCollectionId = this.selectionTarget.value;
    const clientId = this.element.getAttribute("data-client-id");
    const caseId = this.element.getAttribute("data-case-id");

    console.log("updateTable called");
    console.log("Selected Collection ID:", selectedCollectionId);
    console.log("Client ID:", clientId);
    console.log("Case ID:", caseId);

    if (clientId && caseId && selectedCollectionId) {
      fetch(`/clients/${clientId}/cases/${caseId}/collections/${selectedCollectionId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {

          this.selectionTarget.insertAdjacentHTML('afterend', data);
        })
        .catch(error => {
          console.error("Error fetching collection data:", error.message);
        });
    } else {
      console.warn("Client ID, case ID, or collection ID is missing");
    }
  }
}