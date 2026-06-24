import { useEffect, useRef } from 'react';

export function useAudioEngine() {
  const ctxRef = useRef(null);
  const masterVolumeRef = useRef(null);
  const engineOscRef = useRef(null);
  const engineFilterRef = useRef(null);

  const initAudio = () => {
    if (ctxRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const masterVolume = ctx.createGain();
      masterVolume.gain.setValueAtTime(0.15, ctx.currentTime);
      masterVolume.connect(ctx.destination);
      masterVolumeRef.current = masterVolume;

      // Setup Simulated Synth Vehicle Engine Motor
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, ctx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, ctx.currentTime);

      osc.connect(filter);
      filter.connect(masterVolume);
      osc.start();

      engineOscRef.current = osc;
      engineFilterRef.current = filter;
    } catch (e) {
      console.warn("Audio Context Failed Initialization Container Matrix", e);
    }
  };

  const playClick = () => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(masterVolumeRef.current);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  };

  const playCrash = () => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    
    // Low Frequency Boom Explode Synthesizer
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.8);
    
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(masterVolumeRef.current);
    osc.start();
    osc.stop(ctx.currentTime + 0.85);

    // Noise Node Generation Layer Buffer for Wreckage Crackle
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(400, ctx.currentTime);
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterVolumeRef.current);
    noise.start();
    noise.stop(ctx.currentTime + 0.6);
  };

  const updateEnginePitch = (speedNormalized) => {
    if (!engineOscRef.current || !engineFilterRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const baseFreq = 45 + (speedNormalized * 115);
    const baseCutoff = 250 + (speedNormalized * 950);
    
    engineOscRef.current.frequency.setTargetAtTime(baseFreq, ctx.currentTime, 0.05);
    engineFilterRef.current.frequency.setTargetAtTime(baseCutoff, ctx.currentTime, 0.05);
  };

  const silenceEngine = () => {
    if (!engineOscRef.current || !ctxRef.current) return;
    engineOscRef.current.frequency.setValueAtTime(0, ctxRef.current.currentTime);
  };

  return { initAudio, playClick, playCrash, updateEnginePitch, silenceEngine };
}