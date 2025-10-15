import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Search, Printer, BarChart3, Users, StickyNote, X } from 'lucide-react';

export default function KhaoKhaiJiaoPOS() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [showPayment, setShowPayment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [selectedTable, setSelectedTable] = useState('ทานที่ร้าน');
  const [showSummary, setShowSummary] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [noteItem, setNoteItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('เงินสด');
  
  // Sales history
  const [salesHistory, setSalesHistory] = useState([]);
  const [orderNumber, setOrderNumber] = useState(1);

  const categories = ['ทั้งหมด', 'ข้าวไข่เจียว', 'เครื่องดื่ม', 'ของทานเล่น'];
  const tables = ['ทานที่ร้าน', 'โต๊ะ 1', 'โต๊ะ 2', 'โต๊ะ 3', 'โต๊ะ 4', 'โต๊ะ 5', 'กลับบ้าน'];
  const paymentMethods = ['เงินสด', 'โอนเงิน', 'QR Code'];

  const menuItems = [
    { id: 1, name: 'ข้าวไข่เจียวธรรมดา', price: 35, category: 'ข้าวไข่เจียว', image: '🍳', sales: 45 },
    { id: 2, name: 'ข้าวไข่เจียวหมูสับ', price: 45, category: 'ข้าวไข่เจียว', image: '🍳', sales: 38 },
    { id: 3, name: 'ข้าวไข่เจียวกุ้ง', price: 55, category: 'ข้าวไข่เจียว', image: '🍤', sales: 25 },
    { id: 4, name: 'ข้าวไข่เจียวปู', price: 65, category: 'ข้าวไข่เจียว', image: '🦀', sales: 15 },
    { id: 5, name: 'ข้าวไข่เจียวผักรวม', price: 40, category: 'ข้าวไข่เจียว', image: '🥬', sales: 30 },
    { id: 6, name: 'ข้าวไข่เจียวพิเศษ', price: 70, category: 'ข้าวไข่เจียว', image: '⭐', sales: 20 },
    { id: 7, name: 'น้ำเปล่า', price: 10, category: 'เครื่องดื่ม', image: '💧', sales: 50 },
    { id: 8, name: 'โค้ก', price: 15, category: 'เครื่องดื่ม', image: '🥤', sales: 35 },
    { id: 9, name: 'น้ำส้ม', price: 20, category: 'เครื่องดื่ม', image: '🍊', sales: 28 },
    { id: 10, name: 'น้ำชา', price: 15, category: 'เครื่องดื่ม', image: '🧋', sales: 32 },
    { id: 11, name: 'ไข่เจียวเปล่า', price: 20, category: 'ของทานเล่น', image: '🍳', sales: 18 },
    { id: 12, name: 'ไข่ดาว', price: 15, category: 'ของทานเล่น', image: '🍳', sales: 22 },
  ];

  const topSelling = [...menuItems].sort((a, b) => b.sales - a.sales).slice(0, 3);

  const filteredItems = menuItems.filter(item => {
    const matchCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, note: '' }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const addNote = (id, note) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, note } : item
    ));
    setNoteItem(null);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateChange = () => {
    const received = parseFloat(cashReceived) || 0;
    const total = calculateTotal();
    return received - total;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('กรุณาเลือกรายการอาหาร');
      return;
    }
    setShowPayment(true);
  };

  const confirmPayment = () => {
    const receipt = {
      orderNo: orderNumber,
      date: new Date(),
      table: selectedTable,
      items: [...cart],
      total: calculateTotal(),
      paymentMethod: paymentMethod,
      cashReceived: paymentMethod === 'เงินสด' ? parseFloat(cashReceived) || 0 : calculateTotal(),
      change: paymentMethod === 'เงินสด' ? calculateChange() : 0
    };
    
    setSalesHistory([...salesHistory, receipt]);
    setLastReceipt(receipt);
    setOrderNumber(orderNumber + 1);
    setCart([]);
    setShowPayment(false);
    setCashReceived('');
    setShowReceipt(true);
  };

  const getTodaySales = () => {
    const today = new Date().toDateString();
    return salesHistory.filter(sale => new Date(sale.date).toDateString() === today);
  };

  const getTodayRevenue = () => {
    return getTodaySales().reduce((sum, sale) => sum + sale.total, 0);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Section */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 rounded-lg mb-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🍳 ร้านข้าวไข่เจียวป้าแดง</h1>
              <p className="text-sm opacity-90 mt-1">ระบบจัดการคำสั่งซื้อ</p>
            </div>
            <button
              onClick={() => setShowSummary(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <BarChart3 size={20} />
              <span className="font-semibold">สรุปยอดขาย</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ค้นหาเมนู..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Top Selling */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>⭐</span> เมนูขายดี
          </h3>
          <div className="flex gap-3 overflow-x-auto">
            {topSelling.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="min-w-32 bg-gradient-to-br from-orange-50 to-yellow-50 p-3 rounded-lg border-2 border-orange-200 hover:border-orange-400 transition-all"
              >
                <div className="text-3xl mb-1">{item.image}</div>
                <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-orange-600 font-bold">฿{item.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <div className="text-5xl mb-2">{item.image}</div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.name}</h3>
                <p className="text-orange-600 font-bold">฿{item.price}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white shadow-2xl flex flex-col relative">
        <div className="bg-orange-500 text-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart size={24} />
            <h2 className="text-xl font-bold">รายการสั่งซื้อ</h2>
          </div>
          
          {/* Table Selection */}
          <div className="flex items-center gap-2">
            <Users size={18} />
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="flex-1 bg-white bg-opacity-20 text-white rounded px-3 py-2 text-sm font-medium"
            >
              {tables.map(table => (
                <option key={table} value={table} className="text-gray-800">{table}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <ShoppingCart size={64} className="mx-auto mb-4 opacity-30" />
              <p>ยังไม่มีรายการสั่งซื้อ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">฿{item.price}</p>
                      {item.note && (
                        <p className="text-xs text-orange-600 mt-1 italic">📝 {item.note}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setNoteItem(item)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                      >
                        <StickyNote size={16} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded hover:bg-orange-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="font-bold text-orange-600">
                      ฿{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total and Checkout */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700">ยอดรวมทั้งหมด</span>
            <span className="text-2xl font-bold text-orange-600">฿{calculateTotal()}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
              cart.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl active:scale-95'
            }`}
          >
            ชำระเงิน
          </button>
        </div>

        {/* Note Modal */}
        {noteItem && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">เพิ่มหมายเหตุ - {noteItem.name}</h3>
              <textarea
                defaultValue={noteItem.note}
                placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย"
                className="w-full border border-gray-300 rounded p-3 mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                id="noteInput"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setNoteItem(null)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    const note = document.getElementById('noteInput').value;
                    addNote(noteItem.id, note);
                  }}
                  className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">💰</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">ยืนยันการชำระเงิน</h2>
                <p className="text-gray-600">{selectedTable}</p>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">วิธีการชำระเงิน</label>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded-lg font-medium transition-all ${
                        paymentMethod === method
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">฿{item.price} x {item.quantity}</p>
                      {item.note && <p className="text-xs text-orange-600 italic">📝 {item.note}</p>}
                    </div>
                    <p className="font-semibold text-orange-600">฿{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">ยอดที่ต้องชำระ</span>
                  <span className="text-3xl font-bold">฿{calculateTotal()}</span>
                </div>
              </div>

              {/* Cash Input */}
              {paymentMethod === 'เงินสด' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">รับเงินมา</label>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {cashReceived && calculateChange() >= 0 && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-semibold">เงินทอน</span>
                        <span className="text-2xl font-bold text-green-600">฿{calculateChange()}</span>
                      </div>
                    </div>
                  )}
                  {cashReceived && calculateChange() < 0 && (
                    <p className="mt-2 text-red-600 text-sm">เงินไม่พอ</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPayment(false);
                    setCashReceived('');
                  }}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmPayment}
                  disabled={paymentMethod === 'เงินสด' && calculateChange() < 0}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    paymentMethod === 'เงินสด' && calculateChange() < 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
                  }`}
                >
                  ยืนยันชำระเงิน
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceipt && lastReceipt && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full" id="receipt">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">🍳 ร้านข้าวไข่เจียวป้าแดง</h2>
                <p className="text-sm text-gray-600">ใบเสร็จรับเงิน</p>
              </div>
              
              <div className="border-t border-b border-dashed py-3 mb-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">เลขที่:</span>
                  <span className="font-semibold">#{String(lastReceipt.orderNo).padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">วันที่:</span>
                  <span>{new Date(lastReceipt.date).toLocaleString('th-TH')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">โต๊ะ:</span>
                  <span className="font-semibold">{lastReceipt.table}</span>
                </div>
              </div>

              <div className="mb-3">
                {lastReceipt.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-2">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600 text-xs">฿{item.price} x {item.quantity}</p>
                      {item.note && <p className="text-xs text-orange-600 italic">📝 {item.note}</p>}
                    </div>
                    <span className="font-semibold">฿{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-3 mb-3">
                <div className="flex justify-between text-lg font-bold mb-2">
                  <span>รวมทั้งหมด</span>
                  <span className="text-orange-600">฿{lastReceipt.total}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>ชำระด้วย</span>
                  <span>{lastReceipt.paymentMethod}</span>
                </div>
                {lastReceipt.paymentMethod === 'เงินสด' && (
                  <>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>รับเงิน</span>
                      <span>฿{lastReceipt.cashReceived}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-green-600">
                      <span>เงินทอน</span>
                      <span>฿{lastReceipt.change}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center text-sm text-gray-600 mb-4">
                <p>ขอบคุณที่ใช้บริการค่ะ 🙏</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={printReceipt}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <Printer size={18} />
                  พิมพ์ใบเสร็จ
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sales Summary Modal */}
        {showSummary && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📊 สรุปยอดขายวันนี้</h2>
                <button
                  onClick={() => setShowSummary(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <p className="text-sm opacity-90">ยอดขายรวม</p>
                  <p className="text-3xl font-bold">฿{getTodayRevenue()}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <p className="text-sm opacity-90">จำนวนออเดอร์</p>
                  <p className="text-3xl font-bold">{getTodaySales().length}</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 mb-3">ประวัติการขาย</h3>
              <div className="space-y-3">
                {getTodaySales().length === 0 ? (
                  <p className="text-center text-gray-400 py-8">ยังไม่มีรายการขาย</p>
                ) : (
                  getTodaySales().reverse().map((sale, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">ออเดอร์ #{String(sale.orderNo).padStart(4, '0')}</p>
                          <p className="text-sm text-gray-600">{sale.table}</p>
                          <p className="text-xs text-gray-500">{new Date(sale.date).toLocaleTimeString('th-TH')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">฿{sale.total}</p>
                          <p className="text-xs text-gray-600">{sale.paymentMethod}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        {sale.items.map((item, i) => (
                          <span key={i}>
                            {item.name} x{item.quantity}
                            {i < sale.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}