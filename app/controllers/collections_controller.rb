class CollectionsController < ApplicationController
  before_action :set_case, only: %i[new create]

  def index
    @collections = Collection.all
  end

  def new
    @collection = @case.collections.build
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
