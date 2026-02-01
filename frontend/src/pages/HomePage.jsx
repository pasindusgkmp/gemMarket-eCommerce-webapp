import React, { useState, useEffect } from 'react';
import { productService, bidService, buyerService } from '../services/api';
import { Clock, Tag, TrendingUp, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CountdownTimer = ({ targetDate, onEnd }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: false });

    useEffect(() => {
        const calculateTime = () => {
            const difference = new Date(targetDate) - new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    ended: false
                });
            } else {
                setTimeLeft(prev => ({ ...prev, ended: true }));
                if (onEnd) onEnd();
            }
        };

        const timer = setInterval(calculateTime, 1000);
        calculateTime();
        return () => clearInterval(timer);
    }, [targetDate]);

    if (timeLeft.ended) return <span style={{ color: '#ef4444', fontWeight: '700' }}>Auction Ended</span>;

    const format = (num) => String(num).padStart(2, '0');

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontFamily: 'monospace' }}>
            {timeLeft.days > 0 && <div className="timer-unit"><span>{timeLeft.days}</span><label>d</label></div>}
            <div className="timer-unit"><span>{format(timeLeft.hours)}</span><label>h</label></div>
            <div className="timer-unit"><span>{format(timeLeft.minutes)}</span><label>m</label></div>
            <div className="timer-unit"><span>{format(timeLeft.seconds)}</span><label>s</label></div>
            <style>{`
                .timer-unit { display: flex; align-items: baseline; gap: 2px; }
                .timer-unit span { font-weight: 700; font-size: 1.1rem; }
                .timer-unit label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }
            `}</style>
        </div>
    );
};

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [bids, setBids] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [bidError, setBidError] = useState('');
    const [bidSuccess, setBidSuccess] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchProducts();
        fetchBuyers();
    }, []);

    const fetchBuyers = async () => {
        try {
            const res = await buyerService.getAll();
            setBuyers(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchProducts = async () => {
        try {
            const response = await productService.getActive();
            setProducts(response.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBidsForProduct = async (id) => {
        try {
            const res = await bidService.getByProduct(id);
            setBids(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (selectedProduct) {
            fetchBidsForProduct(selectedProduct.id);
        } else {
            setBids([]);
        }
    }, [selectedProduct]);

    const getBuyerName = (id) => {
        return buyers.find(b => b.id === id)?.name || 'Unknown Buyer';
    };

    const handlePlaceBid = async (productId) => {
        if (!user || role !== 'BUYER') {
            setBidError('Please login as a buyer to place bids');
            return;
        }

        setBidError('');
        setBidSuccess('');

        try {
            await bidService.place(productId, user.id, parseFloat(bidAmount));
            setBidSuccess('Bid placed successfully!');
            setBidAmount('');
            fetchProducts();
            fetchBidsForProduct(productId);
            // Refresh detail view if open
            if (selectedProduct?.id === productId) {
                const updated = await productService.getById(productId);
                setSelectedProduct(updated.data);
            }
        } catch (err) {
            setBidError(err.response?.data || 'Failed to place bid');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Active Auctions</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Discover and bid on rare gems from around the world.</p>
                </div>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input"
                        style={{ paddingLeft: '45px' }}
                        placeholder="Search gems..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>Loading gems...</div>
            ) : (
                <div className="grid grid-cols-3">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            layoutId={product.id}
                            className="glass-panel"
                            style={{ overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => setSelectedProduct(product)}
                            whileHover={{ translateY: -5 }}
                        >
                            <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={product.image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop'}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                    <div className="glass-panel" style={{ padding: '8px 15px', background: 'rgba(0,0,0,0.6)', borderRadius: '20px', fontSize: '0.85rem' }}>
                                        <CountdownTimer targetDate={product.auctionEnd} onEnd={fetchProducts} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{product.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {product.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Starting Price</span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent)' }}>${product.startingPrice}</span>
                                    </div>
                                    <button className="btn btn-primary">View & Bid</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-panel"
                            style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto', padding: '30px' }}
                        >
                            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1', minWidth: '300px' }}>
                                    <img
                                        src={selectedProduct.image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop'}
                                        alt={selectedProduct.name}
                                        style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ flex: '1.2', minWidth: '300px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{selectedProduct.name}</h2>
                                        <button onClick={() => { setSelectedProduct(null); setBidError(''); setBidSuccess(''); }} className="btn btn-secondary">✕</button>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>{selectedProduct.description}</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                        <div className="glass-panel" style={{ padding: '15px' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Starting Price</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>${selectedProduct.startingPrice}</span>
                                        </div>
                                        <div className="glass-panel" style={{ padding: '15px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Time Remaining</span>
                                            <CountdownTimer targetDate={selectedProduct.auctionEnd} />
                                        </div>
                                    </div>

                                    {role === 'BUYER' ? (
                                        <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--primary)', marginBottom: '30px' }}>
                                            <h4 style={{ marginBottom: '15px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <TrendingUp size={18} /> Place Your Bid
                                            </h4>

                                            {bidError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '10px' }}>{bidError}</div>}
                                            {bidSuccess && <div style={{ color: '#10b981', fontSize: '0.85rem', marginBottom: '10px' }}>{bidSuccess}</div>}

                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <div style={{ position: 'relative', flex: 1 }}>
                                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                                                    <input
                                                        type="number"
                                                        className="input"
                                                        style={{ paddingLeft: '25px' }}
                                                        placeholder="Enter amount"
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(e.target.value)}
                                                    />
                                                </div>
                                                <button onClick={() => handlePlaceBid(selectedProduct.id)} className="btn btn-primary">Place Bid</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                                            <Info size={18} color="var(--primary)" />
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please login as a Buyer to place bids.</span>
                                        </div>
                                    )}

                                    {/* Bid History Section */}
                                    <div style={{ position: 'relative' }}>
                                        <h4 style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Recent Bids</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{bids.length} placed</span>
                                        </h4>
                                        <div style={{
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            paddingRight: '10px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            position: 'relative'
                                        }}>
                                            {bids.length > 0 ? bids.map((bid, index) => (
                                                <div key={bid.id} className="glass-panel" style={{
                                                    padding: '12px 15px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    background: index === 0 ? 'rgba(196, 161, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                                                    borderLeft: index === 0 ? '3px solid var(--primary)' : '1px solid var(--glass-border)'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Tag size={14} color={index === 0 ? 'var(--primary)' : 'var(--text-muted)'} />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '0.9rem', fontWeight: index === 0 ? '600' : '400' }}>{getBuyerName(bid.buyerId)}</div>
                                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(bid.bidTime).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ fontWeight: '700', color: index === 0 ? 'var(--primary)' : 'inherit' }}>
                                                        ${bid.bidAmount}
                                                    </div>
                                                </div>
                                            )) : (
                                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No bids yet. Be the first!</div>
                                            )}
                                        </div>
                                        {/* Shadow fade effect at the bottom */}
                                        {bids.length > 3 && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 10,
                                                height: '40px',
                                                background: 'linear-gradient(transparent, var(--bg-card))',
                                                pointerEvents: 'none',
                                                borderRadius: '0 0 16px 16px'
                                            }}></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomePage;
