import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalLab, Doctor, LabTest, RideOption } from '../../types';
import { sampleHospitalsLabs, sampleRides } from '../../data/mockData';
import {
  ShieldAlert,
  MapPin,
  Compass,
  Phone,
  PhoneCall,
  Share2,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  Search,
  Car,
  Zap,
  Bike,
  HeartPulse,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  FlaskConical,
} from 'lucide-react';
import { NestyMascot } from '../common/NestyMascot';

export const SosScreen: React.FC = () => {
  const {
    profile,
    updateProfile,
    activeRide,
    bookRide,
    cancelRide,
    addBooking,
    showToast,
  } = useApp();

  // Active sub-tab in emergency view: 'hospitals' | 'labs' | 'rides'
  const [activeTab, setActiveTab] = useState<'hospitals' | 'labs' | 'rides'>('hospitals');

  // Emergency setup state
  const [emergencyType, setEmergencyType] = useState<string>('Acute Pelvic / Abdominal Pain');
  const [shareLocationConsent, setShareLocationConsent] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [searchArea, setSearchArea] = useState<string>('');

  // Selected details modal
  const [selectedHospital, setSelectedHospital] = useState<HospitalLab | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [isHomeCollection, setIsHomeCollection] = useState<boolean>(true);

  // Selected ride for booking
  const [selectedRideOption, setSelectedRideOption] = useState<RideOption>(sampleRides[0]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported in this browser.', 'warning');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        updateProfile({
          locationPermissionGranted: true,
          areaLandmark: 'GPS Verified: Indiranagar Clinic Corridor',
        });
        showToast('GPS Verified: Nearby hospitals re-sorted by proximity', 'success');
      },
      (err) => {
        setIsLocating(false);
        showToast('Location permission not granted. Using manual area.', 'info');
      },
      { timeout: 7000 }
    );
  };

  const emergencyTypes = [
    'Acute Pelvic / Abdominal Pain',
    'Severe Heavy Bleeding',
    'High Fever / Fainting',
    'Severe Allergic Reaction',
    'General Medical SOS',
  ];

  const filteredHospitals = sampleHospitalsLabs.filter(
    (item) => item.type === 'Hospital' && (searchArea ? item.area.toLowerCase().includes(searchArea.toLowerCase()) : true)
  );

  const filteredLabs = sampleHospitalsLabs.filter(
    (item) => item.type === 'Laboratory' && (searchArea ? item.area.toLowerCase().includes(searchArea.toLowerCase()) : true)
  );

  const handleBookDoctorSlot = (hosp: HospitalLab, doc: Doctor) => {
    if (!selectedSlot) {
      showToast('Please select an appointment time slot first', 'warning');
      return;
    }
    addBooking({
      type: 'Doctor',
      providerName: hosp.name,
      itemName: `${doc.name} (${doc.specialty})`,
      date: 'Today / Immediate Emergency Slot',
      timeSlot: selectedSlot,
      status: 'Confirmed',
      amount: doc.consultationFee,
    });
    setSelectedDoctor(null);
    setSelectedSlot('');
  };

  const handleBookLabTest = (lab: HospitalLab, test: LabTest) => {
    addBooking({
      type: 'Lab',
      providerName: lab.name,
      itemName: `${test.name} (${isHomeCollection ? 'Home Collection' : 'Walk-in'})`,
      date: 'Today within 45m',
      timeSlot: 'Immediate Fast-Track',
      status: 'Confirmed',
      amount: test.price,
    });
    setSelectedLabTest(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Red Alert Emergency SOS Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <NestyMascot
              mood="doctor"
              size="lg"
              bubbleText="Don't panic! 🐣 Help is immediately reachable."
            />
            <div>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs">
                SC4 • Emergency SOS & Medical Fleet
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                24/7 Rapid SOS & Care Finder
              </h1>
              <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
                One-tap access to emergency telephone lines, nearby verified women's hospitals, doctor consults, and priority rides.
              </p>
            </div>
          </div>

          {/* Quick SOS Trigger Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <a
              href="tel:112"
              onClick={() => showToast('Opening emergency telephone call to 112...', 'info')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-red-600 font-black text-sm shadow-lg hover:bg-rose-50 transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5 text-red-600 animate-bounce" />
              <span>Call 112 (National Emergency)</span>
            </a>

            <button
              type="button"
              onClick={() =>
                showToast(`Emergency SMS & GPS location sent to ${profile.contactNumber}`, 'success')
              }
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Alert Family Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notice & Prototype Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Prototype Safety Notice:</strong> This web application simulates emergency logistics, ride dispatches, and hospital bookings. It cannot directly dispatch a real municipal ambulance. If you are experiencing a life-threatening medical emergency, call <strong>112</strong> immediately or go to the nearest emergency room.
        </p>
      </div>

      {/* Step 1: Location & Emergency Details */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-rose-600 tracking-wider">
              Step 1 • Emergency Profile
            </span>
            <h3 className="text-base font-extrabold text-slate-800">
              Verify Location & Nature of Medical Concern
            </h3>
          </div>

          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-xs font-bold hover:bg-violet-100 transition"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Detect Location'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Current Area & Landmark
            </label>
            <input
              type="text"
              value={profile.areaLandmark}
              onChange={(e) => updateProfile({ areaLandmark: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              placeholder="e.g. Indiranagar, Bengaluru"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Emergency Type
            </label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              {emergencyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none pb-2">
              <input
                type="checkbox"
                checked={shareLocationConsent}
                onChange={(e) => setShareLocationConsent(e.target.checked)}
                className="rounded border-slate-300 text-rose-600"
              />
              <span>Consent to share location with responders</span>
            </label>
          </div>
        </div>
      </div>

      {/* Step 2 & 3: Tabs (Hospitals / Labs / Rides) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('hospitals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
                activeTab === 'hospitals'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Hospitals & Doctors (2)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('labs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
                activeTab === 'labs'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Laboratories & Scans (2)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rides')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
                activeTab === 'rides'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Priority Medical Rides</span>
            </button>
          </div>

          {/* Area search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
              placeholder="Search by area or hospital..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* TAB 1: HOSPITALS */}
        {activeTab === 'hospitals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img src={hosp.image} alt={hosp.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase">
                      {hosp.openStatus}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold">
                      {hosp.distanceKm} km away
                    </span>
                  </div>

                  <div className="p-5">
                    <h4 className="text-base font-extrabold text-slate-800">{hosp.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{hosp.address}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {hosp.services.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Doctor preview */}
                    {hosp.doctors && hosp.doctors.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                          On-Duty Specialists ({hosp.doctors.length})
                        </span>
                        <div className="space-y-1.5">
                          {hosp.doctors.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs"
                            >
                              <div>
                                <p className="font-bold text-slate-800">{doc.name}</p>
                                <p className="text-[10px] text-slate-400">{doc.specialty}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedHospital(hosp);
                                  setSelectedDoctor(doc);
                                  setSelectedSlot(doc.slots[0] || '11:00 AM');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 transition"
                              >
                                Book Slot
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${hosp.contactNumber}`}
                    onClick={() => showToast(`Calling ${hosp.name}...`, 'info')}
                    className="flex-1 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Emergency</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('rides');
                      showToast(`Routing medical ride to ${hosp.name}`, 'info');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition flex items-center justify-center gap-1.5"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Book Ride to Hospital</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: LABS */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img src={lab.image} alt={lab.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-violet-600 text-white text-[10px] font-extrabold uppercase">
                      {lab.openStatus}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold">
                      {lab.distanceKm} km away
                    </span>
                  </div>

                  <div className="p-5">
                    <h4 className="text-base font-extrabold text-slate-800">{lab.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{lab.address}</p>

                    {lab.tests && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                          Available Female Panels & Scans
                        </span>
                        {lab.tests.map((test) => (
                          <div
                            key={test.id}
                            className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs flex items-center justify-between gap-2"
                          >
                            <div>
                              <p className="font-bold text-slate-800">{test.name}</p>
                              <p className="text-[10px] text-slate-400">
                                Turnaround: {test.turnaroundHours}h •{' '}
                                {test.fastingRequired ? 'Fasting Required' : 'No Fasting'}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-extrabold text-slate-900 block">₹{test.price}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedHospital(lab);
                                  setSelectedLabTest(test);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-violet-600 text-white text-[10px] font-bold hover:bg-violet-700 transition"
                              >
                                Book Test
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <a
                    href={`tel:${lab.contactNumber}`}
                    className="w-full py-2.5 rounded-xl border border-violet-200 text-violet-700 hover:bg-violet-50 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Diagnostic Center</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: TRANSPORTATION & RIDES */}
        {activeTab === 'rides' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Priority Medical Ride Fleet</h3>
              <p className="text-xs text-slate-400">
                Pick an immediate transport option to nearby medical center
              </p>
            </div>

            {/* If ride is actively booked */}
            {activeRide ? (
              <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-extrabold text-sm text-emerald-400">
                      {activeRide.status}: {activeRide.option.name}
                    </span>
                  </div>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-mono">
                    OTP: <strong className="text-amber-300 text-sm tracking-widest">{activeRide.otp}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Driver</span>
                    <p className="font-bold text-sm text-white">{activeRide.driverName}</p>
                    <p className="text-slate-400">{activeRide.driverPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle Number</span>
                    <p className="font-bold text-sm text-white">{activeRide.vehicleNumber}</p>
                    <p className="text-slate-400">Sanitized with First-Aid Kit</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Arrival</span>
                    <p className="font-bold text-sm text-pink-400">{activeRide.etaMinutes} Minutes</p>
                    <p className="text-slate-400">Heading towards your location</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => showToast(`Calling driver ${activeRide.driverName}...`, 'info')}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </button>

                  <button
                    type="button"
                    onClick={cancelRide}
                    className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition"
                  >
                    Cancel Ride
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {sampleRides.map((ride) => {
                    const isSelected = selectedRideOption.id === ride.id;
                    return (
                      <div
                        key={ride.id}
                        onClick={() => setSelectedRideOption(ride)}
                        className={`p-4 rounded-2xl border cursor-pointer transition select-none flex flex-col justify-between ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50/50 shadow-md ring-2 ring-rose-300'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              ETA {ride.etaMinutes}m
                            </span>
                            <span className="text-sm font-extrabold text-slate-900">₹{ride.price}</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-800">{ride.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                            {ride.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                          <span>{isSelected ? 'Selected' : 'Select'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => bookRide(selectedRideOption)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-extrabold text-sm shadow-lg shadow-rose-200 hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <Car className="w-5 h-5" />
                  <span>Book {selectedRideOption.name} (Simulated Dispatch)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Doctor Slot Booking Modal */}
      {selectedDoctor && selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-rose-50 to-pink-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Instant Hospital Slot
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-1">
                  {selectedDoctor.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoctor(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">{selectedHospital.name}</p>
                <p className="text-slate-500">{selectedDoctor.specialty} • {selectedDoctor.experienceYears} yrs exp</p>
                <p className="text-slate-700 font-extrabold mt-1">Fee: ₹{selectedDoctor.consultationFee}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-2">Available Slots Today</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDoctor.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition ${
                        selectedSlot === slot
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Pay at hospital counter</span>
              <button
                type="button"
                onClick={() => handleBookDoctorSlot(selectedHospital, selectedDoctor)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lab Booking Modal */}
      {selectedLabTest && selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-violet-50 to-pink-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  Diagnostic Booking
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-1">
                  {selectedLabTest.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLabTest(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">{selectedHospital.name}</p>
                <p className="text-slate-500">Turnaround: {selectedLabTest.turnaroundHours} hours</p>
                <p className="text-slate-700 font-extrabold mt-1">Price: ₹{selectedLabTest.price}</p>
              </div>

              {selectedLabTest.homeCollectionAvailable && (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isHomeCollection}
                      onChange={(e) => setIsHomeCollection(e.target.checked)}
                      className="rounded border-slate-300 text-violet-600"
                    />
                    <span>Opt for Home Blood Collection (within 45 mins)</span>
                  </label>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Digital report via WhatsApp & App</span>
              <button
                type="button"
                onClick={() => handleBookLabTest(selectedHospital, selectedLabTest)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition"
              >
                Confirm Test Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
