import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from './redux/slices/navigationSlice';
import MenuPage from './pages/MenuPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import CartPage from './pages/CartPage.jsx';
import BottomNavbar from './components/BottomNavbar.jsx';

export default function MainLayout() {
  const dispatch  = useDispatch();
  const activeTab = useSelector((s) => s.navigation.activeTab);

  const Page = { menu: MenuPage, orders: OrderHistoryPage, favorites: FavoritesPage, cart: CartPage }[activeTab] || MenuPage;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', paddingBottom: '90px' }}>
      <Page />
      <BottomNavbar activeTab={activeTab} setActiveTab={(tab) => dispatch(setActiveTab(tab))} />
    </div>
  );
}
