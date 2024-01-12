class TransactionsController < ApplicationController
  before_action :set_client, only: %i[new create case_options]

  def create
    @transaction = @client.transactions.build(transaction_params)

    if @transaction.save
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

  # def case_options
  #   selected_type = params[:transaction_type]
  #   client_id = params[:client_id]

  #   @cases = Case.where(client_id: client_id)

  #   respond_to do |format|
  #     format.turbo_stream do
  #       render turbo_stream: turbo_stream.replace('case_options') { render plain: '', layout: false }
  #     end
  #     format.json do
  #       options_html = render_to_string(locals: { cases: @cases })
  #       render json: { options_html: options_html }
  #     end
  #   end
  # rescue StandardError => e
  #   Rails.logger.error("Error in case_options: #{e.message}")
  #   render status: :internal_server_error, json: { error: 'Internal Server Error' }
  # end
  def case_options
    selected_type = params[:transaction_type]
    client_id = params[:client_id]

    @cases = Case.where(client_id: client_id)

    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.replace('caseInfoField', html: render_to_string(inline: '<%= render "shared/case_options", collection: @cases %>' )) }
      format.json { render json: { cases: @cases.map { |c| { court: c.court, id: c.id } } } }
    end
  end

  private

  def set_client
    @client = Client.find(params[:client_id])
  end

  def transaction_params
    base_params = %i[amount date transaction_type description court court_number]
    params.require(:transaction).permit(*base_params, transaction_cases_attributes: [:case_id])
  end
end
