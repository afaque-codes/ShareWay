import React, { useState } from 'react';
import { Shield, Car, Plus, CheckCircle, Info } from 'lucide-react';

export default function VehicleView() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Pearl White',
      plateNumber: 'DL-01-AB-1234',
      totalSeats: 4,
      vehicleType: 'sedan',
      isPrimary: true,
    },
  ]);

  const [form, setForm] = useState({
    make: '',
    model: '',
    year: 2023,
    color: '',
    plateNumber: '',
    totalSeats: 4,
    vehicleType: 'sedan',
  });

  const handleAddVehicle = (e) => {
    e.preventDefault();
    setVehicles((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...form,
        isPrimary: false,
      },
    ]);
    setShowAddForm(false);
    setForm({ make: '', model: '', year: 2023, color: '', plateNumber: '', totalSeats: 4, vehicleType: 'sedan' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Vehicle Management</h2>
          <p className="text-sm text-[#475f6e] mt-1">
            Register and manage your cars for community rides. Multiple vehicles supported.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Add Vehicle'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddVehicle} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-4">
          <h3 className="text-base font-bold text-[#0b2b3d]">Register New Vehicle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0b2b3d] mb-1">Make</label>
              <input
                type="text"
                required
                placeholder="e.g. Honda"
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b2b3d] mb-1">Model</label>
              <input
                type="text"
                required
                placeholder="e.g. City"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0b2b3d] mb-1">License Plate</label>
              <input
                type="text"
                required
                placeholder="e.g. DL-02-CD-5678"
                value={form.plateNumber}
                onChange={(e) => setForm({ ...form, plateNumber: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:outline-none uppercase"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#008f87] text-white font-bold text-xs shadow-md"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      )}

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#e6f6f5] text-[#008f87] flex items-center justify-center shrink-0">
              <Car className="w-7 h-7" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-[#0b2b3d]">{v.make} {v.model}</h4>
                {v.isPrimary && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{v.color} • {v.year} • {v.totalSeats} seats</p>
              <div className="text-xs font-bold text-[#008f87] pt-1">
                Plate: {v.plateNumber}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
