// CONTROLLER: reads the request, calls the model, sends the response.
// Express 5 passes errors from async functions to the error handler in app.js automatically.
// Every query filters by `user: req.user.id`, so a user only ever sees and changes their own products.
import Product from '../model/product.model.js';

// Only these fields can be set from the request body (never `user`)
const pick = ({ name, price, description } = {}) => ({ name, price, description });

// GET /api/products
export const getProducts = async (req, res) => {
  res.json(await Product.find({ user: req.user.id }));
};

// GET /api/products/:id
export const getProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
  if (!product) return res.status(404).json({ message: 'product not found' });
  res.json(product);
};

// POST /api/products
export const createProduct = async (req, res) => {
  const product = await Product.create({ ...pick(req.body), user: req.user.id });
  res.status(201).json(product);
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, pick(req.body), {
    returnDocument: 'after', // return the updated document, not the old one
    runValidators: true, // apply schema rules (required, min) on update too
  });
  if (!product) return res.status(404).json({ message: 'product not found' });
  res.json(product);
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!product) return res.status(404).json({ message: 'product not found' });
  res.json({ message: 'product deleted' });
};
