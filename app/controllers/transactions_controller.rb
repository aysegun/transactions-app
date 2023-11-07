class TransactionsController < ApplicationController
  before_action :set_client, only: %i[new create]

  def create
    @transaction = @client.transactions.build(transaction_params)
    if @transaction.save
      if @transaction.transaction_type == 'expense'
        @case = Case.create(court: params[:transaction][:court], court_number: params[:transaction][:court_number], client: @client)
        @transaction.update(case: @case)
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
    params.require(:transaction).permit(:amount, :date, :transaction_type, :description, :court, :court_number)
  end
end
