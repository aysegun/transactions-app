import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "ratio", "amount", "selection", "ratio_2", "amount_2"]

  connect() {
    this.originalAmount = parseFloat(this.amountTarget.value);
  }

  updateAmount() {
    this.calculateAmount();
  }

  calculateAmount() {
    const selectedRatio = this.ratioTarget.value;

    console.log("calculateAmount called");
    console.log("Original Amount:", this.originalAmount);
    console.log("Selected Ratio:", selectedRatio);

    const ratioMap = {
      '9,1%': 0.091,
      '4,55%': 0.0455,
      '2,7%': 0.027,
      'none': 1,
    };

    const ratioMapValue = ratioMap[selectedRatio];

    console.log("Ratio Map Value:", ratioMapValue);

    if (ratioMapValue !== undefined) {
      let calculatedAmount;

      if (selectedRatio === 'none') {
        calculatedAmount = this.originalAmount;
      } else {
        const calculatedAmountBeforeFix = this.originalAmount * ratioMapValue;
        console.log("Calculated Amount Before Fix:", calculatedAmountBeforeFix);
        calculatedAmount = calculatedAmountBeforeFix.toFixed(2);
      }

      console.log("Calculated Amount:", calculatedAmount);

      this.amountTarget.value = calculatedAmount;

      // if (!this.dependentValue) {
      //   this.originalAmount = calculatedAmount;
      // }
    } else {
      console.error("Ratio is not truthy. Skipping calculation.");
    }
  }
  // calculateAmount(event) {
  //   const selectedRatio = this.ratioTarget.value;
  //   const selectedRatio_2 = this.ratio_2Target.value;

  //   // Calculate amount for the first row based on selectedRatio_1
  //   let originalAmount;
  //   if (selectedRatio === 'none') {
  //     originalAmount = parseFloat(this.amountTarget.value);
  //   } else {
  //     originalAmount = parseFloat(this.amountTarget.value) * ratioValue(selectedRatio);
  //   }

  //   // Set the calculated amount for the first row
  //   this.amountTarget.value = originalAmount.toFixed(2);

  //   // Calculate amount for the second row based on originalAmount_1 and selectedRatio_2
  //   let originalAmount_2;
  //   if (selectedRatio_2 === 'none') {
  //     originalAmount_2 = originalAmount;
  //   } else {
  //     originalAmount_2 = originalAmount * ratioValue(selectedRatio_2);
  //   }

  //   // Set the calculated amount for the second row
  //   this.amount_2Target.value = originalAmount_2.toFixed(2);
  // }

  // ratioValue(selectedRatio) {
  //   const ratioMap = {
  //     '9,1%': 0.091,
  //     '4,55%': 0.0455,
  //     '2,7%': 0.027,
  //     'none': 1,
  //   };

  //   return ratioMap[selectedRatio];
  // }

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
