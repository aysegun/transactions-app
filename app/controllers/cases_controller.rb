class CasesController < ApplicationController
  before_action :set_client, only: %i[new create]

  def new
    @case = @client.cases.new
  end

  def index
    if params[:client_id].present?
      @client = Client.find(params[:client_id])
      @cases = @client.cases
    else
      @cases = Case.all
    end
  end

  def create
    @case = @client.cases.new(case_params)
    if @case.save
      respond_to do |format|
        format.turbo_stream { redirect_to client_cases_path }
        format.html { redirect_to client_cases_path }
      end
    else
      format.turbo_stream { render turbo_stream: turbo_stream.replace('form-errors', partial: 'shared/form_errors', locals: { resource: @cases }) }
      format.html { render 'new', status: :unprocessable_entity }
    end
  end

  def show
    @case = Case.find(params[:id])
    @collections = @case.collections
    @client = @case.client
    @transactions = @case.transactions
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
