
// Audio context and analyzer setup for pitch detection
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let mediaStream: MediaStream | null = null;
let animationFrameId: number | null = null;

// Setup for audio context and analyzer
export const setupAudioContext = async (): Promise<boolean> => {
  try {
    // Request microphone access
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
      },
    });

    // Create audio context
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(mediaStream);
    
    // Create analyzer for frequency analysis
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    
    return true;
  } catch (error) {
    console.error("Error accessing microphone:", error);
    return false;
  }
};

// Tear down audio context and related resources
export const teardownAudioContext = (): void => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  analyser = null;
};

// Autocorrelation pitch detection algorithm
const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
  // Find the root mean square of the signal
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sum / buffer.length);
  
  // Return if the signal is too quiet
  if (rms < 0.01) return -1;

  // Perform autocorrelation
  const correlations = new Array(buffer.length).fill(0);
  for (let lag = 0; lag < buffer.length; lag++) {
    let sum = 0;
    for (let i = 0; i < buffer.length - lag; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    correlations[lag] = sum;
  }

  // Find the peak of the correlations
  let foundPeak = false;
  let peakIndex = -1;
  
  for (let i = 1; i < correlations.length; i++) {
    if (correlations[i] > correlations[i-1] && correlations[i] > correlations[i+1]) {
      foundPeak = true;
      peakIndex = i;
      break;
    }
  }
  
  if (foundPeak) {
    // Refine the peak by interpolation
    const y1 = correlations[peakIndex - 1];
    const y2 = correlations[peakIndex];
    const y3 = correlations[peakIndex + 1];
    
    const refinedPeak = peakIndex + (y3 - y1) / (2 * (2 * y2 - y1 - y3));
    const frequency = sampleRate / refinedPeak;
    
    return frequency;
  }
  
  return -1;
};

// Get current frequency from the microphone
export const detectPitch = (): Promise<number> => {
  return new Promise((resolve) => {
    if (!audioContext || !analyser) {
      resolve(-1);
      return;
    }
    
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer);
    
    const frequency = autoCorrelate(buffer, audioContext.sampleRate);
    resolve(frequency);
  });
};

// Start continuous pitch detection
export const startContinuousPitchDetection = (
  callback: (frequency: number) => void
): void => {
  if (!audioContext || !analyser) return;
  
  const detectPitchAndScheduleNext = async () => {
    const frequency = await detectPitch();
    callback(frequency);
    animationFrameId = requestAnimationFrame(detectPitchAndScheduleNext);
  };
  
  detectPitchAndScheduleNext();
};

// Stop continuous pitch detection
export const stopContinuousPitchDetection = (): void => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};
