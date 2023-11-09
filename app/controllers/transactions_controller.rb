class TransactionsController < ApplicationController
  before_action :set_client, only: %i[new create]

  def create
    @transaction = @client.transactions.build(transaction_params)
    if @transaction.save
      @transaction.reload
      if @transaction.expense?
        @case = Case.create(
          court: transaction_params[:court],
          court_number: transaction_params[:court_number],
          client: @client
        )
        TransactionCase.create(transaction: @transaction, case: @case)
      end

      redirect_to client_path(@client)
    else
      render 'new', status: :unprocessable_entity
    end
  end

  def new
    @transaction = @client.transactions.build
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
      render edit, status: :unprocessable_entity
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
    base_params = [:amount, :date, :transaction_type, :description]
    specific_params = []

    if params[:transaction] && params[:transaction_type] == 'expense'
      specific_params = [:court, :court_number]
    end

    permitted_params = base_params + specific_params

    params.require(:transaction).permit(*permitted_params)
  end
end
