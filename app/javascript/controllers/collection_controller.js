import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "ratio", "amount", "selection", "collectionTable", "transactionParty"];

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
    const selectedRatio = event.target.value;
    const index = event.target.dataset.index; // Extract index from dataset

    if (index === undefined) {
      console.error("Index is undefined");
      return;
    }

    // Assuming the amount associated with each collection is stored on the client side
    const amountElement = this.element.querySelector(`[data-collection-target="amount_${index}"]`);
    if (!amountElement) {
      console.error(`Amount element not found for index ${index}`);
      return;
    }

    let amount = parseFloat(amountElement.textContent); // Retrieve the amount from the DOM or a JavaScript variable

    if (isNaN(amount)) {
      console.error(`Amount is not a valid number for index ${index}`);
      return;
    }

    let calculatedAmount;

    switch (selectedRatio) {
      case '9,1%':
        calculatedAmount = amount * 9.1 / 100;
        break;
      case '4,55%':
        calculatedAmount = amount * 4.55 / 100;
        break;
      case '2,7%':
        calculatedAmount = amount * 2.7 / 100;
        break;
      case 'none':
        calculatedAmount = amount;
        break;
      default:
        calculatedAmount = amount;
    }

    // Assuming this.element is the row element containing the amount and ratio targets
    const amountTarget = this.element.querySelector(`[data-collection-target="amount_${index}"]`);

    // Check if the amountTarget is found before trying to update its textContent
    if (amountTarget) {
      amountTarget.textContent = calculatedAmount.toFixed(2); // Adjust the precision as needed
    } else {
      console.error(`Amount target not found for index ${index}`);
    }
}



  createRow(data, index) {

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <select data-collection-target="transactionParty_${index}">
                <option value="Select">Select</option>
                <option value="Lawyer">Lawyer</option>
                <option value="Client">Client</option>
                <option value="Enforcement Office">Enforcement Office</option>
            </select>
        </td>
        <td>
            <textarea placeholder="Enter notes here" data-collection-target="notes_${index}"></textarea>
        </td>
        <td>
            <select data-collection-target="ratio_${index}" data-action="change->collection#calculateAmount" data-index="${index}">
                <option value="Select">Select Ratio</option>
                <option value="9,1%">9,1%</option>
                <option value="4,55%">4,55%</option>
                <option value="2,7%">2,7%</option>
                <option value="none">none</option>
            </select>
        </td>
        <td data-collection-target="amount_${index}">${data.amount}</td>
        <td><input type="date"></td>
    `;
    return newRow;
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
          console.log("Collection Data:", data);
          const collectionTable = document.querySelector('.collection-calculation-table tbody');
          collectionTable.innerHTML = '';

          const newRow1 = this.createRow(data, 1);
          const newRow2 = this.createRow(data, 2);

          collectionTable.appendChild(newRow1);
          collectionTable.appendChild(newRow2);
        })
    } else {
      console.warn("Client ID, case ID, or collection ID is missing");
    }

  }
}
