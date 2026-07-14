import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import Cookies from 'js-cookie';

interface IOrder {
  _id: string;
  invoice: string;
  slug: string;
  details: Record<string, string>[];
  quantity: number;
  createdAt: string;
}

interface IInvoice {
  _id: string;
  visitor: string;
  user: string;
}

interface IUser {
  _id: string;
  visitor: string;
  firstName: string;
  lastName: string;
  telephone?: string;
  email?: string;
}

interface IProduct {
  slug: string;
  title: string;
}

interface ISlug {
  _id: string;
  code: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [income, setIncome] = useState<IInvoice[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [slugs, setSlugs] = useState<ISlug[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    invoice: '',
    product: '',
    customer: '',
    phone: '',
    email: '',
    details: '',
    date: '',
    sku: '',
  });

  const fetchData = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    const headers = { Authorization: `Bearer ${token}` };
    const server = import.meta.env.VITE_SERVER;

    try {
      const [prodRes, slugRes, userRes, orderRes, incomeRes] = await Promise.all([
        axios.get(`${server}/products`, { headers }),
        axios.get(`${server}/slug`, { headers }),
        axios.post(`${server}/user/get-users`, {}, { headers }),
        axios.post(`${server}/order/get-orders`, {}, { headers }),
        axios.post(`${server}/invoice/get`, {}, { headers }),
      ]);

      if (prodRes.status === 200) setProducts(prodRes.data);
      if (slugRes.status === 200) setSlugs(slugRes.data);
      if (userRes.status === 200) setUsers(userRes.data);
      if (orderRes.status === 200) setOrders(orderRes.data);
      if (incomeRes.status === 200) setIncome(incomeRes.data);
    } catch (error) {
      console.error("Failed to fetch orders data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create optimized lookup maps for O(1) rendering
  const productMap = useMemo(() => new Map(products.map(p => [p.slug, p.title])), [products]);
  const slugMap = useMemo(() => new Map(slugs.map(s => [s._id, s.code])), [slugs]);
  const invoiceMap = useMemo(() => new Map(income.map(i => [i._id, i])), [income]);
  const userMap = useMemo(() => new Map(users.map(u => [u._id, u])), [users]);

  const sortedOrders = useMemo(() => {
    return [...(orders || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return sortedOrders.filter((order) => {
      const orderInvoiceId = typeof order.invoice === 'string' ? order.invoice : order.invoice?._id || '';
      const inv = invoiceMap.get(orderInvoiceId) || income.find((i) => i._id === orderInvoiceId) || null;
      const customerId = inv?.user || order.user || '';
      const customer = customerId ? userMap.get(customerId) : null;
      const productTitle = productMap.get(order.slug) || '';
      const customerName = customer ? `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() : '';
      const phone = customer?.telephone ? String(customer?.telephone) : '';
      const email = customer?.email || '';
      const sku = slugMap.get(order.slug) || '';
      const invoiceId = typeof order.invoice === 'string' ? order.invoice.slice(-4) : '';
      const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
      const detailsStr = order.details.map(d => Object.values(d).join(' ')).join(' ');

      return (
        invoiceId.toLowerCase().includes(filters.invoice.toLowerCase()) &&
        productTitle.toLowerCase().includes(filters.product.toLowerCase()) &&
        customerName.toLowerCase().includes(filters.customer.toLowerCase()) &&
        phone?.toLowerCase().includes(filters.phone?.toLowerCase()) &&
        email.toLowerCase().includes(filters.email.toLowerCase()) &&
        sku.toLowerCase().includes(filters.sku.toLowerCase()) &&
        dateStr.toLowerCase().includes(filters.date.toLowerCase()) &&
        detailsStr.toLowerCase().includes(filters.details.toLowerCase())
      );
    });
  }, [users, income, sortedOrders, filters, invoiceMap, userMap, productMap, slugMap]);

  if (loading) return <div className="p-6 ml-[150px] md:ml-0">Loading orders...</div>;

  return (
    <div className="p-6 bg-gray-50 ml-[150px] md:ml-0 min-h-screen">
      <div className="max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  <div className="mb-2">Invoice ID</div>
                  <input
                    type="text"
                    className="w-full p-1 text-xs border rounded font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Search ID..."
                    value={filters.invoice}
                    onChange={(e) => setFilters({ ...filters, invoice: e.target.value })}
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  <div className="mb-2">Product</div>
                  <input
                    type="text"
                    className="w-full p-1 text-xs border rounded font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Search Product..."
                    value={filters.product}
                    onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  <div className="mb-2">Customer</div>
                  <input
                    type="text"
                    className="w-full p-1 text-xs border rounded font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Search Customer..."
                    value={filters.customer}
                    onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  <div className="mb-2">Phone</div>
                  <input
                    type="text"
                    className="w-full p-1 text-xs border rounded font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Search Phone..."
                    value={filters.phone}
                    onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  <div className="mb-2">Email</div>
                  <input
                    type="text"
                    className="w-full p-1 text-xs border rounded font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Search Email..."
                    value={filters.email}
                    onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  <div className="mb-2">Order Details</div>
                  <input
                    type="text"
                    className="w-full p-1 text-xs border rounded font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Search Details..."
                    value={filters.details}
                    onChange={(e) => setFilters({ ...filters, details: e.target.value })}
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  <div className="mb-2">Date</div>
                  <input
                    type="text"
                    className="w-full p-1 text-xs border rounded font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Search Date..."
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">
                  <div className="mb-2 text-right">SKU/Code</div>
                  <input
                    type="text"
                    className="w-full p-1 text-xs border rounded font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
                    placeholder="Search SKU..."
                    value={filters.sku}
                    onChange={(e) => setFilters({ ...filters, sku: e.target.value })}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders?.map((order) => {
                const orderInvoiceId = typeof order.invoice === 'string' ? order.invoice : order.invoice?._id || '';
                const inv = invoiceMap?.get(orderInvoiceId);
                const customerId = inv?.user || order.user || '';
                const customer = customerId ? userMap.get(customerId) : null;
                return (
                  <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-mono text-indigo-600">
                      #{orderInvoiceId.slice(-4)}
                    </td>
                    <td className="p-4 text-sm text-gray-700 font-medium">
                      {productMap.get(order.slug) || 'Product Not Found'}
                    </td>
                    <td className="p-4 text-sm text-gray-700">

                      {customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {customer?.telephone || 'N/A'}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {customer?.email || 'N/A'}
                    </td>

                    <td className="p-4">
                      <div className="p-2 flex flex-col gap-1 text-xs bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                        {order.details.map((detail, idx) => (
                          <div key={idx}>
                            {Object.entries(detail).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-1">
                                <span className="font-bold text-indigo-700 uppercase text-xs tracking-wider">
                                  {key}:
                                </span>
                                <span className="text-gray-600">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-700 uppercase text-xs tracking-wider">
                            Qty:
                          </span>
                          <span className="text-gray-600 font-mono">
                            {order.quantity}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 text-sm text-gray-500 text-right font-mono">
                      {slugMap.get(order.slug) || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
