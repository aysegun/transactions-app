class TransactionsController < ApplicationController
  before_action :set_client, only: %i[new create]

  def create
    @transaction = @client.transactions.build(transaction_params)
    if @transaction.save
      redirect_to client_path(@client)
    else
      render 'new', status: :unprocessable_entity
    end
  end

  def new
    @transaction = @client.transactions.build
  end

  private

  def set_client
    @client = Client.find(params[:client_id])
  end

  def transaction_params
    params.require(:transaction).permit(:amount, :date, :transaction_type, :description)
  end
end
