import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type HeartRatePoint = { t: number; bpm: number };

// Re-usable chart component that accepts heart rate data points
function HeartRateChart({ data }: { data: HeartRatePoint[] }) {
  const width = Dimensions.get('window').width - 32; // padding
  const height = 260;
  const MAX_POINTS = 7; // show at most 7 points on the x-axis

  const chartData = useMemo(() => {
    // Only plot the most recent MAX_POINTS to keep x-axis clean
    const visible = data.slice(-MAX_POINTS);
    // Short labels to avoid crowding (mm:ss)
    const fullLabels = visible.map(p => new Date(p.t).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }));
    const labels = fullLabels; // with <= 7 points we can show all
    const values = visible.map(p => p.bpm);
    return {
      labels,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => `rgba(36, 107, 253, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Heart Rate (bpm)'],
    };
  }, [data]);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    propsForDots: { r: '3', strokeWidth: '2', stroke: '#246BFD' },
    propsForBackgroundLines: { strokeDasharray: '4 8', stroke: '#e6e8eb' },
    decimalPlaces: 0,
  } as const;

  return (
    <View>
      {Platform.OS === 'web' ? (
        <Text style={{ color: '#666' }}>Chart preview is disabled on Web.</Text>
      ) : (
        <LineChart
          key={(data[data.length - 1]?.t ?? Date.now()).toString()}
          data={chartData}
          width={width}
          height={height}
          chartConfig={chartConfig}
          bezier
          withInnerLines
          withOuterLines={false}
          style={styles.chart}
          // fromZero disabled to auto-scale Y to visible values for stronger visual effect
          fromZero={false}
          yAxisSuffix=" bpm"
          verticalLabelRotation={45}
          xLabelsOffset={-6}
        />
      )}
    </View>
  );
}

export default function ReportsScreen() {
  // Live-simulated data window: ~60 seconds, updating every 2s (30 points)
  const WINDOW_SIZE = 30;
  const TICK_MS = 2000;
  const base = 78; // base bpm (slightly higher to allow bigger swings below/above)

  // Initialize with past points spaced by TICK_MS
  const [series, setSeries] = useState<HeartRatePoint[]>(() => {
    const now = Date.now();
    return new Array(WINDOW_SIZE).fill(0).map((_, idxFromEnd) => {
      const i = WINDOW_SIZE - 1 - idxFromEnd; // oldest to newest
      const t = now - (WINDOW_SIZE - 1 - i) * TICK_MS;
      const phase = i / 1.6;
      // Exaggerated waveform: sharper peaks with pulse^2.2 plus a slow secondary wave and noise
      const pulse = Math.pow(Math.abs(Math.sin(phase)), 2.2);
      const bpm = base + Math.round(18 * pulse + 6 * Math.sin(phase * 0.5) + (Math.random() * 8 - 4));
      return { t, bpm };
    });
  });

  // Keep a phase accumulator for smooth pulses
  const phaseRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      phaseRef.current += 1.0; // pulse speed
      const now = Date.now();

      // Exaggerated pulse with sharper peaks and secondary oscillation
      const pulse = Math.pow(Math.abs(Math.sin(phaseRef.current)), 2.2);
      const bpm = base + Math.round(20 * pulse + 6 * Math.sin(phaseRef.current * 0.5) + (Math.random() * 8 - 4));

      setSeries(prev => {
        const next = prev.slice(1);
        next.push({ t: now, bpm });
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Heart Rate Report</Text>
      <Text style={styles.subheader}>Last ~60 seconds</Text>
      <HeartRateChart data={series} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 20,
    color: '#246BFD',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
});
