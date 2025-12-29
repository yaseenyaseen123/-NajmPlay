import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  // في التطبيق الحقيقي، يجب التحقق من صلاحيات المستخدم
  // هذا مثال بسيط للواجهة فقط

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: '📊' },
    { id: 'content', name: 'المحتوى', icon: '🎬' },
    { id: 'series', name: 'المسلسلات', icon: '📺' },
    { id: 'channels', name: 'القنوات', icon: '📡' },
    { id: 'subscriptions', name: 'الاشتراكات', icon: '💳' },
    { id: 'payments', name: 'المدفوعات', icon: '💰' },
    { id: 'users', name: 'المستخدمين', icon: '👥' },
    { id: 'settings', name: 'الإعدادات', icon: '⚙️' },
  ]

  return (
    <>
      <Head>
        <title>لوحة التحكم - NajmPlay</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100" dir="rtl">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">لوحة تحكم NajmPlay</h1>
                <p className="text-purple-100 mt-1">إدارة المحتوى والاشتراكات</p>
              </div>
              <div className="flex gap-4">
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
                  الإشعارات (3)
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                >
                  الموقع الرئيسي
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="w-64 bg-white rounded-xl shadow-md p-6 h-fit sticky top-8">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-right px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'content' && <ContentTab />}
              {activeTab === 'series' && <SeriesTab />}
              {activeTab === 'channels' && <ChannelsTab />}
              {activeTab === 'subscriptions' && <SubscriptionsTab />}
              {activeTab === 'payments' && <PaymentsTab />}
              {activeTab === 'users' && <UsersTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

// Overview Tab
function OverviewTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">نظرة عامة</h2>
      
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="المستخدمين النشطين" value="1,234" icon="👥" color="blue" />
        <StatCard title="الاشتراكات" value="856" icon="💳" color="green" />
        <StatCard title="الأفلام" value="3,421" icon="🎬" color="purple" />
        <StatCard title="الإيرادات الشهرية" value="$12,450" icon="💰" color="yellow" />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">الأنشطة الأخيرة</h3>
        <div className="space-y-3">
          <ActivityItem text="اشتراك جديد من user@example.com" time="منذ 5 دقائق" />
          <ActivityItem text="تم إضافة فيلم جديد: The Matrix" time="منذ ساعة" />
          <ActivityItem text="دفع ناجح بقيمة $9.99" time="منذ ساعتين" />
        </div>
      </div>
    </div>
  )
}

// Content Tab
function ContentTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الأفلام</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
          إضافة فيلم جديد +
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="بحث في الأفلام..." 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">العنوان</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">النوع</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">السنة</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">المشاهدات</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الحالة</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">مثال فيلم 1</td>
              <td className="px-4 py-3 text-sm">أكشن</td>
              <td className="px-4 py-3 text-sm">2024</td>
              <td className="px-4 py-3 text-sm">1,234</td>
              <td className="px-4 py-3 text-sm">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">نشط</span>
              </td>
              <td className="px-4 py-3 text-sm">
                <button className="text-blue-600 hover:text-blue-800 ml-3">تعديل</button>
                <button className="text-red-600 hover:text-red-800">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Series Tab
function SeriesTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المسلسلات</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
          إضافة مسلسل جديد +
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-600">قائمة المسلسلات والمواسم والحلقات...</p>
        <p className="text-sm text-gray-500 mt-2">يمكن إضافة نماذج لإدارة المسلسلات هنا</p>
      </div>
    </div>
  )
}

// Channels Tab
function ChannelsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">إدارة القنوات المباشرة</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
          إضافة قناة جديدة +
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-600">قائمة القنوات المباشرة...</p>
      </div>
    </div>
  )
}

// Subscriptions Tab
function SubscriptionsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">إدارة الاشتراكات</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">الاشتراكات النشطة</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">المستخدم</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الخطة</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الحالة</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">تاريخ الانتهاء</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm">user@example.com</td>
              <td className="px-4 py-3 text-sm">خطة شهرية</td>
              <td className="px-4 py-3 text-sm">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">نشط</span>
              </td>
              <td className="px-4 py-3 text-sm">2024-01-30</td>
              <td className="px-4 py-3 text-sm">
                <button className="text-blue-600 hover:text-blue-800">عرض</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Payments Tab
function PaymentsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">إدارة المدفوعات</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">المعاملات الأخيرة</h3>
        <p className="text-gray-600">قائمة بجميع معاملات PayPal...</p>
      </div>
    </div>
  )
}

// Users Tab
function UsersTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-600">قائمة المستخدمين وصلاحياتهم...</p>
      </div>
    </div>
  )
}

// Settings Tab
function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">الإعدادات</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">إعدادات PayPal</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="PayPal Client ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="PayPal Client Secret"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">إعدادات WhatsApp</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API URL</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://api.whatsapp.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="WhatsApp API Key"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
          حفظ التغييرات
        </button>
      </div>
    </div>
  )
}

// Helper Components
function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-3xl">{icon}</div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <div className="text-sm opacity-90">{title}</div>
    </div>
  )
}

function ActivityItem({ text, time }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-700">{text}</span>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  )
}
