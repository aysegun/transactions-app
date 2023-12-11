class CasesController < ApplicationController
  before_action :set_client, only: %i[new create]

  def new
    @case = @client.cases.new
  end

  def create
    @case = @client.cases.new(case_params)
    if @case.save
      redirect_to client_path(@client)
    else
      render new, status: :unprocessable_entity
    end
  end

  def show
    @case = Case.find(params[:id])
    @collections = @case.collections
  end

  def edit
    @case = Case.find(params[:id])
  end

  def update
    @case = Case.find(params[:id])
    @client = @case.client
    if @case.update(case_params)
      redirect_to client_path(@case)
    else
      render 'edit', status: :unprocessable_entity
    end
  end

  def destroy
    @case = Case.find(params[:id])
    @client = @case.client
    @case.destroy
    redirect_to client_path(@client), status: :see_other
  end

  private

  def set_client
    @client = Client.find(params[:client_id])
  end

  def case_params
    params.require(:case).permit(:court, :court_number, :client_id)
  end
end
