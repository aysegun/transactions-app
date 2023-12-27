
document.addEventListener('turbolinks:load', function() {
  const transactionTypeSelect = document.getElementById('transaction_transaction_type');
  const caseDropdown = document.getElementById('transaction_case_id');

  if (transactionTypeSelect && caseDropdown) {
    const updateCaseOptions = function() {
      const selectedType = transactionTypeSelect.value;

      fetch(`/shared/case_options?transaction_type=${selectedType}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then(data => {
          caseDropdown.innerHTML = data;
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
