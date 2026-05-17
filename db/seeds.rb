Admin.find_or_create_by!(email: "admin@example.com") do |admin|
  admin.name = "管理者"
  admin.password = "password123"
end

categories = ["トップス", "ボトムス", "アウター", "シューズ", "バッグ", "アクセサリー"]

categories.each_with_index do |category, i|
  3.times do |j|
    Product.find_or_create_by!(name: "#{category} #{j + 1}号") do |p|
      p.description = "高品質な#{category}です。サイズ展開も豊富で使いやすいデザインです。"
      p.price = (rand(1000..30000) / 100 * 100)
      p.stock = rand(5..50)
      p.category = category
    end
  end
end

puts "Seeded: #{Admin.count} admins, #{Product.count} products"