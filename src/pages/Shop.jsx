import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { ShoppingBag } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiFetch('/products');
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="header-section">
          <h1 className="page-title">Merchandise Store</h1>
          <p className="page-subtitle">Official Asha Indoor T-shirts, jerseys & cricket training gear</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>Loading shop items...</p>
          </div>
        ) : (
          <div className="grid-4">
            {products.map((product) => (
              <div key={product._id || product.id} className="card">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ height: '220px', width: '100%', objectFit: 'cover' }}
                />
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifySpace: 'between' }}>
                  <div>
                    <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
                      {product.category || 'T-Shirt'}
                    </span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', margin: '0.25rem 0' }}>{product.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{product.description}</p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>₹{product.price}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock: {product.stock}</span>
                    </div>

                    <button
                      onClick={() => alert(`Purchased ${product.name}! In-store pickup instructions sent.`)}
                      className="btn btn-primary btn-full"
                    >
                      <ShoppingBag size={16} />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
