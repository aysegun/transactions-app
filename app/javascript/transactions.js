
document.addEventListener('turbolinks:load', function() {
  const transactionTypeSelect = document.getElementById('transaction_transaction_type');
  const caseIdSelect = document.getElementById('transaction_case_id');
  const clientId = document.getElementById('client_id').value;


  if (transactionTypeSelect && caseIdSelect) {
    const updateCaseOptions = function() {
      const selectedType = transactionTypeSelect.value;
      const selectedCaseId = caseIdSelect.value;

      fetch(`/transactions/case_options?transaction_type=${selectedType}&case_id=${selectedCaseId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then(data => {
          caseIdSelect.innerHTML = data;
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    };

    transactionTypeSelect.addEventListener('change', updateCaseOptions);

    document.addEventListener('turbolinks:before-cache', function() {
      transactionTypeSelect.removeEventListener('change', updateCaseOptions);
    });
  }
});
