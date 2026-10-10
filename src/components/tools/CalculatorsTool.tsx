import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Calculator, Calendar, DollarSign, Percent, Clock } from 'lucide-react';

export const CalculatorsTool: React.FC = () => {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'age' | 'emi' | 'gst' | 'percent'>('age');

  // AGE CALCULATOR STATE
  const [dob, setDob] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const calculateAge = () => {
    if (!dob) return null;
    const d1 = new Date(dob);
    const d2 = new Date(targetDate);
    if (d1 > d2) return null;

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = d2.getTime() - d1.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
  };

  const ageResult = calculateAge();

  // EMI CALCULATOR STATE
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(10.5); // per year
  const [tenureMonths, setTenureMonths] = useState<number>(24);

  const calculateEmi = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureMonths;
    if (P <= 0 || r <= 0 || n <= 0) return null;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  const emiResult = calculateEmi();

  // GST CALCULATOR STATE
  const [gstAmount, setGstAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstMode, setGstMode] = useState<'add' | 'remove'>('add');

  const calculateGst = () => {
    const amt = gstAmount;
    const rate = gstRate;
    if (amt <= 0) return null;

    if (gstMode === 'add') {
      const tax = (amt * rate) / 100;
      const net = amt + tax;
      return {
        base: amt,
        cgst: Math.round((tax / 2) * 100) / 100,
        sgst: Math.round((tax / 2) * 100) / 100,
        totalTax: Math.round(tax * 100) / 100,
        finalTotal: Math.round(net * 100) / 100,
      };
    } else {
      const base = amt / (1 + rate / 100);
      const tax = amt - base;
      return {
        base: Math.round(base * 100) / 100,
        cgst: Math.round((tax / 2) * 100) / 100,
        sgst: Math.round((tax / 2) * 100) / 100,
        totalTax: Math.round(tax * 100) / 100,
        finalTotal: amt,
      };
    }
  };

  const gstResult = calculateGst();

  // PERCENTAGE CALCULATOR STATE
  const [percentPart, setPercentPart] = useState<number>(450);
  const [percentTotal, setPercentTotal] = useState<number>(500);

  const percentScore =
    percentTotal > 0 ? Math.round((percentPart / percentTotal) * 10000) / 100 : 0;

  return (
    <div className="neu-card p-5 sm:p-7 space-y-6">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/60 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neu-icon">
            <Calculator className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'साइबर कैफे कैलकुलेटर सूट' : 'Cyber Cafe Calculator Suite'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Age eligibility for government jobs, Bank loan EMI, GST (+/-), and exam percentage marks.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl neu-inset-sm text-emerald-600 dark:text-emerald-400 shrink-0">
          Working
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl neu-inset-sm mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('age')}
          className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
            activeTab === 'age'
              ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
              : 'neu-tab-idle'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'आयु (Age)' : 'Age Calculator'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emi')}
          className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
            activeTab === 'emi'
              ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
              : 'neu-tab-idle'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'लोन EMI' : 'Loan EMI'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gst')}
          className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
            activeTab === 'gst'
              ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
              : 'neu-tab-idle'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'GST कैलकुलेटर' : 'GST (+ / -)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('percent')}
          className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
            activeTab === 'percent'
              ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400'
              : 'neu-tab-idle'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'प्रतिशत (%)' : 'Percentage'}</span>
        </button>
      </div>

      {/* 1. AGE CALCULATOR */}
      {activeTab === 'age' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'जन्म तिथि (Date of Birth)' : 'Date of Birth (DOB)'}
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm neu-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'किस तारीख को उम्र चाहिए (Cut-off Date)' : 'Age at the date of (Cut-off date)'}
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm neu-input font-mono"
              />
            </div>
          </div>

          <div className="neu-inset p-6 rounded-2xl flex flex-col justify-center">
            {ageResult ? (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {language === 'hi' ? 'सटीक आयु परिणाम' : 'Calculated Exact Age'}
                </span>

                <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
                  {ageResult.years} <span className="text-sm font-normal text-slate-600 dark:text-slate-300">Years</span>{' '}
                  {ageResult.months} <span className="text-sm font-normal text-slate-600 dark:text-slate-300">Months</span>{' '}
                  {ageResult.days} <span className="text-sm font-normal text-slate-600 dark:text-slate-300">Days</span>
                </div>

                <div className="pt-2 border-t border-white/60 dark:border-white/5 text-xs text-slate-500 font-mono">
                  Total days lived: <span className="font-bold text-slate-800 dark:text-slate-200">{ageResult.totalDays.toLocaleString()} days</span>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-500 text-center">
                {language === 'hi' ? 'कृपया सही जन्म तिथि दर्ज करें।' : 'Please enter valid date values.'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. EMI CALCULATOR */}
      {activeTab === 'emi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(1000, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 text-sm neu-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Annual Interest Rate (% p.a.)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 text-sm neu-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tenure (Months)
              </label>
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Math.max(1, parseInt(e.target.value) || 12))}
                className="w-full px-3.5 py-2.5 text-sm neu-input font-mono"
              />
            </div>
          </div>

          <div className="neu-inset p-6 rounded-2xl flex flex-col justify-center space-y-3">
            {emiResult && (
              <>
                <div>
                  <span className="text-xs text-slate-500 block uppercase">Monthly EMI</span>
                  <span className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono">
                    ₹{emiResult.monthlyEmi.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/60 dark:border-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Total Interest:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      ₹{emiResult.totalInterest.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Amount:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      ₹{emiResult.totalPayment.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. GST CALCULATOR */}
      {activeTab === 'gst' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={gstAmount}
                onChange={(e) => setGstAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 text-sm neu-input font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GST Rate
                </label>
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm neu-input font-mono font-medium"
                >
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18% (Standard)</option>
                  <option value={28}>28%</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Operation
                </label>
                <div className="flex gap-1.5 p-1 rounded-xl neu-inset-sm">
                  <button
                    type="button"
                    onClick={() => setGstMode('add')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      gstMode === 'add' ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400' : 'neu-tab-idle'
                    }`}
                  >
                    + Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setGstMode('remove')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      gstMode === 'remove' ? 'neu-tab-active bg-[#E8EDF5] dark:bg-[#1B1E27] text-orange-600 dark:text-orange-400' : 'neu-tab-idle'
                    }`}
                  >
                    - Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="neu-inset p-6 rounded-2xl flex flex-col justify-center space-y-2">
            {gstResult && (
              <>
                <div className="flex justify-between text-xs py-1 border-b border-white/60 dark:border-white/5">
                  <span className="text-slate-500">Base Amount:</span>
                  <span className="font-mono font-semibold">₹{gstResult.base}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">CGST ({gstRate / 2}%):</span>
                  <span className="font-mono font-semibold">₹{gstResult.cgst}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-white/60 dark:border-white/5">
                  <span className="text-slate-500">SGST ({gstRate / 2}%):</span>
                  <span className="font-mono font-semibold">₹{gstResult.sgst}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1 text-orange-600 dark:text-orange-400">
                  <span>Final Total:</span>
                  <span className="font-mono">₹{gstResult.finalTotal}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. PERCENTAGE CALCULATOR */}
      {activeTab === 'percent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Obtained Marks / Value
              </label>
              <input
                type="number"
                value={percentPart}
                onChange={(e) => setPercentPart(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 text-sm neu-input font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Marks / Full Value
              </label>
              <input
                type="number"
                value={percentTotal}
                onChange={(e) => setPercentTotal(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 text-sm neu-input font-mono"
              />
            </div>
          </div>

          <div className="neu-inset p-6 rounded-2xl flex flex-col justify-center text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">
              Percentage Result
            </span>
            <span className="text-4xl font-black text-orange-600 dark:text-orange-400 font-mono">
              {percentScore}%
            </span>
            <span className="text-xs text-slate-400 mt-2 font-mono">
              ({percentPart} out of {percentTotal})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
