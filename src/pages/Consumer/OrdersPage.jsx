import React from 'react';
import OrderStatusCard from '../../components/OrderStatusCard';
import './OrdersPage.css';

function OrdersPage() {
    return (
        <div className="orders-page">
            <header className="page-header">
                <h2>🛒 My Orders</h2>
                <p>Track your orders and order history</p>
            </header>

            <section className="active-orders">
                <h3>Active Orders</h3>
                <div className="orders-list">
                    <OrderStatusCard
                        item="Tomatoes"
                        seller="Farmer Thabo"
                        status="Confirmed"
                        quantity="50kg"
                        price="R300"
                        orderDate="2026-01-08"
                    />
                    <OrderStatusCard
                        item="Spinach"
                        seller="Farmer Naledi"
                        status="In Transit"
                        quantity="20kg"
                        price="R120"
                        orderDate="2026-01-07"
                    />
                </div>
            </section>

            <section className="completed-orders">
                <h3>Order History</h3>
                <div className="orders-list">
                    <OrderStatusCard
                        item="Pumpkin"
                        seller="Farmer Naledi"
                        status="Delivered"
                        quantity="10 units"
                        price="R150"
                        orderDate="2026-01-05"
                    />
                    <OrderStatusCard
                        item="Carrots"
                        seller="Farmer Thabo"
                        status="Delivered"
                        quantity="30kg"
                        price="R180"
                        orderDate="2026-01-03"
                    />
                </div>
            </section>
        </div>
    );
}

export default OrdersPage;