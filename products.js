let products = [
    {
      "productId": "PET0001",
      "title": "Thức ăn cho chó Pedigree 1.5kg",
      "images": ["pedigree_1.jpg"],
      "description": {
        "details": "Thức ăn dinh dưỡng cho chó trưởng thành, hỗ trợ tiêu hóa và tăng cường miễn dịch."
      },
      "rating": 4.0,
      "additionalInfo": {
        "quantity": 50,
        "price": 150000,
        "brand": "Pedigree",
        "origin": "Thái Lan"
      }
    },
    {
      "productId": "PET0002",
      "title": "Cát vệ sinh cho mèo KitCat 10L",
      "images": ["kitcat_1.jpg"],
      "description": {
        "details": "Cát vệ sinh khử mùi, vón cục tốt, giúp giữ vệ sinh hiệu quả cho mèo."
      },
      "rating": 4.2,
      "QnA": [
        {
          "question": "Loại này có mùi không?",
          "answer": "Khoảng mùi ít, không ảnh hưởng nhiều."
        }
      ],
      "additionalInfo": {
        "quantity": 40,
        "price": 200000,
        "brand": "KitCat",
        "origin": "Singapore"
      }
    },
    {
      "productId": "PET0003",
      "title": "Dây dắt chó có thể thu gọn 5m",
      "images": ["leash_2.jpg"],
      "description": {
        "details": "Dây dắt bằng nylon bền chắc, có thể điều chỉnh độ dài, phù hợp với chó dưới 30kg."
      },
      "rating": 4.5,
      "QnA": [
        {
          "question": "Sản phẩm có bền không?",
          "answer": "Dùng nylon chịu lực tốt."
        }
      ],
      "additionalInfo": {
        "quantity": 30,
        "price": 250000,
        "brand": "Flexi",
        "origin": "Đức"
      }
    },
    {
      "productId": "PET0004",
      "title": "Pate cho mèo Whiskas 85g",
      "images": ["whiskas_pate_1.jpg", "whiskas_pate_2.jpg"],
      "description": {
        "details": "Pate thịt bò bổ sung dưỡng chất cho mèo, hỗ trợ hệ tiêu hóa và lông mượt."
      },
      "rating": 4.2,
      "QnA": [
        {
          "question": "Pate này có phù hợp cho mèo con không?",
          "answer": "Có thể dùng cho mèo từ 2 tháng tuổi."
        },
        {
          "question": "Sản phẩm có cần bảo quản lạnh không?",
          "answer": "Không cần, nhưng nên để nơi thoáng mát."
        }
      ],
      "additionalInfo": {
        "quantity": 100,
        "price": 25000,
        "brand": "Whiskas",
        "origin": "Mỹ"
      }
    },
    {
      "productId": "PET0005",
      "title": "Lồng vận chuyển thú cưng size M",
      "images": ["carrier_1.jpg", "carrier_2.jpg"],
      "description": {
        "details": "Lồng vận chuyển có tay cầm chắc chắn, thông thoáng, phù hợp với chó và mèo."
      },
      "rating": 4.3,
      "QnA": [
        {
          "question": "Kích thước phù hợp cho chó bao nhiêu kg?",
          "answer": "Khoảng 7-10kg."
        }
      ],
      "additionalInfo": {
        "quantity": 20,
        "price": 450000,
        "brand": "PetCargo",
        "origin": "Việt Nam"
      }
    },
    {
      "productId": "PET0006",
      "title": "Thức ăn cho mèo Royal Canin 2kg",
      "images": [],
      "description": {
        "details": "Thức ăn khô giàu dinh dưỡng, giúp lông mèo mềm mượt và hỗ trợ tiêu hóa."
      },
      "rating": 4.8,
      "additionalInfo": {
        "quantity": 35,
        "price": 320000,
        "brand": "Royal Canin",
        "origin": "Pháp"
      }
    },
    {
      "productId": "PET0007",
      "title": "Bánh thưởng cho chó vị gà 500g",
      "images": ["dog_treats_1.jpg"],
      "description": {
        "details": "Bánh thưởng giúp huấn luyện chó, hương vị thơm ngon, dễ tiêu hóa."
      },
      "rating": 4.3,
      "QnA": [
        {
          "question": "Có phù hợp chó con không?",
          "answer": "Dùng được cho chó từ 2 tháng tuổi."
        }
      ],
      "additionalInfo": {
        "quantity": 60,
        "price": 180000,
        "brand": "DoggyMan",
        "origin": "Nhật Bản"
      }
    },
    {
      "productId": "PET0008",
      "title": "Chuồng chó size L",
      "images": ["dog_cage_1.jpg", "dog_cage_2.jpg"],
      "description": {
        "details": "Chuồng chó bằng sắt chắc chắn, dễ vệ sinh, phù hợp với chó trung bình."
      },
      "rating": 4.7,
      "QnA": [
        {
          "question": "Chuồng có khóa an toàn không?",
          "answer": "Có khóa 2 lớp rất chắc chắn."
        }
      ],
      "additionalInfo": {
        "quantity": 15,
        "price": 600000,
        "brand": "PetCage",
        "origin": "Việt Nam"
      }
    },
    {
      "productId": "PET0009",
      "title": "Cát vệ sinh hữu cơ cho mèo 5L",
      "images": ["organic_litter_1.jpg", "organic_litter_2.jpg"],
      "description": {
        "details": "Cát vệ sinh hữu cơ thân thiện với môi trường, khử mùi tốt."
      },
      "rating": 4.1,
      "additionalInfo": {
        "quantity": 25,
        "price": 190000,
        "brand": "EcoPet",
        "origin": "Hàn Quốc"
      }
    },
    {
      "productId": "PET0010",
      "title": "Balo vận chuyển mèo có kính",
      "images": ["cat_backpack_1.jpg"],
      "description": {
        "details": "Balo trong suốt giúp thú cưng dễ dàng quan sát bên ngoài, thoáng khí."
      },
      "rating": 4.4,
      "QnA": [
        {
          "question": "Tải trọng tối đa là bao nhiêu?",
          "answer": "Chịu được mèo nặng tới 8kg."
        }
      ],
      "additionalInfo": {
        "quantity": 20,
        "price": 420000,
        "brand": "PetTravel",
        "origin": "Trung Quốc"
      }
    },
    {
      "productId": "PET0011",
      "title": "Thức ăn cho chó SmartHeart 3kg",
      "images": ["smartheart_1.jpg", "smartheart_2.jpg"],
      "description": {
        "details": "Thức ăn hỗ trợ hệ miễn dịch và tiêu hóa cho chó trưởng thành."
      },
      "rating": 4.0,
      "additionalInfo": {
        "quantity": 40,
        "price": 180000,
        "brand": "SmartHeart",
        "origin": "Thái Lan"
      }
    },
    {
      "productId": "PET0012",
      "title": "Cát vệ sinh cho mèo Me-O 5L",
      "images": ["meo_litter_1.jpg", "meo_litter_2.jpg"],
      "description": {
        "details": "Cát vệ sinh không bụi, vón cục nhanh, giúp kiểm soát mùi hiệu quả."
      },
      "rating": 4.1,
      "additionalInfo": {
        "quantity": 35,
        "price": 170000,
        "brand": "Me-O",
        "origin": "Thái Lan"
      }
    },
    {
      "productId": "PET0013",
      "title": "Dây dắt chó da cao cấp",
      "images": ["leash_leather_1.jpg", "leash_leather_2.jpg"],
      "description": {
        "details": "Dây dắt bằng da thật bền chắc, phù hợp với chó lớn."
      },
      "rating": 4.3,
      "additionalInfo": {
        "quantity": 25,
        "price": 300000,
        "brand": "DogLux",
        "origin": "Italy"
      }
    },
    {
      "productId": "PET0014",
      "title": "Pate cho mèo Me-O 80g",
      "images": ["meo_pate_1.jpg", "meo_pate_2.jpg"],
      "description": {
        "details": "Pate cá hồi bổ sung dinh dưỡng, giúp lông mèo khỏe mạnh."
      },
      "rating": 4.2,
      "additionalInfo": {
        "quantity": 90,
        "price": 27000,
        "brand": "Me-O",
        "origin": "Thái Lan"
      }
    },
    {
      "productId": "PET0015",
      "title": "Lồng vận chuyển thú cưng size L",
      "images": ["carrier_large_pg1.jpg", "carrier_large_pg2.jpg"],
      "description": {
        "details": "Lồng vận chuyển cỡ lớn, thoáng khí, phù hợp với chó lớn và mèo béo."
      },
      "rating": 4.6,
      "QnA": [
        {
          "question": "Bao lâu thì cần thay mới?",
          "answer": "Khoảng 1 năm nếu dùng thường xuyên."
        }
      ],
      "additionalInfo": {
        "quantity": 15,
        "price": 550000,
        "brand": "PetGo",
        "origin": "Việt Nam"
      }
    },
    {
      "productId": "PET0016",
      "title": "Thức ăn cho mèo Me-O 1.5kg",
      "images": ["meo_dry_1.jpg"],
      "description": {
        "details": "Thức ăn dinh dưỡng dành cho mèo con và mèo trưởng thành."
      },
      "rating": 4.0,
      "additionalInfo": {
        "quantity": 40,
        "price": 220000,
        "brand": "Me-O",
        "origin": "Thái Lan"
      }
    },
    {
      "productId": "PET0017",
      "title": "Bánh thưởng cho mèo vị cá 200g",
      "images": ["cat_treats_1.jpg", "cat_treats_2.png"],
      "description": {
        "details": "Bánh thưởng giúp huấn luyện mèo, hương vị cá hồi thơm ngon."
      },
      "rating": 4.1,
      "additionalInfo": {
        "quantity": 50,
        "price": 90000,
        "brand": "CattyMan",
        "origin": "Nhật Bản"
      }
    },
    {
      "productId": "PET0018",
      "title": "Chuồng mèo hai tầng",
      "images": ["cat_cage_1.png"],
      "description": {
        "details": "Chuồng mèo bằng sắt, có hai tầng rộng rãi, dễ vệ sinh."
      },
      "rating": 4.3,
      "additionalInfo": {
        "quantity": 10,
        "price": 700000,
        "brand": "PetCage",
        "origin": "Việt Nam"
      }
    },
    {
      "productId": "PET0019",
      "title": "Cát vệ sinh hữu cơ cho mèo 10L",
      "images": ["organic_litter_large_1.jpg", "organic_litter_large_2.png"],
      "description": {
        "details": "Cát hữu cơ khử mùi tốt, dễ phân hủy, an toàn cho thú cưng."
      },
      "rating": 4.1,
      "additionalInfo": {
        "quantity": 20,
        "price": 260000,
        "brand": "Cat's Best",
        "origin": "Đức"
      }
    },
    {
      "productId": "PET0020",
      "title": "Balo vận chuyển chó nhỏ có lưới thoáng khí",
      "images": ["dog_backpack_1.jpg", "dog_backpack_2.png"],
      "description": {
        "details": "Balo có lưới thoáng khí, phù hợp cho chó nhỏ dưới 5kg."
      },
      "rating": 4.3,
      "additionalInfo": {
        "quantity": 15,
        "price": 390000,
        "brand": "PetTravel",
        "origin": "Trung Quốc"
      }
    },
    {
      "productId": "PET0021",
      "title": "Giường nệm cho chó size M",
      "images": ["dog_bed_1.jpg"],
      "description": {
        "details": "Giường nệm êm ái, giữ ấm cho chó, dễ vệ sinh."
      },
      "rating": 4.0,
      "additionalInfo": {
        "quantity": 30,
        "price": 350000,
        "brand": "ComfyPet",
        "origin": "Việt Nam"
      }
    },
    {
      "productId": "PET0022",
      "title": "Cây cào móng cho mèo",
      "images": ["cat_scratcher_1.jpg"],
      "description": {
        "details": "Cây cào móng giúp mèo giải trí và bảo vệ nội thất."
      },
      "rating": 4.1,
      "additionalInfo": {
        "quantity": 20,
        "price": 280000,
        "brand": "CatFun",
        "origin": "Trung Quốc"
      }
    },
    {
      "productId": "PET0023",
      "title": "Dụng cụ cắt móng cho chó mèo",
      "images": ["nail_clipper_1.jpg", "nail_clipper_2.jpg"],
      "description": {
        "details": "Dụng cụ cắt móng sắc bén, an toàn cho chó mèo."
      },
      "rating": 4.0,
      "additionalInfo": {
        "quantity": 50,
        "price": 120000,
        "brand": "PetCare",
        "origin": "Mỹ"
      }
    },
    {
      "productId": "PET0024",
      "title": "Sữa tắm cho chó lông trắng",
      "images": ["dog_shampoo_1.jpg"],
      "description": {
        "details": "Sữa tắm làm sạch và giữ màu lông trắng sáng."
      },
      "rating": 4.1,
      "additionalInfo": {
        "quantity": 40,
        "price": 180000,
        "brand": "Dorrikey"
      }
    },
    {
      "productId": "PET0025",
      "title": "Sữa tắm cho mèo khử mùi",
      "images": [],
      "description": {
        "details": "Sữa tắm giúp khử mùi, làm mềm lông mèo."
      },
      "rating": 4.5,
      "QnA": [
        {
          "question": "Có phù hợp với mèo con không?",
          "answer": "An toàn cho mèo từ 3 tháng tuổi."
        }
      ],
      "additionalInfo": {
        "quantity": 40,
        "price": 190000,
        "brand": "FurCare",
        "origin": "Hàn Quốc"
      }
    },
    {
      "productId": "PET0026",
      "title": "Xương gặm giúp sạch răng cho chó",
      "images": ["dog_bone_1.jpg"],
      "description": {
        "details": "Xương gặm giúp làm sạch răng, giảm mảng bám cho chó."
      },
      "rating": 4.0,
      "additionalInfo": {
        "quantity": 60,
        "price": 130000,
        "brand": "Vegabrand"
      }
    },
    {
      "productId": "PET0027",
      "title": "Đồ chơi bóng chuông cho mèo",
      "images": ["cat_toy_1.jpg", "cat_toy_2.jpg"],
      "description": {
        "details": "Bóng chuông kích thích sự vui chơi của mèo."
      },
      "rating": 4.0,
      "additionalInfo": {
        "quantity": 50,
        "price": 50000,
        "brand": "KittyPlay",
        "origin": "Trung Quốc"
      }
    },
    {
      "productId": "PET0028",
      "title": "Máy lọc nước tự động cho chó mèo",
      "images": ["water_fountain_1.jpg", "water_fountain_2.jpg"],
      "description": {
        "details": "Máy lọc nước giúp thú cưng có nước sạch liên tục."
      },
      "rating": 4.1,
      "additionalInfo": {
        "quantity": 25,
        "price": 550000,
        "brand": "PetWater",
        "origin": "Mỹ"
      }
    },
    {
      "productId": "PET0029",
      "title": "Đệm nằm cho mèo size S",
      "images": ["cat_bed_1.jpg"],
      "description": {
        "details": "Đệm nằm êm ái, phù hợp với mèo nhỏ và mèo con."
      },
      "rating": 4.0,
      "additionalInfo": {
        "quantity": 30,
        "price": 270000,
        "brand": "ComfyPet",
        "origin": "Việt Nam"
      }
    },
    {
      "productId": "PET0030",
      "title": "Bát ăn chống trượt cho chó mèo",
      "images": ["pet_bowl_1.jpg"],
      "description": {
        "details": "Bát ăn chống trượt, dễ vệ sinh, phù hợp cho chó mèo."
      },
      "rating": 4.0,
      "additionalInfo": {
        "quantity": 50,
        "price": 90000,
        "brand": "PetBowl",
        "origin": "Thái Lan"
      }
    }
];    


function output(products) {
  console.log("\nDanh sách sản phẩm:");
  products.forEach(product => {
    console.log('ID:', product.productId);
    console.log('Name:', product.title);
    console.log('Images:', product.images.length > 0 ? product.images.join(', ') : 'No images available');
    console.log('Description:', product.description.details);
    console.log('Rating:', product.rating);
    console.log('Quantity:', product.additionalInfo.quantity);
    console.log('Price:', product.additionalInfo.price);
    console.log('Brand:', product.additionalInfo.brand);
    console.log('Origin:', product.additionalInfo.origin);
    if (product.QnA && product.QnA.length > 0) {
      console.log('QnA:');
      product.QnA.forEach((qa, index) => {
        console.log(`  Q${index + 1}: ${qa.question}`);
        console.log(`  A${index + 1}: ${qa.answer}`);
      });
    } else {
      console.log('QnA: No QnA available');
    }
    console.log('----------------------------------');
  });
}

function addProduct(products, newProduct) {
    products.push(newProduct);
    console.log(`Đã thêm sản phẩm mới (ID: ${newProduct.productId}) vào danh sách thành công!`);
    return products;
}

module.exports = {
    output,
    addProduct,
    products
};