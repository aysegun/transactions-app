class CollectionsController < ApplicationController
  before_action :set_case, only: %i[new create]

  def index
    @collections = Collection.all
  end

  def new
    @collection = @case.collections.build
  end

  def show
    @collection = Collection.find(params[:id])
    @case = @collection.case
    @client = @case&.client

    render json: @collection
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: e.message }, status: :not_found
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def create
    @collection = @case.collections.build(collection_params)
    if @collection.save
      redirect_to client_case_path(@case.client, @case)
    else
      render 'new', status: :unprocessable_entity
    end
  end

  private

  def set_case
    @case = Case.find(params[:case_id])
  end

  def collection_params
    params.require(:collection).permit(:date, :description, :amount)
  end
end
