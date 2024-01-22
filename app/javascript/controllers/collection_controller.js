import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "ratio", "amount"]

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
    } else {
      console.error("Ratio is not truthy. Skipping calculation.");
    }
  }

  updateTable(event) {
    const selectedCollectionId = event.target.value;

    console.log("updateTable called");
    console.log("Selected Collection ID:", selectedCollectionId);

    console.log("Fetching data for Collection ID:", selectedCollectionId);
  }
}
