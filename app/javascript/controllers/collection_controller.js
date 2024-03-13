import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "ratio", "amount", "selection", "collectionTable", "transactionParty", "collectionTitle", "totalAmount"];

  connect() {
    console.log("Ratio Targets:", this.ratioTargets);
    console.log("Amount Targets:", this.amountTargets);

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
        case '10%':
            calculatedAmount = originalAmount * 10 / 100;
            break;
        case '15%':
            calculatedAmount = originalAmount * 15 / 100;
            break;
        case '20%':
            calculatedAmount = originalAmount * 20 / 100;
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
        // amountTarget.dataset.originalAmount = calculatedAmount.toFixed(2);
    } else {
        console.error(`Amount target not found for index ${index}`);
    }
  }

  updateTitle(collectionTitleElement, selectedCollection, amount) {
    if (selectedCollection) {
        collectionTitleElement.innerHTML = `<p>Collection for id: ${selectedCollection} - Amount: ${amount}</p>`;
    } else {
        collectionTitleElement.innerHTML = `<p>No collection selected</p>`;
    }
  }

  createRow(data, index, description, transactionParty, ratioOptions, amountTargetId) {
    console.log(`Creating row for index ${index}`);
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${transactionParty}</td>
        <td>${description}</td>
        ${index !== 4 && index !== 3 ? `<td>
            <select data-collection-target="ratio_${index}" data-action="change->collection#calculateAmount" data-index="${index}">
                <option value="Select">Select Ratio</option>
                ${ratioOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
        </td>` : `<td> - </td>`}
        <td data-collection-target="${amountTargetId}" data-original-amount="${index !== 4 && index !== 3 ? data.amount : ''}">
            ${index !== 4 && index !== 3 ? data.amount : `<input type="text" placeholder="Enter Amount" data-user-input="amount_${index}">`}
        </td>
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
      const collectionTitleElement = document.querySelector('[data-collection-target="collectionTitle"]');
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
          ],"amount_1");
          const newRow2 = this.createRow(data, 2, "Prison Fee", "Enforcement Office", [
            { value: "9,1%", label: "9,1%" },
            { value: "4,55%", label: "4,55%" },
            { value: "2,7%", label: "2,7%" },
            { value: "none", label: "none" }
          ], "amount_2");
          const newRow3 = this.createRow(data, 3, "Legal Fee", "Lawyer", [
            { value: "10%", label: "10%" },
            { value: "15%", label: "15%" },
            { value: "20%", label: "20%" },
            { value: "none", label: "none" }
          ],"amount_3");
          const newRow4 = this.createRow(data, 4, "Attorney Fee", "Lawyer", [
            { value: "10%", label: "10%" },
            { value: "15%", label: "15%" },
            { value: "20%", label: "20%" },
            { value: "none", label: "none" }
          ], "amount_4");
          const newRow5 = this.createRow(data, 5, "Collection Fee-Lawyer", "Lawyer", [
            { value: "10%", label: "10%" },
            { value: "15%", label: "15%" },
            { value: "20%", label: "20%" },
            { value: "none", label: "none" }
          ],"amount_5");

          collectionTable.appendChild(newRow1);
          collectionTable.appendChild(newRow2);
          collectionTable.appendChild(newRow3);
          collectionTable.appendChild(newRow4);
          collectionTable.appendChild(newRow5);

          this.updateTitle(collectionTitleElement, selectedCollectionId, data.amount);
          this.sumAmounts();
        })
        .catch(error => {
          console.error("Error fetching collection data:", error);
        });
    } else {
      console.warn("Client ID, case ID, or collection ID is missing");
    }

  }

  sumAmounts() {
    console.log("Amount Targets:", this.amountTargets);

    let totalAmount = 0;
    const amountElements = this.amountTargets;

    amountElements.forEach(amountElement => {
      const amountText = amountElement.textContent.trim();
      console.log('Amount Text:', amountText);
      const amount = parseFloat(amountText);
      console.log('Parsed Amount:', amount);
      if (!isNaN(amount)) {
          totalAmount += amount;
      }
    });

    console.log('Total Amount Before Formatting:', totalAmount);

    const totalAmountElement = document.getElementById('totalAmount');
    if (totalAmountElement) {
        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    console.log('Total Amount:', totalAmount);
  }
}
