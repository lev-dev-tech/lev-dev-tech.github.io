import os
import sys
import wave
import numpy as np

SR = 44100
OUT = sys.argv[1] if len(sys.argv) > 1 else "audio/sfx"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def noise(d):
    return rng.uniform(-1, 1, int(SR * d))


def env(n, a, r, curve=2.0):
    x = np.ones(n)
    na = max(1, int(a * SR))
    nr = max(1, int(r * SR))
    x[:na] = np.linspace(0, 1, na)
    x[-nr:] *= np.linspace(1, 0, nr) ** curve
    return x


def onepole_lp(x, fc):
    fc = np.broadcast_to(np.asarray(fc, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s
        y[i] = s
    return y


def biquad_bp(x, fc, q):
    fc = np.broadcast_to(np.asarray(fc, dtype=float), x.shape)
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for i in range(len(x)):
        w = 2 * np.pi * fc[i] / SR
        al = np.sin(w) / (2 * q)
        b0, b2 = al, -al
        a0, a1, a2 = 1 + al, -2 * np.cos(w), 1 - al
        yi = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1 = x1, x[i]
        y2, y1 = y1, yi
        y[i] = yi
    return y


def reverb(x, mix=0.3, length=1.2):
    out = np.concatenate([x, np.zeros(int(SR * length))])
    wet = np.zeros_like(out)
    for dly, g in [(0.0297, 0.77), (0.0371, 0.74), (0.0411, 0.72), (0.0437, 0.7)]:
        d = int(dly * SR)
        buf = out.copy()
        for k in range(1, 30):
            off = d * k
            if off >= len(out):
                break
            wet[off:] += buf[: len(out) - off] * (g ** k) * 0.25
    return out * (1 - mix) + wet * mix


def formant_voice(f0, dur, formants, vib=5.0, vibd=0.02):
    tt = t(dur)
    f = f0 * (1 + vibd * np.sin(2 * np.pi * vib * tt))
    ph = np.cumsum(2 * np.pi * f / SR)
    src = sum(np.sin(k * ph) / k for k in range(1, 25))
    return sum(biquad_bp(src, fc, 6) * g for fc, g in formants)


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def save(name, x, peak=0.9):
    x = norm(x, peak)
    data = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def howl():
    d = 3.2
    tt = t(d)
    glide = np.interp(tt, [0, 0.5, 1.6, 2.6, 3.2], [330, 560, 610, 470, 380])
    f = glide * (1 + 0.012 * np.sin(2 * np.pi * 5.5 * tt))
    ph = np.cumsum(2 * np.pi * f / SR)
    x = np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    x += 0.04 * onepole_lp(noise(d), 2000)
    x *= env(len(x), 0.45, 1.2, 1.5)
    return reverb(x, 0.45, 1.8)


def hit():
    d = 1.4
    tt = t(d)
    f = 120 * np.exp(-tt * 6) + 38
    ph = np.cumsum(2 * np.pi * f / SR)
    x = np.sin(ph) * np.exp(-tt * 3.2) * 1.2
    x += onepole_lp(noise(d), 3500) * np.exp(-tt * 28) * 0.9
    return np.tanh(x * 2)


def creak():
    d = 2.2
    tt = t(d)
    rate = np.interp(tt, [0, 0.8, 1.6, 2.2], [18, 42, 25, 60])
    ph = np.cumsum(2 * np.pi * rate / SR)
    pulses = (np.sin(ph) > 0.97).astype(float)
    x = biquad_bp(pulses + 0.02 * noise(d), 650 + 250 * np.sin(2 * np.pi * 0.5 * tt), 9)
    x += 0.5 * biquad_bp(pulses, 1450, 12)
    x *= env(len(x), 0.2, 0.5)
    return reverb(x, 0.35)


def whoosh():
    d = 0.6
    tt = t(d)
    fc = np.interp(tt, [0, 0.3, 0.6], [300, 2600, 500])
    x = biquad_bp(noise(d), fc, 1.2) * np.sin(np.pi * tt / d) ** 2
    return x


def pop():
    d = 0.18
    tt = t(d)
    f = 900 * np.exp(-tt * 25) + 300
    ph = np.cumsum(2 * np.pi * f / SR)
    return np.sin(ph) * np.exp(-tt * 30)


def rustle():
    d = 1.4
    tt = t(d)
    am = np.clip(onepole_lp(rng.uniform(0, 1, len(tt)) ** 6, 30) * 40, 0, 1)
    x = biquad_bp(noise(d), 3200, 0.8) * am
    x += 0.4 * biquad_bp(noise(d), 900, 1.0) * am
    return x * env(len(x), 0.05, 0.3)


def whisper():
    parts = []
    syl = [0.13, 0.13, 0.13, 0.3, 0.12, 0.13, 0.12, 0.13, 0.45]
    for i, s in enumerate(syl):
        n = noise(s)
        fc = 1100 + 900 * (i % 2)
        v = biquad_bp(n, fc, 3) + 0.6 * biquad_bp(n, fc * 2.3, 4)
        v += 0.5 * formant_voice(70 + 6 * (i % 3), s, [(500, 1), (1100, 0.6)], 6, 0.05)
        v *= np.sin(np.pi * np.arange(len(v)) / len(v)) ** 0.7
        parts.append(v)
        parts.append(np.zeros(int(SR * (0.03 if s < 0.2 else 0.12))))
    x = np.concatenate(parts)
    x = x * (1 + 0.6 * np.sin(2 * np.pi * 11 * t(len(x) / SR)))
    return reverb(x, 0.5, 1.6)


def thud():
    d = 0.8
    tt = t(d)
    f = 90 * np.exp(-tt * 9) + 45
    ph = np.cumsum(2 * np.pi * f / SR)
    return np.tanh((np.sin(ph) * np.exp(-tt * 7) + onepole_lp(noise(d), 900) * np.exp(-tt * 18)) * 2.5)


def screech():
    d = 0.9
    tt = t(d)
    f = 2400 + 1400 * np.sin(2 * np.pi * 17 * tt) + 900 * np.sin(2 * np.pi * 3 * tt)
    ph = np.cumsum(2 * np.pi * f / SR)
    x = np.sign(np.sin(ph)) * 0.4 + np.sin(ph)
    x *= (np.sin(2 * np.pi * 14 * tt) > -0.3).astype(float)
    x *= env(len(x), 0.01, 0.3)
    return reverb(onepole_lp(x, 7000), 0.25)


def power_off():
    d = 0.9
    tt = t(d)
    f = np.interp(tt, [0, d], [1400, 90])
    ph = np.cumsum(2 * np.pi * f / SR)
    return (np.sin(ph) * 0.7 + 0.3 * np.sign(np.sin(ph))) * env(len(tt), 0.01, 0.6)


def laugh():
    parts = []
    for i in range(6):
        s = 0.12
        v = formant_voice(260 - i * 8, s, [(800, 1), (1250, 0.7), (2600, 0.3)], 8, 0.03)
        v += 0.3 * biquad_bp(noise(s), 1800, 2)
        v *= np.sin(np.pi * np.arange(len(v)) / len(v))
        parts += [v, np.zeros(int(SR * 0.06))]
    return reverb(np.concatenate(parts), 0.2)


def ding():
    d = 1.2
    tt = t(d)
    x = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) * g for f, k, g in [(1318, 4, 1), (1976, 5, 0.6), (2637, 7, 0.3)])
    x[: int(0.12 * SR)] += 0.6 * np.sin(2 * np.pi * 988 * tt[: int(0.12 * SR)]) * np.exp(-tt[: int(0.12 * SR)] * 20)
    return x


def growl():
    d = 2.2
    tt = t(d)
    f = 72 + 10 * np.sin(2 * np.pi * 1.3 * tt) + 6 * rng.standard_normal(len(tt)).cumsum() / 400
    ph = np.cumsum(2 * np.pi * f / SR)
    src = sum(np.sin(k * ph) / k for k in range(1, 30))
    am = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 19 * tt))
    x = biquad_bp(src * am, 420, 1.5) + 0.5 * biquad_bp(noise(d) * am, 700, 2)
    x = np.tanh(x * 3)
    return reverb(x * env(len(x), 0.25, 0.6), 0.25)


def poof():
    d = 1.6
    tt = t(d)
    fc = np.interp(tt, [0, 0.15, 1.6], [6000, 1500, 200])
    x = onepole_lp(noise(d), fc) * np.exp(-tt * 3) * env(len(tt), 0.01, 0.6)
    x += 0.8 * np.sin(np.cumsum(2 * np.pi * (60 + 80 * np.exp(-tt * 10)) / SR)) * np.exp(-tt * 5)
    return reverb(x, 0.3)


def rumble():
    d = 3.0
    tt = t(d)
    x = onepole_lp(onepole_lp(noise(d), 120), 90) * 8
    x *= 0.6 + 0.4 * np.sin(2 * np.pi * 7 * tt + 3 * np.sin(2 * np.pi * 0.7 * tt))
    x += 0.3 * np.sin(2 * np.pi * 36 * tt)
    return np.tanh(x * env(len(tt), 0.3, 1.0) * 2)


def demon():
    d = 3.0
    tt = t(d)
    f0 = 55 + 8 * np.sin(2 * np.pi * 0.6 * tt)
    vowels = np.interp(tt, [0, 0.7, 1.4, 2.1, 3.0], [500, 800, 350, 700, 450])
    ph = np.cumsum(2 * np.pi * f0 / SR)
    src = sum(np.sin(k * ph) / k for k in range(1, 40))
    x = biquad_bp(src, vowels, 5) + 0.6 * biquad_bp(src, vowels * 2.2, 6)
    x = np.round(np.tanh(x * 4) * 10) / 10
    x += 0.2 * onepole_lp(noise(d), 400)
    x = x * env(len(tt), 0.2, 0.8)
    return reverb(x, 0.5, 2.0)


def check():
    d = 0.4
    tt = t(d)
    x = np.sin(2 * np.pi * 880 * tt) * np.exp(-tt * 14)
    k = int(0.08 * SR)
    x[k:] += np.sin(2 * np.pi * 1320 * tt[: len(tt) - k]) * np.exp(-tt[: len(tt) - k] * 10)
    return x


def chime():
    d = 2.4
    tt = t(d)
    x = np.zeros_like(tt)
    for i, f in enumerate([1046, 1318, 1568, 2093, 2637]):
        s = int(i * 0.06 * SR)
        x[s:] += np.sin(2 * np.pi * f * tt[: len(tt) - s]) * np.exp(-tt[: len(tt) - s] * 2.5) / (1 + i * 0.3)
    return reverb(x, 0.4)


def riser():
    d = 2.2
    tt = t(d)
    f = np.interp(tt, [0, d], [200, 1400])
    ph = np.cumsum(2 * np.pi * f / SR)
    x = np.sin(ph) * 0.4 + biquad_bp(noise(d), f * 2, 2)
    return x * (tt / d) ** 2


def shatter():
    d = 1.8
    tt = t(d)
    x = onepole_lp(noise(d), 9000) * np.exp(-tt * 18) * 1.5
    for _ in range(40):
        f = rng.uniform(2500, 9000)
        s = int(rng.uniform(0, 0.25) * SR)
        x[s:] += np.sin(2 * np.pi * f * tt[: len(tt) - s]) * np.exp(-tt[: len(tt) - s] * rng.uniform(5, 14)) * 0.15
    x += 0.8 * np.sin(np.cumsum(2 * np.pi * (80 + 120 * np.exp(-tt * 15)) / SR)) * np.exp(-tt * 8)
    return reverb(x, 0.3)


def victory():
    notes = [523, 659, 784, 1046]
    out = np.zeros(int(SR * 2.4))
    for i, f in enumerate(notes):
        s = int(i * 0.13 * SR)
        tt = t(2.4 - i * 0.13)
        v = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * (2 if i == 3 else 6))
        out[s : s + len(v)] += v
    return reverb(out, 0.3)


def scream():
    d = 2.4
    tt = t(d)
    f0 = np.interp(tt, [0, 0.3, 2.4], [280, 420, 460])
    ph = np.cumsum(2 * np.pi * f0 * (1 + 0.03 * np.sin(2 * np.pi * 7 * tt)) / SR)
    src = sum(np.sin(k * ph) / k for k in range(1, 20))
    x = biquad_bp(src, 900, 5) + 0.8 * biquad_bp(src, 1400, 6) + 0.3 * biquad_bp(src, 2800, 6)
    x += 0.15 * biquad_bp(noise(d), 2500, 1)
    return reverb(np.tanh(x * 3) * env(len(tt), 0.05, 0.5), 0.3)


def rec():
    d = 0.5
    tt = t(d)
    x = np.sin(2 * np.pi * 1000 * tt) * (tt < 0.12)
    x += np.sin(2 * np.pi * 1000 * tt) * ((tt > 0.2) & (tt < 0.32))
    return x * 0.6


def ambient_night():
    d = 24.0
    tt = t(d)
    drone = np.sin(2 * np.pi * 55 * tt) + np.sin(2 * np.pi * 55.4 * tt) + 0.5 * np.sin(2 * np.pi * 82.5 * tt + np.sin(2 * np.pi * 0.1 * tt))
    wind = biquad_bp(noise(d), 500 + 300 * np.sin(2 * np.pi * tt / 8), 0.7) * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 6) ** 2)
    x = 0.25 * drone + 0.8 * wind
    for _ in range(6):
        s = rng.uniform(1, d - 2)
        k = int(s * SR)
        c = 0.3 * creak()
        x[k : k + len(c)] += c[: len(x) - k]
    fade = int(SR * 1.5)
    x[:fade] = x[:fade] * np.linspace(0, 1, fade) + x[-fade:] * np.linspace(1, 0, fade)
    return x[:-fade]


def ambient_tension():
    d = 20.0
    tt = t(d)
    x = 0.4 * (np.sin(2 * np.pi * 41 * tt) + np.sin(2 * np.pi * 41.7 * tt))
    x += 0.25 * np.sin(2 * np.pi * 61.7 * tt) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.25 * tt))
    pulse = np.exp(-((tt % 0.85) * 9)) * np.sin(2 * np.pi * 50 * tt)
    x += 0.6 * pulse
    x += 0.4 * biquad_bp(noise(d), 300, 0.6)
    fade = int(SR * 1.5)
    x[:fade] = x[:fade] * np.linspace(0, 1, fade) + x[-fade:] * np.linspace(1, 0, fade)
    return x[:-fade]


def ambient_morning():
    d = 20.0
    tt = t(d)
    x = 0.15 * (np.sin(2 * np.pi * 220 * tt) + np.sin(2 * np.pi * 277 * tt) + np.sin(2 * np.pi * 330 * tt)) * (0.6 + 0.4 * np.sin(2 * np.pi * tt / 7))
    x += 0.25 * biquad_bp(noise(d), 1200, 0.5)
    for _ in range(18):
        s = rng.uniform(0.5, d - 1)
        k = int(s * SR)
        bt = t(0.25)
        f = rng.uniform(2800, 4200) + 800 * np.sin(2 * np.pi * rng.uniform(15, 30) * bt)
        b = np.sin(np.cumsum(2 * np.pi * f / SR)) * np.sin(np.pi * bt / 0.25) * 0.35
        x[k : k + len(b)] += b[: len(x) - k]
    fade = int(SR * 1.5)
    x[:fade] = x[:fade] * np.linspace(0, 1, fade) + x[-fade:] * np.linspace(1, 0, fade)
    return x[:-fade]


def ambient_room():
    d = 16.0
    tt = t(d)
    x = 0.3 * onepole_lp(noise(d), 300) * 4 + 0.15 * np.sin(2 * np.pi * 50 * tt) + 0.1 * np.sin(2 * np.pi * 60.5 * tt)
    fade = int(SR * 1.5)
    x[:fade] = x[:fade] * np.linspace(0, 1, fade) + x[-fade:] * np.linspace(1, 0, fade)
    return x[:-fade]


SFX = {
    "howl": howl, "hit": hit, "creak": creak, "whoosh": whoosh, "pop": pop, "rustle": rustle, "whisper": whisper,
    "thud": thud, "screech": screech, "powerOff": power_off, "laugh": laugh, "ding": ding, "growl": growl, "poof": poof,
    "rumble": rumble, "demon": demon, "check": check, "chime": chime, "riser": riser, "shatter": shatter,
    "victory": victory, "scream": scream, "rec": rec,
}
AMB = {"night": ambient_night, "tension": ambient_tension, "morning": ambient_morning, "room": ambient_room}

for k, fn in SFX.items():
    save(k, fn())
    print("sfx", k)
for k, fn in AMB.items():
    save("ambient_" + k, fn(), 0.7)
    print("amb", k)
