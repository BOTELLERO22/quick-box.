import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Bike, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Package, 
  DollarSign, 
  User, 
  Navigation, 
  Bell, 
  Volume2, 
  VolumeX, 
  Split, 
  X, 
  Sparkles, 
  RefreshCw, 
  ShoppingBag,
  Zap,
  Check,
  Eye,
  ChevronRight
} from 'lucide-react';

const QuickBoxOwlIcon = ({ className = "w-7 h-7" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stylized Neon Owl Face */}
    <path 
      d="M15 20 C 30 25, 40 40, 50 48 C 60 40, 70 25, 85 20 C 80 38, 88 45, 95 55 C 80 62, 75 80, 50 92 C 25 80, 20 62, 5 55 C 12 45, 20 38, 15 20 Z" 
      stroke="#f43f5e" 
      strokeWidth="5" 
      fill="#09090b"
    />
    {/* Eyes */}
    <circle cx="35" cy="50" r="12" stroke="#f43f5e" strokeWidth="4" fill="#000" />
    <circle cx="65" cy="50" r="12" stroke="#f43f5e" strokeWidth="4" fill="#000" />
    <circle cx="35" cy="50" r="4" fill="#fff" />
    <circle cx="65" cy="50" r="4" fill="#fff" />
    {/* Sharp Beak */}
    <path d="M50 50 L44 65 L50 72 L56 65 Z" fill="#f43f5e" />
    {/* Brow outline */}
    <path d="M22 36 L42 46 L50 48 L58 46 L78 36" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const INITIAL_ORDERS = [
  {
    id: 'QB-8921',
    storeName: 'Pizzeria Don Luigi',
    storeAddress: 'Av. Belgrano 1240',
    customerName: 'Carolina Rossi',
    customerAddress: 'Calle San Martín 458, 3B',
    customerPhone: '+54 9 261 455-8910',
    items: '1x Pizza Muzzarella, 1x Empanadas x6',
    price: 12500,
    deliveryFee: 1800,
    status: 'pending',
    assignedDriver: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    logs: [{ time: new Date(Date.now() - 1000 * 60 * 8).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: 'Pedido publicado en QUICK BOX' }]
  },
  {
    id: 'QB-8920',
    storeName: 'Hamburguesería Urban',
    storeAddress: 'Calle Aristides 320',
    customerName: 'Lucas Méndez',
    customerAddress: 'Calle Las Heras 1120',
    customerPhone: '+54 9 261 512-3344',
    items: '2x Doble Bacon Burger + Papas Grandes',
    price: 18400,
    deliveryFee: 2200,
    status: 'picked_up',
    assignedDriver: { id: 'DRV-01', name: 'Marcos R.', phone: '+54 9 261 998-1122', vehicle: 'Moto Honda Wave' },
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    logs: [
      { time: '19:15', text: 'Pedido creado' },
      { time: '19:18', text: 'Tomado por Marcos R.' },
      { time: '19:25', text: 'Retirado del local' }
    ]
  }
];

const playNotificationSound = (type = 'new') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'new') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(900, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'accept') {
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(700, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(950, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'delivered') {
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.setValueAtTime(1050, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    // Silent fallback
  }
};

export default function App() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [viewMode, setViewMode] = useState('split');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const triggerAudio = (soundType) => {
    if (soundEnabled) {
      playNotificationSound(soundType);
    }
  };

  const handleCreateOrder = (newOrderData) => {
    const newOrder = {
      ...newOrderData,
      id: `QB-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      assignedDriver: null,
      createdAt: new Date().toISOString(),
      logs: [{ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: 'Pedido publicado en la red' }]
    };

    setOrders(prev => [newOrder, ...prev]);
    addToast(`¡Nuevo pedido ${newOrder.id} creado!`, 'success');
    triggerAudio('new');
  };

  const handleAcceptOrder = (orderId, driverInfo) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId && ord.status === 'pending') {
        const updatedLogs = [
          ...ord.logs,
          { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: `Aceptado por ${driverInfo.name}` }
        ];
        return {
          ...ord,
          status: 'assigned',
          assignedDriver: driverInfo,
          logs: updatedLogs
        };
      }
      return ord;
    }));

    addToast(`Pedido ${orderId} aceptado por ${driverInfo.name}`, 'info');
    triggerAudio('accept');
  };

  const handleUpdateOrderStatus = (orderId, newStatus, statusText) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const updatedLogs = [
          ...ord.logs,
          { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: statusText }
        ];
        return {
          ...ord,
          status: newStatus,
          logs: updatedLogs
        };
      }
      return ord;
    }));

    if (newStatus === 'delivered') {
      addToast(`Pedido ${orderId} entregado con éxito`, 'success');
      triggerAudio('delivered');
    } else {
      addToast(`Estado de ${orderId}: ${statusText}`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-rose-600 selection:text-white antialiased relative overflow-x-hidden">
      {/* Background Neon Pink Glow Orbs */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-rose-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-rose-950/50 px-4 py-3 shadow-[0_4px_30px_rgba(244,63,94,0.15)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo Branding - QUICK BOX Style */}
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 rounded-2xl border-2 border-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.6)] flex items-center justify-center">
              <QuickBoxOwlIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black italic tracking-wider text-white uppercase drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">
                  QUICK <span className="text-rose-500 not-italic">BOX</span>
                </h1>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold bg-rose-950/60 text-rose-400 border border-rose-600/40 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  LIVE SYNC
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium tracking-wide">Plataforma Directa entre Locales y Delivery</p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2 bg-zinc-900/90 p-1.5 rounded-2xl border border-rose-900/40 shadow-inner">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Desactivar audio" : "Activar audio"}
              className={`p-2 rounded-xl transition-all ${
                soundEnabled 
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-600/40 shadow-[0_0_8px_rgba(244,63,94,0.4)]' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="h-4 w-px bg-zinc-800"></div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                  viewMode === 'split'
                    ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Vista Dual</span>
                <span className="md:hidden">Dual</span>
              </button>

              <button
                onClick={() => setViewMode('store')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                  viewMode === 'store'
                    ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Local</span>
              </button>

              <button
                onClick={() => setViewMode('driver')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                  viewMode === 'driver'
                    ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Delivery</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 transition-all duration-300">
        <div className={`grid gap-6 ${
          viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'
        }`}>
          {(viewMode === 'split' || viewMode === 'store') && (
            <StorePanel 
              orders={orders}
              onCreateOrder={handleCreateOrder}
            />
          )}

          {(viewMode === 'split' || viewMode === 'driver') && (
            <DriverPanel 
              orders={orders}
              onAcceptOrder={handleAcceptOrder}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}
        </div>
      </main>

      {/* Floating Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 transition-all duration-300 ${
              toast.type === 'success' 
                ? 'bg-zinc-950/95 border-rose-500/80 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                : 'bg-zinc-950/95 border-pink-500/60 text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
            }`}
          >
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <p className="text-xs font-extrabold leading-relaxed flex-1">{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StorePanel({ orders, onCreateOrder }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    storeName: 'Pizzeria Don Luigi',
    storeAddress: 'Av. Belgrano 1240',
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    items: '',
    price: '',
    deliveryFee: '1800'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerAddress || !formData.items || !formData.price) return;

    onCreateOrder({
      ...formData,
      price: Number(formData.price),
      deliveryFee: Number(formData.deliveryFee) || 1800
    });

    setFormData(prev => ({
      ...prev,
      customerName: '',
      customerAddress: '',
      customerPhone: '',
      items: '',
      price: ''
    }));
    setShowForm(false);
  };

  return (
    <div className="bg-zinc-950/80 border-2 border-rose-900/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(244,63,94,0.08)] backdrop-blur-md flex flex-col gap-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-950/60 border border-rose-600/40 text-rose-500 rounded-2xl shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase italic tracking-wider flex items-center gap-2">
              Panel del Local
              <span className="text-[10px] font-extrabold not-italic px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-600/40">
                Pizzeria Don Luigi
              </span>
            </h2>
            <p className="text-xs text-zinc-400">Emite y realiza seguimiento de envíos QUICK BOX</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-lg ${
            showForm
              ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]'
          }`}
        >
          {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><PlusCircle className="w-4 h-4" /> Nuevo Pedido</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900/90 border border-rose-600/30 rounded-2xl p-4 flex flex-col gap-3.5 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-rose-500" /> Crear Envío Express
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase">Cliente *</label>
              <input
                type="text"
                required
                placeholder="Nombre completo"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase">WhatsApp</label>
              <input
                type="text"
                placeholder="+54 9 261..."
                value={formData.customerPhone}
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase">Dirección de Entrega *</label>
            <input
              type="text"
              required
              placeholder="Calle y altura, piso/depto"
              value={formData.customerAddress}
              onChange={e => setFormData({ ...formData, customerAddress: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase">Detalle Pedido / Caja *</label>
            <textarea
              required
              rows="2"
              placeholder="Ej: 1x Pizza Muzzarella, 1x Gaseosa 1.5L"
              value={formData.items}
              onChange={e => setFormData({ ...formData, items: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase">Cobro al Cliente ($)</label>
              <input
                type="number"
                required
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase">Tarifa Envío ($)</label>
              <input
                type="number"
                required
                placeholder="1800"
                value={formData.deliveryFee}
                onChange={e => setFormData({ ...formData, deliveryFee: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" /> Publicar Pedido QUICK BOX
          </button>
        </form>
      )}

      {/* Orders List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-zinc-400 uppercase tracking-wider">Pedidos Emitidos ({orders.length})</span>
          <span className="text-rose-500 text-[11px] font-bold">Red en tiempo real</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl">
            No hay pedidos registrados.
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
            {orders.map(order => (
              <StoreOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StoreOrderCard({ order }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full animate-pulse">
            <Clock className="w-3 h-3" /> Buscando repartidor
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full">
            <Bike className="w-3 h-3" /> Delivery asignado
          </span>
        );
      case 'at_store':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase bg-pink-500/10 text-pink-400 border border-pink-500/30 px-2.5 py-1 rounded-full">
            <Store className="w-3 h-3" /> En el local
          </span>
        );
      case 'picked_up':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full">
            <Navigation className="w-3 h-3" /> En viaje al cliente
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Entregado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 hover:border-rose-900/60 rounded-2xl p-4 flex flex-col gap-3 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-rose-400">{order.id}</span>
            <span className="text-[10px] text-zinc-500">
              {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-200 mt-0.5">{order.customerName}</p>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
          <span className="text-zinc-300 text-[11px]">{order.customerAddress}</span>
        </div>
        <div className="flex items-start gap-2">
          <Package className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
          <span className="text-zinc-300 text-[11px] line-clamp-2">{order.items}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-[11px]">Cobro: <strong className="text-white font-bold">${order.price.toLocaleString()}</strong></span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-400 text-[11px]">Envío: <strong className="text-rose-400 font-bold">${order.deliveryFee.toLocaleString()}</strong></span>
        </div>

        {order.assignedDriver ? (
          <div className="flex items-center gap-1.5 text-rose-300 bg-rose-950/40 px-2.5 py-0.5 rounded-lg border border-rose-600/30 text-[11px] font-medium">
            <User className="w-3 h-3" />
            <span>{order.assignedDriver.name}</span>
          </div>
        ) : (
          <span className="text-[11px] text-zinc-500 italic">Esperando repartidor</span>
        )}
      </div>
    </div>
  );
}

function DriverPanel({ orders, onAcceptOrder, onUpdateStatus }) {
  const [isOnline, setIsOnline] = useState(true);
  const [driverProfile] = useState({
    id: 'DRV-88',
    name: 'Carlos Ruiz',
    phone: '+54 9 261 411-9900',
    vehicle: 'Moto Zanella 150'
  });

  const availableOrders = orders.filter(o => o.status === 'pending');
  const activeOrder = orders.find(o => 
    o.assignedDriver?.id === driverProfile.id && o.status !== 'delivered' && o.status !== 'cancelled'
  );
  
  const completedOrders = orders.filter(o => 
    o.assignedDriver?.id === driverProfile.id && o.status === 'delivered'
  );
  const totalEarnings = completedOrders.reduce((acc, curr) => acc + curr.deliveryFee, 0);

  return (
    <div className="bg-zinc-950/80 border-2 border-rose-900/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(244,63,94,0.08)] backdrop-blur-md flex flex-col gap-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-600 to-pink-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-950/60 border border-rose-600/40 text-rose-500 rounded-2xl shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase italic tracking-wider flex items-center gap-2">
              Panel Delivery
              <span className="text-[10px] font-extrabold not-italic px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-600/40">
                {driverProfile.name}
              </span>
            </h2>
            <p className="text-xs text-zinc-400">{driverProfile.vehicle}</p>
          </div>
        </div>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all border uppercase ${
            isOnline 
              ? 'bg-rose-950/60 border-rose-600/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-500'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-rose-500 animate-ping' : 'bg-zinc-600'}`}></span>
          {isOnline ? 'CONECTADO' : 'DESCONECTADO'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Ganancias Hoy</p>
            <p className="text-lg font-black text-rose-400 mt-0.5">${totalEarnings.toLocaleString()}</p>
          </div>
          <div className="p-2.5 bg-rose-950/60 text-rose-400 rounded-xl border border-rose-600/30">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Viajes Hoy</p>
            <p className="text-lg font-black text-white mt-0.5">{completedOrders.length}</p>
          </div>
          <div className="p-2.5 bg-rose-950/60 text-rose-400 rounded-xl border border-rose-600/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Active Order Workflow */}
      {activeOrder && (
        <div className="bg-black/90 border-2 border-rose-600/60 rounded-2xl p-4 flex flex-col gap-3 shadow-[0_0_25px_rgba(244,63,94,0.2)] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <span className="text-xs font-black text-rose-400 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              EN CURSO ({activeOrder.id})
            </span>
            <span className="text-xs font-black text-white bg-rose-600 px-2.5 py-0.5 rounded-lg shadow-[0_0_10px_rgba(244,63,94,0.5)]">
              Ganancia: ${activeOrder.deliveryFee}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
              <Store className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-zinc-200">{activeOrder.storeName}</p>
                <p className="text-[11px] text-zinc-400">{activeOrder.storeAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
              <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-zinc-200">{activeOrder.customerName}</p>
                <p className="text-[11px] text-zinc-400">{activeOrder.customerAddress}</p>
                {activeOrder.customerPhone && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1 font-semibold">
                    <Phone className="w-3 h-3" /> {activeOrder.customerPhone}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800 text-zinc-300">
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Detalle de productos:</p>
              <p className="text-xs mt-0.5">{activeOrder.items}</p>
              <p className="text-xs font-bold text-zinc-200 mt-1">
                Cobrar al cliente: <span className="text-rose-400 font-black">${activeOrder.price.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="pt-1 flex flex-col gap-2">
            {activeOrder.status === 'assigned' && (
              <button
                onClick={() => onUpdateStatus(activeOrder.id, 'at_store', 'Repartidor llegó al local')}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-[0.99]"
              >
                <Store className="w-4 h-4" /> 1. Llegué al Local
              </button>
            )}

            {activeOrder.status === 'at_store' && (
              <button
                onClick={() => onUpdateStatus(activeOrder.id, 'picked_up', 'Pedido retirado y en camino')}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" /> 2. Retiré el Pedido (En Camino)
              </button>
            )}

            {activeOrder.status === 'picked_up' && (
              <button
                onClick={() => onUpdateStatus(activeOrder.id, 'delivered', 'Entregado con éxito al cliente')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-[0.99]"
              >
                <CheckCircle2 className="w-5 h-5" /> 3. Confirmar Entrega
              </button>
            )}
          </div>
        </div>
      )}

      {/* Available Feed */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-zinc-400 uppercase tracking-wider">Mural de Pedidos ({availableOrders.length})</span>
          <span className="text-rose-400 text-[11px] font-extrabold flex items-center gap-1 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span> En vivo
          </span>
        </div>

        {!isOnline ? (
          <div className="text-center py-10 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl">
            Ponte "Conectado" para ver los pedidos en zona.
          </div>
        ) : availableOrders.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 text-rose-600 animate-spin" />
            <span>Buscando nuevos pedidos QUICK BOX...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
            {availableOrders.map(order => (
              <AvailableOrderCard 
                key={order.id} 
                order={order} 
                hasActiveOrder={!!activeOrder}
                onAccept={() => onAcceptOrder(order.id, driverProfile)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AvailableOrderCard({ order, hasActiveOrder, onAccept }) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 hover:border-rose-600/50 rounded-2xl p-4 flex flex-col gap-3 transition-all group shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-black text-white">{order.storeName}</span>
          <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-rose-400" /> {order.storeAddress}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-black text-white bg-rose-600 px-2.5 py-0.5 rounded-lg shadow-[0_0_10px_rgba(244,63,94,0.4)]">
            +${order.deliveryFee.toLocaleString()}
          </span>
          <p className="text-[10px] text-zinc-500 mt-0.5">Pago envío</p>
        </div>
      </div>

      <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800 text-xs space-y-1">
        <p className="text-zinc-300"><strong>Destino:</strong> {order.customerAddress}</p>
        <p className="text-zinc-400 text-[11px]"><strong>Pedido:</strong> {order.items}</p>
        <p className="text-zinc-400 text-[11px]"><strong>Cobrar:</strong> ${order.price.toLocaleString()}</p>
      </div>

      <button
        onClick={onAccept}
        disabled={hasActiveOrder}
        className={`w-full py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
          hasActiveOrder
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] group-hover:scale-[1.01]'
        }`}
      >
        <Check className="w-4 h-4" /> 
        {hasActiveOrder ? 'Ya tienes un viaje en curso' : 'Aceptar Pedido'}
      </button>
    </div>
  );
}
