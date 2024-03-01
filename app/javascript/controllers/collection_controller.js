import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "ratio", "amount", "selection", "collectionTable", "transactionParty", "collectionTitle"];

  connect() {
    console.log("Ratio Targets:", this.ratioTargets);

    this.originalAmounts = [];

    const amountTargets = Array.from(this.element.querySelectorAll('[data-collection-target="amount"]'));
    amountTargets.forEach((amountTarget, index) => {
        const originalAmount = parseFloat(amountTarget.textContent);
        if (!isNaN(originalAmount)) {
          console.log(`Initialization - Original Amount ${index}:`, originalAmount);
          this.originalAmounts[index] = originalAmount;
        } else {
          console.error(`Original amount is not a valid number for index ${index}`, amountTarget.textContent);
        }
    });
  }

  calculateAmount(event) {
    const selectedRatio = event.target.value;
    const index = event.target.dataset.index;

    if (index === undefined) {
        console.error("Index is undefined");
        return;
    }

    const amountElement = this.element.querySelector(`[data-collection-target="amount_${index}"]`);

    if (!amountElement) {
        console.error(`Amount element not found for index ${index}`);
        return;
    }

    const originalAmount = parseFloat(amountElement.dataset.originalAmount);

    if (isNaN(originalAmount)) {
        console.error(`Original amount is not a valid number for index ${index}`);
        return;
    }

    let calculatedAmount;

    switch (selectedRatio) {
        case '9,1%':
            calculatedAmount = originalAmount * 9.1 / 100;
            break;
        case '4,55%':
            calculatedAmount = originalAmount * 4.55 / 100;
            break;
        case '2,7%':
            calculatedAmount = originalAmount * 2.7 / 100;
            break;
        case 'none':
            calculatedAmount = originalAmount;
            break;
        default:
            calculatedAmount = originalAmount;
    }

    const amountTarget = this.element.querySelector(`[data-collection-target="amount_${index}"]`);

    if (amountTarget) {
        amountTarget.textContent = calculatedAmount.toFixed(2);
    } else {
        console.error(`Amount target not found for index ${index}`);
    }
  }

  createRow(data, index, description, transactionParty, ratioOptions) {

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${transactionParty}</td>
        <td>${description}</td>
        <td>
            <select data-collection-target="ratio_${index}" data-action="change->collection#calculateAmount" data-index="${index}">
                <option value="Select">Select Ratio</option>
                ${ratioOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
        </td>
        <td data-collection-target="amount_${index}" data-original-amount="${data.amount}">${data.amount}</td>
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

          const newRow1 = this.createRow(data, 1, "Collection Fee", "Enforcement Office", [
            { value: "9,1%", label: "9,1%" },
            { value: "4,55%", label: "4,55%" },
            { value: "2,7%", label: "2,7%" },
            { value: "none", label: "none" }
          ]);
          const newRow2 = this.createRow(data, 2, "Prison Fee", "Enforcement Office", [
            { value: "9,1%", label: "9,1%" },
            { value: "4,55%", label: "4,55%" },
            { value: "2,7%", label: "2,7%" },
            { value: "none", label: "none" }
          ]);
          const newRow3 = this.createRow(data, 3, "Legal Fee", "Lawyer", [
            { value: "10%", label: "10%" },
            { value: "15%", label: "15%" },
            { value: "20%", label: "20%" },
            { value: "none", label: "none" }
          ]);

          collectionTable.appendChild(newRow1);
          collectionTable.appendChild(newRow2);
          collectionTable.appendChild(newRow3);
        })
    } else {
      console.warn("Client ID, case ID, or collection ID is missing");
    }

  }
}
