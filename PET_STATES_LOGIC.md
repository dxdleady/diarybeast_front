# Pet Animation States - Detailed Logic

> **Приоритеты и правила для анимаций питомца**

---

## 🎯 Приоритет состояний (от высшего к низшему)

### **Priority 1: ⚡ Action States** (временные)
Эти состояния имеют наивысший приоритет и срабатывают при действиях пользователя

#### 🍖 **EATING** (1.5 секунды)
**Триггер:**
- Пользователь нажал кнопку "Feed"
- API вернул успех

**Анимация:**
```
Frame 1 (500ms): Питомец смотрит на еду
   /\_/\
  ( o.o )    🍖
   > ^ <

Frame 2 (500ms): Открывает рот
   /\_/\
  ( O.O )
   >_O_<

Frame 3 (500ms): Довольный
   /\_/\
  ( ^.^ )
   > w <
```

**После анимации:**
- Автоматически возвращается к idle/happy
- +1 life добавлена
- Cooldown 8 часов начался

---

#### 🎾 **PLAYING** (1.6 секунды, loop)
**Триггер:**
- Пользователь нажал кнопку "Play"
- **Музыка начала играть** ⭐

**Анимация:**
```
Frame 1 (400ms): Смотрит на мяч
   /\_/\
  ( >.< )    🎾
   > ^ <

Frame 2 (400ms): Мяч летит
   /\_/\   🎾
  ( ^.^ )
   > ^ <

Frame 3 (400ms): Ловит
🎾 /\_/\
  ( o.o )
   > ^ <

Frame 4 (400ms): Играет
   /\_/\
  ( ^ω^ )
   > ^ <   🎾
```

**Особенность:**
- Это **самая крутая анимация**!
- Когда музыка играет → питомец **танцует/играет** в такт
- Loop = true (повторяется пока музыка играет)
- Цвета: желтый + синий (энергичные)

**После:**
- Если музыка остановилась → переход к happy
- Если Play action → через 1.6s → happy
- +10 happiness добавлено

---

### **Priority 2: 💀 Critical State**

#### ⚠️ **CRITICAL** (1.6 секунды, loop)
**Триггер:**
- Lives = 0

**Анимация:**
```
Frame 1 (800ms): Лежит
   /\_/\
  ( x.x )
   > ~ <

Frame 2 (800ms): Пульсирует
   /\_/\
  ( X.X )
   > ~ <
```

**Цвета:**
- Красный + пульсирующий glow
- Темно-серые акценты

**Логика:**
- **Блокирует все другие состояния**
- Даже если музыка играет - показывается critical
- Единственный выход: написать запись или Feed

---

### **Priority 3: 🎵 Music State**

#### 🎶 **PLAYING (Music Mode)**
**Триггер:**
- `isMusicPlaying === true`
- Lives > 0 (не critical)
- Не активны eating/playing actions

**Поведение:**
- Использует ту же анимацию что и Play action
- Loop = true (танцует пока музыка играет)
- **Переопределяет mood states** (happy/sad/idle)

**Примеры:**
```
Если Lives = 2, Happiness = 20, но музыка играет:
→ PLAYING (танцует несмотря на грусть)

Если Lives = 7, Happiness = 100, музыка играет:
→ PLAYING (танцует от счастья)

Если Lives = 0, музыка играет:
→ CRITICAL (умирает, не танцует)
```

---

### **Priority 4: 😴 Sleep State**

#### 💤 **SLEEPING** (2.4 секунды, loop)
**Триггер:**
- Inactive >12 часов
- `petStore.state === 'sleeping'`

**Анимация:**
```
Frame 1 (1200ms):
   /\_/\
  ( -.- )
   > ^ <
    zzZ

Frame 2 (1200ms):
   /\_/\
  ( -.- )
   > ^ <
   zzZ
```

**Цвета:**
- Фиолетовый/синий (спокойные)
- Opacity 70%
- ZZZ анимируется (bounce)

**Пробуждение:**
- Пользователь написал запись → Wake up → happy
- Нажал Feed/Play → Wake up → action state
- Музыка началась → Wake up → playing

---

### **Priority 5: 😊 Mood States**

#### ✨ **HAPPY** (1.2 секунды, loop)
**Условия:**
- Happiness >= 70 **AND** Lives >= 5

**Анимация:**
```
Bouncing с сердечком:

Frame 1 (300ms):
   /\_/\
  ( ^.^ )
   > ♡ <

Frame 2 (300ms): ⬆️ прыжок

   /\_/\
  ( ^ω^ )
   > ♡ <

Frame 3 (300ms): ⬆️⬆️ выше

   /\_/\
  ( ^.^ )
   > ♡ <

Frame 4 (300ms): ⬇️ вниз
   /\_/\
  ( ^ω^ )
   > ♡ <
```

**Цвета:**
- Зеленый (яркий)
- Красное сердце (pulse)

**Когда показывается:**
- После успешной записи
- Питомец здоров и доволен
- Стабильное состояние

---

#### 😢 **SAD** (2 секунды, loop)
**Условия:**
- Happiness < 30 **OR** Lives <= 2

**Анимация:**
```
Frame 1 (1000ms):
   /\_/\
  ( T.T )
   > v <

Frame 2 (1000ms):
   /\_/\
  ( ;.; )
   > v <
```

**Цвета:**
- Серый (тусклый)
- Синие слезы

**Когда показывается:**
- Долго не играли с питомцем
- Мало жизней осталось
- Нужна забота

---

### **Priority 6: 🧘 Idle State**

#### 😐 **IDLE** (2 секунды, loop)
**Условия:**
- Все остальные случаи (default)

**Анимация:**
```
Frame 1 (800ms): Спокойствие
   /\_/\
  ( o.o )
   > ^ <

Frame 2 (400ms): Моргает
   /\_/\
  ( -.- )
   > ^ <

Frame 3 (800ms): Открывает глаза
   /\_/\
  ( o.o )
   > ^ <
```

**Цвета:**
- Оранжевый (cat) / Amber (dog)
- Нейтральные тона

**Когда показывается:**
- Нормальное состояние
- Happiness 30-70, Lives 3-4
- Не играет музыка
- Питомец просто сидит

---

## 🎯 Примеры реальных сценариев

### Сценарий 1: Обычный день
```
User opens app:
→ Lives: 6, Happiness: 85
→ STATE: happy (bouncing) ✨

User plays music:
→ Lives: 6, Happiness: 85, Music: ON
→ STATE: playing (dancing) 🎵

Music stops:
→ Lives: 6, Happiness: 85, Music: OFF
→ STATE: happy (back to bouncing) ✨
```

---

### Сценарий 2: Кормление
```
Lives: 4, Happiness: 50, State: idle

User clicks Feed:
→ STATE: eating (1.5s animation) 🍖
→ Lives: 5, Happiness: 50

After animation:
→ STATE: happy (Lives >= 5) ✨
```

---

### Сценарий 3: Критическое состояние
```
Lives: 0, Happiness: 10

Any action:
→ STATE: critical (red pulse) ⚠️
→ Все заблокировано кроме Feed/Write

User writes entry:
→ Lives: 2, Happiness: 30
→ STATE: sad (still low) 😢

User plays music:
→ Lives: 2, Happiness: 30, Music: ON
→ STATE: playing (cheers up!) 🎵
```

---

### Сценарий 4: Засыпание
```
Last active: 15 hours ago
→ STATE: sleeping 😴

User writes entry:
→ Lives: 5 → 7, Happiness: 60 → 80
→ STATE: happy (woke up!) ✨

Music starts:
→ STATE: playing (fully awake!) 🎵
```

---

### Сценарий 5: Музыка спасает настроение
```
Lives: 2, Happiness: 15
→ STATE: sad 😢

Music ON:
→ STATE: playing (dances anyway!) 🎵
→ Визуально поднимает настроение
→ Пользователь видит реакцию

Music OFF + User plays with pet:
→ Happiness: 25 (still low)
→ STATE: sad 😢

Music ON again:
→ STATE: playing 🎵 (repeat)
```

---

## 🔄 Логика переходов

```typescript
function getAnimationState(): AnimationState {
  // 1️⃣ Действия (highest)
  if (eating || playing_action) return action_state;

  // 2️⃣ Критическое
  if (lives === 0) return 'critical';

  // 3️⃣ Музыка 🎵 (самое крутое!)
  if (isMusicPlaying && lives > 0) return 'playing';

  // 4️⃣ Сон
  if (inactive > 12h) return 'sleeping';

  // 5️⃣ Настроение
  if (happiness >= 70 && lives >= 5) return 'happy';
  if (happiness < 30 || lives <= 2) return 'sad';

  // 6️⃣ По умолчанию
  return 'idle';
}
```

---

## 🎨 Дополнительные фишки

### Контекстные реакции

**Время суток (future):**
```typescript
if (hour >= 22 || hour <= 6) {
  // Ночь
  if (state === 'idle') return 'sleeping';
}
```

**Погода (future):**
```typescript
if (weather === 'rainy') {
  // Грустная анимация
  sadColors.push('darker-blue');
}
```

**События (future):**
```typescript
if (userBirthday) {
  return 'party'; // Новая анимация с шляпой
}
```

---

## 🎵 Интеграция с музыкой (детально)

### MusicProvider Setup

**1. Обернуть app в Provider:**
```tsx
// app/layout.tsx or providers.tsx
<MusicProvider>
  <YourApp />
</MusicProvider>
```

**2. Music Player использует:**
```tsx
const { play, pause, toggle, isPlaying } = useMusic();

<button onClick={toggle}>
  {isPlaying ? '⏸ Pause' : '▶️ Play'}
</button>
```

**3. Pet автоматически реагирует:**
```tsx
// Pet.tsx уже подключен к useMusic()
// Когда isPlaying = true → playing animation
```

---

## 📊 Матрица приоритетов

| Условие | Lives | Happiness | Music | Action | Result |
|---------|-------|-----------|-------|--------|--------|
| 1 | Any | Any | Any | **eating** | **eating** |
| 2 | Any | Any | Any | **playing** | **playing** |
| 3 | **0** | Any | Any | - | **critical** |
| 4 | >0 | Any | **ON** | - | **playing** 🎵 |
| 5 | >0 | Any | OFF | - | sleeping (if 12h) |
| 6 | ≥5 | ≥70 | OFF | - | **happy** |
| 7 | ≤2 | Any | OFF | - | **sad** |
| 8 | Any | <30 | OFF | - | **sad** |
| 9 | 3-4 | 30-70 | OFF | - | **idle** |

---

## ✅ Checklist для тестирования

**Музыка (главная фича!):**
- [ ] Музыка вкл → питомец танцует (playing)
- [ ] Музыка выкл → возврат к mood state
- [ ] Музыка + Lives=0 → critical (не танцует)
- [ ] Музыка + sleeping → просыпается и танцует

**Actions:**
- [ ] Feed → eating 1.5s → happy/idle
- [ ] Play → playing 1.6s → happy
- [ ] Cooldowns работают

**Critical:**
- [ ] Lives=0 → critical всегда
- [ ] Блокирует музыку и mood

**Sleep:**
- [ ] 12h inactive → sleeping
- [ ] Запись → wake up

**Moods:**
- [ ] High happiness + health → happy
- [ ] Low happiness OR health → sad
- [ ] Mid range → idle

---

**Версия:** 1.0
**Дата:** 12 октября 2025
**Статус:** Готово к имплементации
