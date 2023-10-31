class TransactionsController < ApplicationController

  def create
    @client = Client.find(params[:client_id])
    @transaction = Transaction.new

    if transaction.save
      redirect_to client_path(@client)
    else
      render 'new', status: :unprocessable_entity
  end
end
