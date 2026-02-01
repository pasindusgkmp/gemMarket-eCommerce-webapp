import React, { useState, useEffect } from 'react';
import { productService, buyerService } from '../services/api';
import { Trophy, User, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const WinnersPage = () => {
    const [winners, setWinners] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWinners();
    }, []);

    const fetchWinners = async () => {
        try {
            const [winRes, buyerRes] = await Promise.all([
                productService.getWinners(),
                buyerService.getAll()
            ]);
            setWinners(winRes.data);
            setBuyers(buyerRes.data);
        } catch (err) {
            console.error('Failed to fetch winners', err);
        } finally {
            setLoading(false);
        }
    };

    const getBuyerName = (id) => {
        const buyer = buyers.find(b => b.id === id);
        return buyer ? buyer.name : 'Unknown Winner';
    };

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    style={{ display: 'inline-block', marginBottom: '20px' }}
                >
                    <Trophy size={80} color="#fbbf24" />
                </motion.div>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '10px' }}>Hall of Winners</h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Congratulations to our highest bidders! These rare gems have found their new owners.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>Loading winners...</div>
            ) : (
                <div className="grid grid-cols-2" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {winners.length > 0 ? winners.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel"
                            style={{ overflow: 'hidden', padding: '0' }}
                        >
                            <div style={{ height: '150px', overflow: 'hidden' }}>
                                <img
                                    src={product.image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop'}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.5)' }}
                                />
                            </div>
                            <div style={{ padding: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <h3 style={{ fontSize: '1.4rem' }}>{product.name}</h3>
                                    <div className="glass-panel" style={{ padding: '5px 12px', background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                                        Sold
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                                        <User size={18} />
                                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{getBuyerName(product.winnerBuyerId)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <Calendar size={18} />
                                        <span>Auction Ended: {new Date(product.auctionEnd).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                            No auctions completed yet. Stay tuned!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WinnersPage;
