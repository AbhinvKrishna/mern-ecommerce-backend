const {Product} = require('../model/product')

// Creating the Products //
exports.createProduct = async (req, res)=>{
    const product = new Product(req.body)
    
try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

} catch (error) {
    res.status(401).json(error);
}
   
}

// Fetching and filtering the products //d
exports.fetchAllProducts = async (req, res)=>{

    // sort = {_sort:"price",_order:"desc"}
    // filter = {"category":["smartphone, laptops"]}

    let query = Product.find({})
    let totalProductsQuery = Product.find({})

    
    const totalDocs = await totalProductsQuery.count().exec();

    if(req.query._page &&  req.query._limit){
        const pageSize=req.query._limit;
        const page = req.query._page;
        query =  query.skip(pageSize*(page-1)).limit(pageSize);
    }
    
    // for sorting in api through categories //
    if(req.query.category){
        query =  query.find({category:req.query.category});
        totalProductsQuery = totalProductsQuery.find({category:req.query.category});
    }

    // for sorting in api through brands //
    if(req.query.brand){
        query =  query.find({brand:req.query.brand});
        totalProductsQuery = totalProductsQuery.find({brand:req.query.brand});
    }

    // for sorting in api through input fields//
    if(req.query._sort &&  req.query._order){
        query =  query.sort({[req.query._sort]:req.query._order})
    }

    
try {
    const filterProducts = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(201).json(filterProducts)

} catch (error) {
    res.status(401).json(error);
}
   
}

exports.fetchProductsById= async(req,res)=>{
  const {id} = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);

} catch (error) {
    res.status(400).json(error);
}

}

exports.updateProductsById= async(req,res)=>{
    const {id} = req.params;
    
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {new: true});
      res.status(200).json(updatedProduct);
  } catch (error) {
      res.status(400).json(error);
  }
  
  }