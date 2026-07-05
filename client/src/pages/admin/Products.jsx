import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { productAPI } from '../api/endpoints.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll({ search, limit: 50 });
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await productAPI.delete(id);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Products</h1>
          <Link
            to="/admin/products/create"
            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            <FaPlus /> Add Product
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={() => fetchProducts()}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg outline-none focus:border-primary"
          />
        </div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Name</th>
                    <th className="px-6 py-3 font-semibold">Price</th>
                    <th className="px-6 py-3 font-semibold">Stock</th>
                    <th className="px-6 py-3 font-semibold">Category</th>
                    <th className="px-6 py-3 font-semibold">Rating</th>
                    <th className="px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-3 font-semibold">{product.name}</td>
                      <td className="px-6 py-3">₹{product.price}</td>
                      <td className="px-6 py-3">{product.stock}</td>
                      <td className="px-6 py-3">{product.category}</td>
                      <td className="px-6 py-3">⭐ {product.rating?.toFixed(1)}</td>
                      <td className="px-6 py-3 flex gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="text-blue-500 hover:text-blue-700 transition"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">No products found</div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
