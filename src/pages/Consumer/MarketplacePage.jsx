import React, { useState, useEffect } from 'react';
import ProduceCard from './ProduceCard';
import './MarketplacePage.css'

function MarketplacePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [produceList, setProduceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch produce data from backend
    useEffect(() => {
        const fetchProduce = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/marketplace', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch produce data');
                }

                const data = await response.json();
                setProduceList(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching produce:', err);
                setError('Failed to load produce. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduce();
    }, []);

    // Filter produce based on search and filters
    const filteredProduce = produceList.filter(item => {
        const matchesSearch = item.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.farmerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category?.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    // Loading state
    if (loading) {
        return (
            <div className="marketplace-page">
                <header className="page-header">
                    <h2>🛒 Marketplace</h2>
                    <p>Browse fresh produce from local farmers</p>
                </header>
                <div className="loading-state">
                    <p>Loading Marketplace...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="marketplace-page">
                <header className="page-header">
                    <h2>🛒 Marketplace</h2>
                    <p>Browse fresh produce from local farmers</p>
                </header>
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="marketplace-page">
            <header className="page-header">
                <h2>🛒 Marketplace</h2>
                <p>Browse fresh produce from local farmers</p>
            </header>

            {/* Search and Filters */}
            <section className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for produce or farmer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            <option value="vegetables">Vegetables</option>
                            <option value="leafy greens">Leafy Greens</option>
                            <option value="fruits">Fruits</option>
                            <option value="herbs">Herbs</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="price">Price Range:</label>
                        <select
                            id="price"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Prices</option>
                            <option value="low">Under R200</option>
                            <option value="medium">R200 - R400</option>
                            <option value="high">Over R400</option>
                        </select>
                    </div>

                    <button className="reset-filters" onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setPriceRange('all');
                    }}>
                        Reset Filters
                    </button>
                </div>
            </section>

            {/* Results Count */}
            <section className="results-info">
                <p>Showing {filteredProduce.length} {filteredProduce.length === 1 ? 'item' : 'items'}</p>
            </section>

            {/* Produce Grid */}
            <section className="produce-grid">
                {filteredProduce.length > 0 ? (
                    filteredProduce.map(item => (
                        <ProduceCard
                            key={item.id}
                            id={item.id}
                            crop={item.product}
                            quantity={item.quantity}
                            price={`R${item.price}`}
                            seller={item.farmerName}
                            location={item.location}
                            status={item.status}
                            imageUrls={item.imageUrls}
                        />
                    ))
                ) : (
                    <div className="no-results">
                        <p>No produce found matching your criteria.</p>
                        <button onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('all');
                            setPriceRange('all');
                        }}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default MarketplacePage;