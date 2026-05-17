class Api::V1::ProductsController < ApplicationController
  skip_before_action :authenticate_user!, only: %i[index show]

  def index
    products = Product.all
    products = products.search(params[:keyword]) if params[:keyword].present?
    products = products.by_category(params[:category]) if params[:category].present?
    products = products.in_stock unless params[:include_out_of_stock] == "true"
    products = products.order(created_at: :desc).page(params[:page]).per(params[:per] || 20)

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
    product = Product.find(params[:id])
    render json: { product: product_json(product) }
  end

  private

  def product_json(product)
    {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image_url: product.image_url,
      in_stock: product.stock > 0,
      created_at: product.created_at
    }
  end
end
