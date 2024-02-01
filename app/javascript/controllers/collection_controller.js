import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "ratio", "amount", "selection"]

  connect() {
    console.log("Ratio Targets:", this.ratioTargets);
    this.originalAmounts = [];
    const amountTargets = Array.from(this.element.querySelectorAll('[data-collection-target="amount"]'));
    amountTargets.forEach((amountTarget, index) => {
        const originalAmount = parseFloat(amountTarget.value);
        console.log(`Original Amount ${index}:`, originalAmount);
        this.originalAmounts[index] = originalAmount;
    });
  }


  updateAmount() {
    this.calculateAmount();
  }

  calculateAmount(event) {

    // const index = event.target.getAttribute('data-index');
    // const row = event.target.getAttribute('data-row');
    const index = event.target.dataset.index;
    const row = event.target.dataset.row;
    console.log("Index and Row:", index, row);

    if (!this.ratioTargets || this.ratioTargets.length === 0) {
      console.error("Ratio targets not yet populated. Skipping calculation.");
      return;
    }

    // const selectedRatio = this.ratioTargets[index].value;
    const selectedRatio = this.element.querySelector(`[data-collection-target="ratio"][data-index="${index}"][data-row="${row}"]`).value;

    console.log("calculateAmount called");
    console.log("Original Amount:", this.originalAmounts[index]);
    console.log("Selected Ratio:", selectedRatio);
    console.log("Index:", index);
    console.log("Row:", row);

    // const amountTarget = this.amountTargets.find(target => target.dataset.index === index && target.dataset.row === row);
    const amountTarget = this.element.querySelector(`[data-collection-target="amount"][data-index="${index}"][data-row="${row}"]`);

    if (!amountTarget) {
      console.error("Amount target not found. Index:", index, "Row:", row);
      return;
    }

    const originalAmount = parseFloat(amountTarget.value);
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

      amountTarget.value = calculatedAmount.toFixed(2);

    } else {
      console.error("Ratio is not truthy. Skipping calculation.");
    }
  }

  updateTable() {
    const selectedCollectionId = this.selectionTarget.value;
    const clientId = this.data.get("clientId");
    const caseId = this.data.get("caseId");

    console.log("updateTable called");
    console.log("Selected Collection ID:", selectedCollectionId);
    console.log("Client ID:", clientId);
    console.log("Case ID:", caseId);

    fetch(`/clients/${clientId}/cases/${caseId}/collections/${selectedCollectionId}`)
    .then(response => {
    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
    return response.json();
    })
    .then(data => {
      if (data) {
        const collectionData = data;
        const calculatedValue = collectionData.calculateAmount();
        console.log("Calculated Value:", calculatedValue);
    } else {
        console.error("Empty JSON response received");
    }
  })

  }
}
