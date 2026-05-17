class Api::V1::Admin::ProductsController < Api::V1::Admin::BaseController
  before_action :set_product, only: %i[show update destroy]

  def index
    products = Product.order(created_at: :desc).page(params[:page]).per(params[:per] || 20)
    render json: {
      products: products.map { |p| product_json(p) },
      meta: {
        current_page: products.current_page,
        total_pages: products.total_pages,
        total_count: products.total_count
      }
    }
  end

  def show
    render json: { product: product_json(@product) }
  end

  def create
    product = Product.new(product_params)
    product.image.attach(params[:image]) if params[:image].present?
    product.save!
    render json: { product: product_json(product), message: "商品を作成しました" }, status: :created
  end

  def update
    @product.update!(product_params)
    @product.image.attach(params[:image]) if params[:image].present?
    render json: { product: product_json(@product), message: "商品を更新しました" }
  end

  def destroy
    @product.destroy!
    render json: { message: "商品を削除しました" }
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.permit(:name, :description, :price, :stock, :category)
  end

  def product_json(product)
    {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image_url: product.image_url,
      created_at: product.created_at,
      updated_at: product.updated_at
    }
  end
end
