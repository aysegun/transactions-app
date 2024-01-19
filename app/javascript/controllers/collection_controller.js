import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="collection"
export default class extends Controller {
  static targets = [ "ratio", "amount"]

  connect() {
    this.calculateAmount();
  }

  updateAmount() {
    this.calculateAmount();
  }
  calculateAmount() {
    const originalAmount = parseFloat(this.amountTarget.value);
    const selectedRatio = this.ratioTarget.value;

    console.log("calculateAmount called");
    console.log("Original Amount:", originalAmount);
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
      const calculatedAmountBeforeFix = originalAmount * ratioMapValue;
      console.log("Calculated Amount Before Fix:", calculatedAmountBeforeFix);

      const calculatedAmount = calculatedAmountBeforeFix.toFixed(2);

      console.log("Calculated Amount:", calculatedAmount);

      this.amountTarget.value = calculatedAmount;
    } else {
      console.error("Ratio is not truthy. Skipping calculation.");
    }
  }

}
