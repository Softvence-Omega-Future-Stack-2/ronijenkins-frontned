import { useEffect, useState } from 'react';
import { Edit2, X } from 'lucide-react';
import { toast } from 'react-toastify';

import {
  useGetSubscriptionsQuery,
  useUpdateSubscriptionPriceMutation,
  useToggleFreeTierMutation,
} from '../../redux/features/admin/subsciptionApi';

interface Package {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  isActive: boolean;
  canEdit: boolean;
  price_id?: string;
}

export default function SubsCriptionTab() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const [editingPeriod, setEditingPeriod] = useState<'monthly' | 'yearly' | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editPriceId, setEditPriceId] = useState(''); // ✅ new

  const { data: subscriptionData, isLoading: isLoadingSubs } = useGetSubscriptionsQuery();
  const [updatePrice, { isLoading: isUpdatingPrice }] = useUpdateSubscriptionPriceMutation();
  const [toggleFreeTier, { isLoading: isTogglingFree }] = useToggleFreeTierMutation();

  useEffect(() => {
    if (subscriptionData) {
      const mapped: Package[] = subscriptionData.map((sub, index) => ({
        id: String(index + 1),
        name: sub.plan_name,
        price: sub.price,
        period: sub.plan_name.toLowerCase().includes('monthly') ? 'monthly' : 'yearly',
        description: sub.plan_name.toLowerCase().includes('free')
          ? 'You can toggle this package on/off.'
          : 'You can edit this package through edit button.',
        isActive: sub.status,
        canEdit: !sub.plan_name.toLowerCase().includes('free'),
        price_id: sub.stripe_price_id || '',
      }));
      setPackages(mapped);
      setIsDirty(false);
    }
  }, [subscriptionData]);

  const freeTier = packages.find((p) => p.name.toLowerCase().includes('free'));

  const handleToggle = (id: string) => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg))
    );
    if (id === freeTier?.id) setIsDirty(true);
  };

  const handleSaveFreeTier = async () => {
    if (!freeTier) return;
    try {
      const res = await toggleFreeTier().unwrap();
      toast.success(res.message || 'Free subscription status updated!', { position: 'top-right' });
      setIsDirty(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error updating free subscription', { position: 'top-right' });
    }
  };

  const handleEditClick = (period: 'monthly' | 'yearly') => {
    const pkg = packages.find((p) => p.period === period && p.canEdit);
    setEditPrice(pkg?.price.toFixed(2) || '');
    setEditPriceId(pkg?.price_id || ''); // ✅ current price_id prefill
    setEditingPeriod(period);
  };

  const handleSave = async () => {
    if (!editingPeriod) return;
    const pkg = packages.find((p) => p.period === editingPeriod && p.canEdit);
    if (!pkg) return;

    if (!editPriceId.trim()) {
      toast.error('Please enter a Stripe Price ID', { position: 'top-right' });
      return;
    }

    try {
      await updatePrice({
        plan_name: pkg.name,
        price_id: editPriceId.trim(), // ✅ manually typed or prefilled
        price: parseFloat(editPrice),
      }).unwrap();

      setPackages((prev) =>
        prev.map((p) =>
          p.period === editingPeriod && p.canEdit
            ? { ...p, price: parseFloat(editPrice) || p.price, price_id: editPriceId.trim() }
            : p
        )
      );

      toast.success(
        `${editingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} price updated!`,
        { position: 'top-right' }
      );
      setEditingPeriod(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error updating price', { position: 'top-right' });
    }
  };

  const handleCancel = () => setEditingPeriod(null);

  if (isLoadingSubs) return <p>Loading subscriptions...</p>;

  return (
    <div>
      <div>
        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            className={`p-4 sm:p-6 ${index !== packages.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-6">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-normal text-gray-900">${pkg.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">/ {pkg.period}</span>
                  </div>
                </div>
                <p className="text-xs font-normal text-[#2F80ED]">{pkg.description}</p>
              </div>

              <div className="flex items-center gap-3">
                {pkg.canEdit ? (
                  <button
                    onClick={() => handleEditClick(pkg.period as 'monthly' | 'yearly')}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors cursor-pointer"
                  >
                    <span>Edit</span>
                    <Edit2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggle(pkg.id)}
                    disabled={isTogglingFree}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer disabled:opacity-60 ${
                      pkg.isActive ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        pkg.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {freeTier && isDirty && (
        <div className="mt-4">
          <button
            onClick={handleSaveFreeTier}
            disabled={isTogglingFree}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            {isTogglingFree ? 'Saving...' : 'Save Free Tier Status'}
          </button>
        </div>
      )}

      {editingPeriod && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={handleCancel}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Edit {editingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Package
                </h2>
                <p className="text-sm text-gray-600">
                  Update pricing for your {editingPeriod} package.
                </p>
              </div>

              <div className="space-y-5">

                {/* ✅ Stripe Price ID Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stripe Price ID
                  </label>
                  <input
                    type="text"
                    value={editPriceId}
                    onChange={(e) => setEditPriceId(e.target.value)}
                    placeholder="price_xxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">Find this in your Stripe Dashboard</p>
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Premium {editingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Price ($)
                  </label>
                  <input
                    type="text"
                    value={editPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setEditPrice(value);
                      }
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isUpdatingPrice}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-60"
                  >
                    {isUpdatingPrice ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}