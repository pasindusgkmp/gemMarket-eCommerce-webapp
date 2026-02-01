import React, { useState, useEffect } from 'react';
import { productService, buyerService } from '../services/api';
import { Plus, Trash2, Edit2, Users, Package, Clock, DollarSign, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Product Form State
    const [productForm, setProductForm] = useState({ name: '', description: '', image: '', startingPrice: '', auctionStart: '', auctionEnd: '' });
    const [editingProduct, setEditingProduct] = useState(null);

    // Buyer Form State
    const [buyerForm, setBuyerForm] = useState({ name: '', username: '', password: '', phone: '' });
    const [editingBuyer, setEditingBuyer] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, buyerRes] = await Promise.all([
                productService.getAll(),
                buyerService.getAll()
            ]);
            setProducts(prodRes.data);
            setBuyers(buyerRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    // Product Handlers
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productService.update(editingProduct.id, productForm);
            } else {
                await productService.add(productForm);
            }
            setProductForm({ name: '', description: '', image: '', startingPrice: '', auctionStart: '', auctionEnd: '' });
            setEditingProduct(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Operation failed: ' + (err.response?.data || 'Unknown error'));
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? All associated bids will also be deleted.')) {
            try {
                await productService.delete(id);
                fetchData();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    // Buyer Handlers
    const handleBuyerSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBuyer) {
                await buyerService.update(editingBuyer.id, buyerForm);
            } else {
                await buyerService.add(buyerForm);
            }
            setBuyerForm({ name: '', username: '', password: '', phone: '' });
            setEditingBuyer(null);
            fetchData();
        } catch (err) { alert('Operation failed'); }
    };

    const deleteBuyer = async (id) => {
        if (window.confirm('Are you sure?')) {
            await buyerService.delete(id);
            fetchData();
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <button
                    className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('products')}
                >
                    <Package size={18} /> Manage Products
                </button>
                <button
                    className={`btn ${activeTab === 'buyers' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('buyers')}
                >
                    <Users size={18} /> Manage Buyers
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                {/* List View */}
                <div className="glass-panel" style={{ padding: '30px' }}>
                    <h2 style={{ marginBottom: '25px' }}>{activeTab === 'products' ? 'Product Inventory' : 'Buyer Registry'}</h2>

                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {activeTab === 'products' ? products.map(p => (
                                <div key={p.id} className="glass-panel" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <img src={p.image || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div>
                                            <h4 style={{ margin: 0 }}>{p.name}</h4>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price: ${p.startingPrice} | Status: {p.status}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => {
                                            setEditingProduct(p);
                                            setProductForm({
                                                ...p,
                                                auctionStart: formatDateForInput(p.auctionStart),
                                                auctionEnd: formatDateForInput(p.auctionEnd)
                                            });
                                        }} className="btn btn-secondary" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                                        <button onClick={() => deleteProduct(p.id)} className="btn btn-danger" style={{ padding: '8px' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            )) : buyers.map(b => (
                                <div key={b.id} className="glass-panel" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{b.name}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{b.username} | {b.phone}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => { setEditingBuyer(b); setBuyerForm(b); }} className="btn btn-secondary" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                                        <button onClick={() => deleteBuyer(b.id)} className="btn btn-danger" style={{ padding: '8px' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form View */}
                <div className="glass-panel" style={{ padding: '30px', height: 'fit-content', position: 'sticky', top: '100px' }}>
                    <h3 style={{ marginBottom: '20px' }}>{editingProduct || editingBuyer ? 'Edit' : 'Add New'} {activeTab === 'products' ? 'Product' : 'Buyer'}</h3>

                    {activeTab === 'products' ? (
                        <form onSubmit={handleProductSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input className="input" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="input" style={{ minHeight: '80px' }} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input className="input" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Starting Price ($)</label>
                                <input type="number" className="input" value={productForm.startingPrice} onChange={e => setProductForm({ ...productForm, startingPrice: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Auction Start</label>
                                <input type="datetime-local" className="input" value={productForm.auctionStart} onChange={e => setProductForm({ ...productForm, auctionStart: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Auction End</label>
                                <input type="datetime-local" className="input" value={productForm.auctionEnd} onChange={e => setProductForm({ ...productForm, auctionEnd: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                            {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', image: '', startingPrice: '', auctionStart: '', auctionEnd: '' }) }} className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>Cancel</button>}
                        </form>
                    ) : (
                        <form onSubmit={handleBuyerSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input className="input" value={buyerForm.name} onChange={e => setBuyerForm({ ...buyerForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Username</label>
                                <input className="input" value={buyerForm.username} onChange={e => setBuyerForm({ ...buyerForm, username: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="input" value={buyerForm.password} onChange={e => setBuyerForm({ ...buyerForm, password: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input className="input" value={buyerForm.phone} onChange={e => setBuyerForm({ ...buyerForm, phone: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                                {editingBuyer ? 'Update Buyer' : 'Add Buyer'}
                            </button>
                            {editingBuyer && <button type="button" onClick={() => { setEditingBuyer(null); setBuyerForm({ name: '', username: '', password: '', phone: '' }) }} className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>Cancel</button>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
