class ClientsController < ApplicationController
  before_action :set_client, only: %i[show edit update destroy]

  def new
    @client = Client.new
  end

  def index
    @clients = Client.all

    if params[:query].present?
      sql_query = 'first_name ILIKE :query OR last_name ILIKE :query'
      @clients = Client.where(sql_query, query: "%#{params[:query]}%")
    else
      @clients = Client.all
    end
  end

  def show
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

  def edit; end

  def update
    if @client.update(client_params)
      redirect_to client_path
    else
      render edit
    end
  end

  def destroy
    @client.destroy

    redirect_to clients_path, status: :see_other
  end

  private

  def set_client
    @client = Client.find(params[:id])
  end

  def client_params
    params.require(:client).permit(:first_name, :last_name)
  end
end
