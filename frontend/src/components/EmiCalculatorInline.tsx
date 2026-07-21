"use client";
import React, { useState, useEffect } from "react";

interface EmiCalculatorInlineProps {
  initialLoanAmount: number;
}

export function EmiCalculatorInline({ initialLoanAmount }: EmiCalculatorInlineProps) {
  const [loanAmount, setLoanAmount] = useState(initialLoanAmount);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTenure, setLoanTenure] = useState(10); // years

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Sync with initial amount when it changes (e.g. navigation)
  useEffect(() => {
    if (initialLoanAmount) {
      setLoanAmount(initialLoanAmount);
    }
  }, [initialLoanAmount]);

  useEffect(() => {
    if (loanAmount > 0 && interestRate > 0 && loanTenure > 0) {
      const P = loanAmount;
      const R = interestRate / 12 / 100;
      const N = loanTenure * 12;

      // E = P * R * ((1+R)^N) / (((1+R)^N) - 1)
      const mathPow = Math.pow(1 + R, N);
      const E = (P * R * mathPow) / (mathPow - 1);
      
      setEmi(E);
      setTotalInterest(E * N - P);
    } else {
      setEmi(0);
      setTotalInterest(0);
    }
  }, [loanAmount, interestRate, loanTenure]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="w-full bg-[#111] border border-white/10 p-8 md:p-16 rounded-sm">
      <h3 className="text-sm font-bold tracking-[0.3em] uppercase mb-12 text-white/40 pb-4 border-b border-white/10">ESTIMATE YOUR EMI</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Sliders Section */}
        <div className="flex flex-col gap-10">
          {/* Loan Amount */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-white font-bold uppercase tracking-widest text-xs md:text-sm">
              <span>Loan Amount</span>
              <div className="flex items-center gap-1">
                <span className="text-white/60">₹</span>
                <input
                  type="number"
                  value={loanAmount || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") setLoanAmount(0);
                    else {
                      const num = Number(val);
                      if (num <= 100000000) setLoanAmount(num);
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className="bg-transparent border-b border-white/10 hover:border-white/30 focus:border-white focus:outline-none w-32 text-right font-bold text-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-1"
                />
              </div>
            </div>
            <input
              type="range"
              min={100000}
              max={Math.max(20000000, initialLoanAmount * 1.5)}
              step={10000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Interest Rate */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-white font-bold uppercase tracking-widest text-xs md:text-sm">
              <span>Interest Rate</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={interestRate || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") setInterestRate(0);
                    else {
                      const num = Number(val);
                      if (num <= 100) setInterestRate(num);
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className="bg-transparent border-b border-white/10 hover:border-white/30 focus:border-white focus:outline-none w-16 text-right font-bold text-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-1"
                />
                <span className="text-white/60">%</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Loan Tenure */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-white font-bold uppercase tracking-widest text-xs md:text-sm">
              <span>Loan Tenure</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={loanTenure || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") setLoanTenure(0);
                    else {
                      const num = Number(val);
                      if (num <= 50) setLoanTenure(num);
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className="bg-transparent border-b border-white/10 hover:border-white/30 focus:border-white focus:outline-none w-16 text-right font-bold text-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-1"
                />
                <span className="text-white/60 ml-1">YEARS</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col justify-center gap-10 bg-white/5 p-10 border border-white/5">
          <div className="flex flex-col gap-2">
            <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Total Principal</span>
            <span className="text-white font-bold text-3xl font-heading tracking-wider">{formatCurrency(loanAmount).replace('.00', '')}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Total Interest Payable</span>
            <span className="text-white font-bold text-3xl font-heading tracking-wider">₹{totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex flex-col gap-2 pt-6 border-t border-white/10">
            <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Estimated Monthly EMI</span>
            <span className="text-5xl font-bold font-heading text-white tracking-tighter leading-none">₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
