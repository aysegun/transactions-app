class TransactionsController < ApplicationController
  before_action :set_transaction, only: %i[new]

  def create
    @client = Client.find(params[:client_id])
    @transaction = Transaction.new

    if transaction.save
      redirect_to client_path(@client)
    else
      render 'new', status: :unprocessable_entity
    end
  end

  def new; end

  private

  def set_transaction
    @transaction = Transaction.new
  end
end
