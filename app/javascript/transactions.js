
document.addEventListener('turbolinks:load', function() {
  const transactionType = document.getElementById('transaction_transaction_type');
  const caseDropdown = document.getElementById('transaction_case_id');

  if (transactionType) {
    transactionType.addEventListener('change', function() {
      const selectedType = transactionType.value;

      fetch('/shared/case_options?transaction_type=' + selectedType)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(data => {
          caseDropdown.innerHTML = data;
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    });
  }
});
