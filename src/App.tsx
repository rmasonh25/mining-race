import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Trophy, Play, RotateCcw, Info } from 'lucide-react';

interface MinerStats {
  label: string;
  th: number;
  winChance: number;
  description: string;
}

const minerStats: Record<string, MinerStats> = {
  s19: { 
    label: 'Antminer S19 Pro', 
    th: 110, 
    winChance: 0.015,
    description: 'Professional ASIC miner with 110 TH/s hashrate'
  },
  avalon6: { 
    label: 'AvalonMiner 6', 
    th: 6, 
    winChance: 0.001,
    description: 'Mid-range ASIC miner with 6 TH/s hashrate'
  },
  brains: { 
    label: 'Brains MM101', 
    th: 1, 
    winChance: 0.0001,
    description: 'Entry-level ASIC miner with 1 TH/s hashrate'
  },
  lucky: { 
    label: 'LuckyMiner 1 TH/s', 
    th: 1, 
    winChance: 0.0001,
    description: 'Virtual mining hardware with 1 TH/s'
  },
  pc: { 
    label: 'ASUS ROG Strix Gaming', 
    th: 1.5, 
    winChance: 0.0002,
    description: 'High-end gaming PC repurposed for mining'
  }
};

const PWC_WIN_CHANCE = 0.005;

function App() {
  const [selectedMiner, setSelectedMiner] = useState<string>('s19');
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<string>('');
  const [pwcProgress, setPwcProgress] = useState(0);
  const [traditionalProgress, setTraditionalProgress] = useState(0);
  const [raceComplete, setRaceComplete] = useState(false);

  const currentMiner = minerStats[selectedMiner];

  const getWinner = () => {
    const randPWC = Math.random();
    const randTraditional = Math.random();

    const pwcWins = randPWC < PWC_WIN_CHANCE;
    const traditionalWins = randTraditional < currentMiner.winChance;

    if (pwcWins && traditionalWins) {
      return Math.random() < 0.5 ? 'PWC Miner' : currentMiner.label;
    }
    if (pwcWins) return 'PWC Miner';
    if (traditionalWins) return currentMiner.label;
    return 'No winner this round';
  };

  const startRace = () => {
    if (isRacing) return;
    
    setIsRacing(true);
    setRaceComplete(false);
    setWinner('');
    setPwcProgress(0);
    setTraditionalProgress(0);

    // Simulate mining progress
    const raceInterval = setInterval(() => {
      setPwcProgress(prev => {
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
      
      setTraditionalProgress(prev => {
        const increment = Math.random() * 12 + 3;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    // Determine winner after race animation
    setTimeout(() => {
      clearInterval(raceInterval);
      const raceWinner = getWinner();
      setWinner(raceWinner);
      setIsRacing(false);
      setRaceComplete(true);
      setPwcProgress(100);
      setTraditionalProgress(100);
    }, 3000);
  };

  const resetRace = () => {
    setIsRacing(false);
    setRaceComplete(false);
    setWinner('');
    setPwcProgress(0);
    setTraditionalProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              PWC Miner vs Traditional Miners
            </h1>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Witness the future of Bitcoin mining! Our AI-powered PWC Miner uses quantum waveform collapse 
            technology to compete against traditional mining hardware in a simulated block race.
          </p>
        </div>

        {/* Miner Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-blue-400" />
              Select Your Traditional Miner
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <select
                  value={selectedMiner}
                  onChange={(e) => setSelectedMiner(e.target.value)}
                  className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isRacing}
                >
                  {Object.entries(minerStats).map(([key, miner]) => (
                    <option key={key} value={key}>{miner.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-400 mb-2">{currentMiner.label}</h3>
                <p className="text-gray-300 text-sm mb-2">{currentMiner.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Hashrate: {currentMiner.th} TH/s</span>
                  <span className="text-amber-400">Win Rate: {(currentMiner.winChance * 100).toFixed(3)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Race Arena */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Block Race Arena
              </h2>
              
              <div className="flex gap-3">
                <button
                  onClick={startRace}
                  disabled={isRacing}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  {isRacing ? 'Racing...' : 'Start Race'}
                </button>
                
                <button
                  onClick={resetRace}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-200"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>

            {/* PWC Miner */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">PWC Miner (AI Engine)</h3>
                    <p className="text-sm text-gray-400">Quantum waveform collapse technology</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-purple-400 font-semibold">Win Rate: {(PWC_WIN_CHANCE * 100).toFixed(1)}%</div>
                  <div className="text-gray-400 text-sm">AI-Enhanced</div>
                </div>
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${pwcProgress}%` }}
                >
                  {isRacing && (
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Traditional Miner */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentMiner.label}</h3>
                    <p className="text-sm text-gray-400">{currentMiner.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-semibold">Win Rate: {(currentMiner.winChance * 100).toFixed(3)}%</div>
                  <div className="text-gray-400 text-sm">{currentMiner.th} TH/s</div>
                </div>
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300 ease-out"
                  style={{ width: `${traditionalProgress}%` }}
                >
                  {isRacing && (
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Winner Display */}
            {raceComplete && (
              <div className="text-center p-6 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl border border-yellow-500/30">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-3xl font-bold text-white mb-2">🏁 Block Found!</h3>
                <p className="text-xl text-yellow-400 font-semibold">
                  Winner: {winner === 'PWC Miner' ? '🤖 PWC Miner' : 
                           winner === 'No winner this round' ? '⚡ No Winner This Round' : 
                           `⚙️ ${winner}`}
                </p>
                {winner !== 'No winner this round' && (
                  <p className="text-gray-300 mt-2">Block reward: 6.25 BTC + transaction fees</p>
                )}
              </div>
            )}

            {isRacing && (
              <div className="text-center p-4">
                <div className="inline-flex items-center gap-2 text-blue-400">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg font-semibold">Mining in progress...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              About This Simulation
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">PWC Miner Technology</h4>
                <p className="text-sm">
                  The PWC (Probabilistic Waveform Collapse) Miner represents next-generation mining technology, 
                  utilizing quantum computing principles and AI optimization to achieve superior efficiency 
                  in the Bitcoin mining process.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-400 mb-2">Traditional Mining Hardware</h4>
                <p className="text-sm">
                  These represent real-world Bitcoin mining hardware, from professional ASIC miners 
                  to repurposed gaming equipment. Each has different hashrates and corresponding 
                  probabilities of finding the next block.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;