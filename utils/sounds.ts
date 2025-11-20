
let audioCtx: AudioContext;

const getAudioContext = (): AudioContext => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
};

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
        console.error("Could not play sound:", error);
    }
};

export const playSound = (sound: 'place' | 'win' | 'lose' | 'click' | 'skill') => {
  switch (sound) {
    case 'place':
      playTone(350, 80, 'sine', 0.08);
      playTone(440, 80, 'triangle', 0.05);
      break;
    case 'click':
      playTone(880, 50, 'triangle', 0.07);
      break;
    case 'skill':
       playTone(659.25, 120, 'sawtooth', 0.08);
       setTimeout(() => playTone(783.99, 150, 'sawtooth', 0.08), 130);
       break;
    case 'win':
      playTone(523.25, 100, 'sine', 0.1); // C5
      setTimeout(() => playTone(659.25, 100, 'sine', 0.1), 120); // E5
      setTimeout(() => playTone(783.99, 100, 'sine', 0.1), 240); // G5
      setTimeout(() => playTone(1046.50, 200, 'sine', 0.12), 360); // C6
      break;
    case 'lose':
       playTone(440, 200, 'sawtooth', 0.08);
       setTimeout(() => playTone(349.23, 300, 'sawtooth', 0.08), 210); // F4
       break;
  }
};
