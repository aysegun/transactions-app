class ClientsController < ApplicationController
  def new
    @client = Client.new
  end

  def index
    @clients = Client.all
  end

  def show
    @client = Client.find(params[:id])
    @transactions = @client.transactions
    @expenses = @transactions.where(transaction_type: 'expense')
    @payments = @transactions.where(transaction_type: 'payment')
  end

  def create
    @client = Client.new(client_params)

    if @client.save

      redirect_to clients_path
    else
      render :new
    end
  end

  def destroy
    @client = Client.find(params[:id])
    @client.destroy

    redirect_to clients_path, status: :see_other
  end

  private

  def client_params
    params.require(:client).permit(:first_name, :last_name)
  end
end
