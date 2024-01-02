// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"

import DisableButtonController from "./controllers/transaction_formcontroller.js"
Stimulus.register("transaction-form", TransactionFormController)
