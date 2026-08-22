import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  bg: '#061321',
  card: '#0C2033',
  card2: '#102A42',
  line: '#26445F',
  text: '#F3F7FB',
  muted: '#9CB3C7',
  cyan: '#72D8D0',
  blue: '#71A9FF',
  orange: '#E79B62',
  red: '#E77E78',
  green: '#75D6A1',
};

const SOS_TYPES = [
  'Envie de fumer',
  'Stress intense',
  'Colère / impulsion',
  'Angoisse / forte agitation',
  'Découragement',
  'Autre',
];

const SCRIPT = [
  'Rien à décider maintenant.',
  'Respire avec le mouvement.',
  'Une envie n’est pas une décision.',
  'Une pensée n’est pas un ordre.',
  'Laisse l’envie monter, changer, puis redescendre.',
  'Entre l’envie et l’action, il existe un espace.',
  'Respire. Observe. Attends. Choisis.',
  'Tu n’as pas besoin de décider pour toujours. Pas cette fois-ci.',
  'Expire lentement et pense : je laisse passer.',
  'Tu peux ressentir l’envie sans lui obéir.',
];

function App() {
  const [screen, setScreen] = useState('home');
  const [type, setType] = useState('Envie de fumer');
  const [before, setBefore] = useState(8);
  const [after, setAfter] = useState(3);
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('resonance_proofs').then(raw => {
      if (raw) setProofs(JSON.parse(raw));
    }).catch(() => {});
  }, []);

  const saveProof = async () => {
    const item = {
      id: Date.now(),
      type,
      before,
      after,
      text: `${type} : ${before}/10 → ${after}/10. J’ai traversé ce moment sans agir automatiquement.`,
      date: new Date().toLocaleDateString('fr-FR'),
    };
    const next = [item, ...proofs].slice(0, 50);
    setProofs(next);
    await AsyncStorage.setItem('resonance_proofs', JSON.stringify(next));
    setScreen('home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      {screen === 'home' && <Home proofs={proofs} onSOS={() => setScreen('type')} onProofs={() => setScreen('proofs')} />}
      {screen === 'type' && <TypeScreen value={type} onChange={setType} onNext={() => setScreen('before')} onBack={() => setScreen('home')} />}
      {screen === 'before' && <Rating title="Quelle est l’intensité maintenant ?" value={before} onChange={setBefore} action="M’aider maintenant" onNext={() => setScreen('session')} onBack={() => setScreen('type')} />}
      {screen === 'session' && <Session type={type} onDone={() => setScreen('after')} />}
      {screen === 'after' && <Rating title="Et maintenant ?" value={after} onChange={setAfter} action="Continuer" onNext={() => setScreen('proof')} onBack={() => setScreen('home')} />}
      {screen === 'proof' && <Proof before={before} after={after} type={type} onSave={saveProof} onSkip={() => setScreen('home')} />}
      {screen === 'proofs' && <ProofList proofs={proofs} onBack={() => setScreen('home')} />}
    </SafeAreaView>
  );
}

function Home({ onSOS, onProofs, proofs }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.brand}>RÉSONANCE</Text>
      <Text style={styles.h1}>Comment vas-tu maintenant ?</Text>
      <Text style={styles.sub}>Prends un instant pour écouter ton état.</Text>

      <View style={styles.stateCard}>
        <StateRow label="CORPS" left="Tendu" right="Apaisé" level={0.62} color={COLORS.cyan} />
        <StateRow label="MENTAL" left="Agité" right="Clair" level={0.43} color={COLORS.blue} />
        <StateRow label="ÉLAN" left="Épuisé" right="Disponible" level={0.58} color={COLORS.orange} />
      </View>

      <View style={styles.suggestion}>
        <Text style={styles.kicker}>SUGGESTION</Text>
        <Text style={styles.cardTitle}>Ton mental semble particulièrement sollicité.</Text>
        <Pressable style={styles.secondaryBtn}><Text style={styles.secondaryText}>Retrouver mon calme · 5 min</Text></Pressable>
      </View>

      <Pressable onPress={onSOS} style={styles.sosBtn}>
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosSub}>J’ai besoin d’aide maintenant</Text>
      </Pressable>

      <Pressable onPress={onProofs} style={styles.linkBtn}>
        <Text style={styles.link}>Mes preuves {proofs.length ? `· ${proofs.length}` : ''}</Text>
      </Pressable>
      <Text style={styles.footer}>Respirer · Observer · Attendre · Choisir</Text>
    </ScrollView>
  );
}

function StateRow({ label, left, right, level, color }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}><View style={[styles.fill, { width: `${level * 100}%`, backgroundColor: color }]} /></View>
      <View style={styles.rowBetween}><Text style={styles.tiny}>{left}</Text><Text style={styles.tiny}>{right}</Text></View>
    </View>
  );
}

function TypeScreen({ value, onChange, onNext, onBack }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Back onPress={onBack} />
      <Text style={styles.h1}>Qu’est-ce qui se passe ?</Text>
      <Text style={styles.sub}>Une réponse suffit.</Text>
      <View style={{ gap: 10, marginTop: 22 }}>
        {SOS_TYPES.map(x => (
          <Pressable key={x} onPress={() => onChange(x)} style={[styles.choice, value === x && styles.choiceActive]}>
            <Text style={styles.choiceText}>{x}</Text>
            <Text style={styles.check}>{value === x ? '●' : '○'}</Text>
          </Pressable>
        ))}
      </View>
      <Primary label="Continuer" onPress={onNext} />
    </ScrollView>
  );
}

function Rating({ title, value, onChange, action, onNext, onBack }) {
  return (
    <View style={styles.page}>
      <Back onPress={onBack} />
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.sub}>0 = faible · 10 = très intense</Text>
      <View style={styles.ratingCircle}><Text style={styles.ratingNum}>{value}</Text><Text style={styles.ratingTen}>/10</Text></View>
      <View style={styles.numberRow}>
        {Array.from({ length: 11 }).map((_, i) => (
          <Pressable key={i} onPress={() => onChange(i)} style={[styles.number, value === i && styles.numberActive]}>
            <Text style={[styles.numberText, value === i && { color: '#061321' }]}>{i}</Text>
          </Pressable>
        ))}
      </View>
      <Primary label={action} onPress={onNext} />
    </View>
  );
}

function Session({ type, onDone }) {
  const scale = useRef(new Animated.Value(0.72)).current;
  const [phase, setPhase] = useState('Inspire');
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [scriptIndex, setScriptIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        setPhase('Inspire');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        await new Promise(resolve => Animated.timing(scale, { toValue: 1.05, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }).start(resolve));
        setPhase('Expire');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        await new Promise(resolve => Animated.timing(scale, { toValue: 0.72, duration: 6000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }).start(resolve));
      }
    };
    loop();
    return () => { cancelled = true; scale.stopAnimation(); Speech.stop(); };
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (seconds === 3 || (seconds > 3 && seconds % 18 === 0)) {
      const text = SCRIPT[scriptIndex % SCRIPT.length];
      Speech.speak(text, { language: 'fr-FR', rate: 0.82, pitch: 0.95 });
      setScriptIndex(i => i + 1);
    }
    if (seconds >= 300) onDone();
  }, [seconds, running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <View style={[styles.page, { alignItems: 'center' }]}>
      <Text style={styles.kicker}>{type}</Text>
      <Text style={styles.h1}>Rien à décider maintenant.</Text>
      <Text style={styles.sub}>Suis simplement le mouvement.</Text>
      <Animated.View style={[styles.breathe, { transform: [{ scale }] }]}>
        <Text style={styles.breatheText}>{phase}</Text>
      </Animated.View>
      <Text style={styles.timer}>{mm}:{ss}</Text>
      <Text style={styles.sessionLine}>Respire. Observe. Attends. Choisis.</Text>
      <Pressable onPress={() => { setRunning(r => !r); running ? Speech.pause() : Speech.resume(); }} style={styles.pause}><Text style={styles.pauseText}>{running ? 'Pause' : 'Reprendre'}</Text></Pressable>
      <Pressable onPress={onDone} style={styles.linkBtn}><Text style={styles.link}>Terminer la séance</Text></Pressable>
    </View>
  );
}

function Proof({ before, after, type, onSave, onSkip }) {
  return (
    <View style={styles.page}>
      <Text style={styles.h1}>Veux-tu garder ce moment ?</Text>
      <Text style={styles.sub}>Une preuve est un fait sur lequel tu peux revenir.</Text>
      <View style={styles.proofCard}>
        <Text style={styles.quote}>« {type} : {before}/10 → {after}/10. Je viens de traverser ce moment sans agir automatiquement. »</Text>
      </View>
      <Primary label="Enregistrer comme preuve" onPress={onSave} />
      <Pressable onPress={onSkip} style={styles.linkBtn}><Text style={styles.link}>Pas maintenant</Text></Pressable>
    </View>
  );
}

function ProofList({ proofs, onBack }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Back onPress={onBack} />
      <Text style={styles.h1}>Mes preuves</Text>
      <Text style={styles.sub}>Tu l’as déjà fait. Plusieurs fois.</Text>
      {proofs.length === 0 ? <Text style={styles.empty}>Aucune preuve enregistrée pour le moment.</Text> : proofs.map(p => (
        <View key={p.id} style={styles.proofItem}>
          <Text style={styles.kicker}>{p.date}</Text>
          <Text style={styles.proofText}>{p.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function Primary({ label, onPress }) {
  return <Pressable onPress={onPress} style={styles.primary}><Text style={styles.primaryText}>{label}</Text></Pressable>;
}
function Back({ onPress }) {
  return <Pressable onPress={onPress} style={{ marginBottom: 18 }}><Text style={styles.link}>‹ Retour</Text></Pressable>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  page: { flexGrow: 1, padding: 22, backgroundColor: COLORS.bg },
  brand: { color: COLORS.cyan, letterSpacing: 5, fontSize: 13, fontWeight: '700', marginBottom: 28 },
  h1: { color: COLORS.text, fontSize: 29, lineHeight: 35, fontWeight: '650', marginBottom: 8 },
  sub: { color: COLORS.muted, fontSize: 15, lineHeight: 22 },
  stateCard: { marginTop: 26, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, borderRadius: 24, padding: 20 },
  label: { color: COLORS.text, fontWeight: '700', marginBottom: 9 },
  track: { height: 5, borderRadius: 99, backgroundColor: '#1D3950', overflow: 'hidden' },
  fill: { height: 5, borderRadius: 99 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  tiny: { color: COLORS.muted, fontSize: 12 },
  suggestion: { marginTop: 16, padding: 20, borderRadius: 22, backgroundColor: COLORS.card2 },
  kicker: { color: COLORS.cyan, fontSize: 12, letterSpacing: 1.2, marginBottom: 8 },
  cardTitle: { color: COLORS.text, fontSize: 18, lineHeight: 24 },
  secondaryBtn: { marginTop: 16, backgroundColor: '#9AC7F0', padding: 14, borderRadius: 16, alignItems: 'center' },
  secondaryText: { color: '#0B2032', fontWeight: '700' },
  sosBtn: { marginTop: 24, alignSelf: 'center', width: 205, height: 205, borderRadius: 103, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3C1E24', borderWidth: 3, borderColor: COLORS.red },
  sosText: { color: '#FFF', fontWeight: '800', fontSize: 48, letterSpacing: 2 },
  sosSub: { position: 'absolute', bottom: -40, color: COLORS.red, fontWeight: '600', width: 260, textAlign: 'center' },
  footer: { color: COLORS.muted, textAlign: 'center', marginTop: 40, fontSize: 12, letterSpacing: .5 },
  linkBtn: { padding: 18, alignItems: 'center', marginTop: 20 },
  link: { color: COLORS.blue, fontWeight: '650' },
  choice: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.card },
  choiceActive: { borderColor: COLORS.cyan, backgroundColor: '#10313E' },
  choiceText: { color: COLORS.text, fontSize: 16 },
  check: { color: COLORS.cyan, fontSize: 20 },
  primary: { backgroundColor: '#6D86D9', paddingVertical: 17, borderRadius: 18, alignItems: 'center', marginTop: 28 },
  primaryText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  ratingCircle: { width: 190, height: 190, borderRadius: 95, borderWidth: 10, borderColor: COLORS.red, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 45 },
  ratingNum: { color: COLORS.text, fontSize: 78, fontWeight: '300' },
  ratingTen: { color: COLORS.muted },
  numberRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  number: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.line },
  numberActive: { backgroundColor: COLORS.red, borderColor: COLORS.red },
  numberText: { color: COLORS.muted, fontWeight: '700' },
  breathe: { width: 220, height: 220, borderRadius: 110, borderWidth: 2, borderColor: COLORS.blue, alignItems: 'center', justifyContent: 'center', marginTop: 45, shadowColor: COLORS.blue, shadowOpacity: .7, shadowRadius: 30 },
  breatheText: { color: COLORS.text, fontSize: 26 },
  timer: { color: COLORS.text, fontSize: 28, marginTop: 36 },
  sessionLine: { color: COLORS.muted, marginTop: 20, fontSize: 16 },
  pause: { marginTop: 28, borderWidth: 1, borderColor: COLORS.line, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 99 },
  pauseText: { color: COLORS.text, fontWeight: '700' },
  proofCard: { marginTop: 34, backgroundColor: COLORS.card, borderRadius: 24, borderWidth: 1, borderColor: COLORS.line, padding: 24 },
  quote: { color: COLORS.text, fontSize: 20, lineHeight: 30 },
  empty: { color: COLORS.muted, marginTop: 40 },
  proofItem: { backgroundColor: COLORS.card, borderRadius: 18, padding: 18, marginTop: 12, borderWidth: 1, borderColor: COLORS.line },
  proofText: { color: COLORS.text, lineHeight: 22 },
});

export default App;
