"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmiCalculatorModal({ isOpen, onClose }: EmiCalculatorModalProps) {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTenure, setLoanTenure] = useState(10); // years

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-[#030303] border border-[#2a2a2a] rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col gap-12 z-10 font-sans"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col gap-10 md:gap-14 w-full mt-2">
              {/* Sliders Section */}
              <div className="flex flex-col gap-8">
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
                    max={10000000}
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

              {/* Outputs Section */}
              <div className="flex flex-col md:flex-row gap-12 justify-between items-start mt-2">
                {/* Calculations */}
                <div className="flex flex-col gap-8 w-full md:w-1/2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold uppercase tracking-widest text-xs md:text-sm">Principal Amount</span>
                    <span className="text-white font-bold text-lg md:text-xl">{formatCurrency(loanAmount).replace('.00', '')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold uppercase tracking-widest text-xs md:text-sm">Interest</span>
                    <span className="text-white font-bold text-lg md:text-xl">₹{totalInterest.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white font-semibold uppercase tracking-widest text-sm md:text-base">Emi Amount</span>
                    <span className="text-white font-bold text-xl md:text-2xl">₹{emi.toFixed(2)}</span>
                  </div>
                </div>

                {/* Documents Required */}
                <div className="flex flex-col gap-3 w-full md:w-1/2 md:text-right mt-4 md:mt-0">
                  <h3 className="text-white font-bold text-base md:text-lg mb-1">Documents Required:</h3>
                  <p className="text-white/70 font-light text-sm md:text-base">Identity Proof (PAN Card/Aadhar Card)</p>
                  <p className="text-white/70 font-light text-sm md:text-base">Income Proof (Last 6 months' salary slips)</p>
                  <p className="text-white/70 font-light text-sm md:text-base">Bank Statements (Last 6 months)</p>
                  <p className="text-white/70 font-light text-sm md:text-base">Professional Details</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
