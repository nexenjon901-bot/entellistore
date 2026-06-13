import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { api } from './api';
import { readLocalData, writeLocalData } from './lib/localStore';

export const AuthContext = createContext();

const ADMIN_CREDENTIALS = { username: 'entelli', password: 'cookiepass' };

export function getSessionUser() {
  try {
    const saved = localStorage.getItem('entelli_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function buildAdminUser() {
  return {
    id: 'ADMIN_001',
    username: ADMIN_CREDENTIALS.username,
    role: 'admin',
    balance: 0,
    purchases: 0,
    region: 'uzb',
    status: 'Active',
    verified: true,
  };
}

function dataChanged(prev, next) {
  return JSON.stringify(prev) !== JSON.stringify(next);
}

function applyDataSetters(data, setters) {
  const { setProducts, setOrders, setSupportChats, setRegisteredUsers } = setters;
  setProducts(prev => dataChanged(prev, data.products) ? data.products : prev);
  setOrders(prev => dataChanged(prev, data.orders) ? data.orders : prev);
  setSupportChats(prev => dataChanged(prev, data.supportChats) ? data.supportChats : prev);
  setRegisteredUsers(prev => dataChanged(prev, data.users) ? data.users : prev);
}

export const AuthProvider = ({ children, setLang }) => {
  const [user, setUser] = useState(() => getSessionUser());
  const [theme, setTheme] = useState(() => localStorage.getItem('entelli_theme') || 'dark');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [supportChats, setSupportChats] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [apiOnline, setApiOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const syncingRef = useRef(false);

  const setters = { setProducts, setOrders, setSupportChats, setRegisteredUsers };

  const loadLocal = useCallback(() => {
    const local = readLocalData();
    applyDataSetters(local, setters);
    return local;
  }, []);

  const syncFromServer = useCallback(async () => {
    if (syncingRef.current || document.hidden) return;
    syncingRef.current = true;
    try {
      const data = await api.fetchData();
      applyDataSetters({
        products: data.products || [],
        orders: data.orders || [],
        supportChats: data.supportChats || [],
        users: data.users || [],
      }, setters);
      writeLocalData({
        products: data.products || [],
        orders: data.orders || [],
        supportChats: data.supportChats || [],
        users: data.users || [],
      });
      setApiOnline(true);
    } catch {
      loadLocal();
      setApiOnline(false);
    } finally {
      setLoading(false);
      syncingRef.current = false;
    }
  }, [loadLocal]);

  useEffect(() => {
    loadLocal();
    syncFromServer();
    const interval = setInterval(syncFromServer, 30000);
    const onVisible = () => { if (!document.hidden) syncFromServer(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [syncFromServer, loadLocal]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('entelli_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const applySession = useCallback((nextUser) => {
    flushSync(() => setUser(nextUser));
    if (nextUser) localStorage.setItem('entelli_user', JSON.stringify(nextUser));
    else localStorage.removeItem('entelli_user');
  }, []);

  const login = async (username, password) => {
    const normalized = (username || '').trim().toLowerCase();
    try {
      const { user: loggedIn } = await api.login({ username: normalized, password });
      applySession(loggedIn);
      return { ok: true, user: loggedIn };
    } catch (err) {
      if (normalized === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const adminUser = buildAdminUser();
        applySession(adminUser);
        return { ok: true, user: adminUser };
      }
      return { ok: false, error: err.message || 'Server bilan bog\'lanib bo\'lmadi' };
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const { user: loggedIn } = await api.googleLogin({ credential });
      applySession(loggedIn);
      return { ok: true, user: loggedIn };
    } catch (err) {
      return { ok: false, error: err.message || 'Google orqali kirish amalga oshmadi' };
    }
  };

  const register = async (username, password, region, email) => {
    try {
      const { user: newUser } = await api.register({ username, password, region, email });
      const regionLangMap = { uzb: 'uz', rus: 'ru', usa: 'en', uae: 'ar' };
      if (regionLangMap[region]) setLang(regionLangMap[region]);
      applySession(newUser);
      await syncFromServer();
      return { ok: true, user: newUser };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const logout = () => applySession(null);

  const addProduct = async (product) => {
    try {
      await api.createProduct(product);
      await syncFromServer();
      return true;
    } catch {
      const local = readLocalData();
      const newProduct = {
        ...product,
        id: Math.floor(10000 + Math.random() * 90000).toString(),
        views: 0,
      };
      const next = { ...local, products: [newProduct, ...local.products] };
      writeLocalData(next);
      setProducts(next.products);
      return true;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      await syncFromServer();
    } catch {
      const local = readLocalData();
      const next = { ...local, products: local.products.filter(p => p.id !== id) };
      writeLocalData(next);
      setProducts(next.products);
    }
  };

  const addOrder = async (order) => {
    try {
      const created = await api.createOrder(order);
      await syncFromServer();
      return created.id;
    } catch {
      const local = readLocalData();
      const newOrder = {
        id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
        ...order,
        status: 'Pending Payment',
        date: new Date().toISOString(),
      };
      const next = { ...local, orders: [newOrder, ...local.orders] };
      writeLocalData(next);
      setOrders(next.orders);
      return newOrder.id;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      await syncFromServer();
    } catch {
      const local = readLocalData();
      const next = {
        ...local,
        orders: local.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o),
      };
      writeLocalData(next);
      setOrders(next.orders);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await api.deleteOrder(orderId);
      await syncFromServer();
    } catch {
      const local = readLocalData();
      const next = { ...local, orders: local.orders.filter(o => o.id !== orderId) };
      writeLocalData(next);
      setOrders(next.orders);
    }
  };

  const sendSupportMessage = async (userId, fromRole, text) => {
    try {
      const chats = await api.sendMessage({ userId, fromRole, text });
      setSupportChats(chats);
      const local = readLocalData();
      writeLocalData({ ...local, supportChats: chats });
    } catch {
      const local = readLocalData();
      const newMessage = { from: fromRole, text, timestamp: new Date().toISOString() };
      const idx = local.supportChats.findIndex(c => c.userId === userId);
      let chats;
      if (idx >= 0) {
        chats = [...local.supportChats];
        chats[idx] = { ...chats[idx], messages: [...chats[idx].messages, newMessage] };
      } else {
        chats = [...local.supportChats, { userId, label: userId, messages: [newMessage] }];
      }
      writeLocalData({ ...local, supportChats: chats });
      setSupportChats(chats);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await api.updateUser(userId, { status });
      await syncFromServer();
    } catch {
      const local = readLocalData();
      const next = {
        ...local,
        users: local.users.map(u => u.id === userId ? { ...u, status } : u),
      };
      writeLocalData(next);
      setRegisteredUsers(next.users);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, login, loginWithGoogle, register, logout, setUser,
      theme, toggleTheme,
      products, addProduct, deleteProduct,
      orders, addOrder, updateOrderStatus, deleteOrder,
      supportChats, sendSupportMessage,
      registeredUsers, updateUserStatus,
      apiOnline, loading, syncFromServer,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
