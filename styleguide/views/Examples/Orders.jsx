import { useState } from 'react';

import { Badge, Button, Tabs } from '../../../components';

import { ORDERS, ORDER_FILTERS, STATUS_TONES } from './examples-data';

// A table of orders with tabs that filter it by status.
const Orders = () => {
  const [filter, setFilter] = useState('All');
  const rows = filter === 'All' ? ORDERS : ORDERS.filter((order) => order.status === filter);

  return (
    <div className="sample-orders">
      <div className="sample-heading">
        <div>
          <h2>Orders</h2>
          <p className="sample-muted">{rows.length} of {ORDERS.length} orders shown.</p>
        </div>
        <Button>Export</Button>
      </div>

      <Tabs tabs={ORDER_FILTERS} selectedTabKey={ORDER_FILTERS.indexOf(filter)} onSelect={(key) => setFilter(ORDER_FILTERS[key])} />

      <div className="sample-scroll">
        <table className="sample-table">
          <caption className="sr-only">Orders</caption>
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Customer</th>
              <th scope="col">Date</th>
              <th scope="col" className="sample-number">Total</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id}>
                <th scope="row">{order.id}</th>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td className="sample-number">{order.total}</td>
                <td><Badge tone={STATUS_TONES[order.status]}>{order.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
