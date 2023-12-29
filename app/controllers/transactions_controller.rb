class TransactionsController < ApplicationController
  before_action :set_client, only: %i[new create case_options]

  respond_to :html, :turbo_stream

  def create
    @transaction = @client.transactions.build(transaction_params)

    if @transaction.save
      create_case_for_expense_transaction(@transaction) if @transaction.expense?

      respond_to do |format|
        format.turbo_stream { redirect_to client_path(@client) }
        format.html { redirect_to client_path(@client) }
      end
    else
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace('form-errors', partial: 'shared/form_errors', locals: { resource: @transaction }) }
        format.html { render 'new', status: :unprocessable_entity }
      end
    end
  end

  def new
    @transaction = @client.transactions.build
  end

  def show
    @transaction = Transaction.includes(:transaction_cases).find(params[:id])
  end

  def edit
    @transaction = Transaction.find(params[:id])
  end

  def update
    @transaction = Transaction.find(params[:id])
    @client = @transaction.client

    if @transaction.update(transaction_params)
      redirect_to client_path(@client)
    else
      render 'edit', status: :unprocessable_entity
    end
  end

  def destroy
    @transaction = Transaction.find(params[:id])
    @client = @transaction.client
    @transaction.destroy

    redirect_to client_path(@client), status: :see_other
  end

  private

  def set_client
    @client = Client.find(params[:client_id])
  end

  def transaction_params
    base_params = %i[amount date transaction_type description court court_number]
    params.require(:transaction).permit(*base_params, transaction_cases_attributes: [:case_id])
  end

  def create_case_for_expense_transaction(transaction)
    existing_case = @client.cases.find_by(court: transaction.court, court_number: transaction.court_number)
    if existing_case
      transaction.transaction_cases.create(related_transaction: transaction, case: existing_case)
    else
      new_case = @client.cases.create(
        court: transaction.court,
        court_number: transaction.court_number
      )
      transaction.transaction_cases.create(related_transaction: transaction, case: new_case)
    end
  end
end
