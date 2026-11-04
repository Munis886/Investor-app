# InvestSignal AI — Shamli Statistik Tahlil va Bashoratli Signallar Ilovasi (.APK)

Investitsiya va treyding uchun istalgan turdagi moliyaviy va statistik ma'lumotlarni sham (candlestick) ko'rinishida tahlil qiluvchi, sun'iy intellekt va texnik tahlil algoritmlari asosida taxminiy signallar (Buy / Sell / Hold) beruvchi to'laqonli mobil ilova.

---

## 📱 Android APK yig'ish

Windows'da loyiha papkasidan `build-apk.bat` ishga tushiriladi. Skript web qismini build qiladi, Capacitor orqali Android resurslarini yangilaydi, Gradle bilan debug APK yig'adi va yangisini `InvestSignal.apk` nomi bilan loyiha papkasiga ko'chiradi.

APK hajmi build turi, Android kutubxonalari va web resurslariga qarab o'zgaradi. README yoki ilova oynasidagi eski hajm raqamiga emas, build tugagandan keyingi faylga qarang. Joriy build natijasi `android/app/build/outputs/apk/debug/app-debug.apk` manzilida bo'ladi.

### Hajm kamayishi kod o'chirilganini anglatadimi?

- `build-apk.bat` faqat Gradle yaratgan `build` chiqish papkalarini tozalaydi; `src`, Android manba kodi yoki maxsus funksiyalarni o'chirmaydi.
- `npm run build` Vite orqali JavaScript/CSS ni bitta optimallashtirilgan web resursga yig'adi. Izohlar, ortiqcha bo'shliqlar va ishlatilmayotgan kod qismlari kichrayishi mumkin; kerakli ishlatiladigan funksiyalar bundle tarkibida qoladi.
- Android release sozlamasida `minifyEnabled false` va `shrinkResources false`, shuning uchun R8 kodni kichraytirish va resurslarni olib tashlash o'chirilgan. Joriy skript esa `assembleDebug` ishlatadi.
- `InvestSignal.apk` va `app-debug.apk` hajmi yoki sanasi farq qilsa, root papkadagi nusxa eskirgan bo'lishi mumkin. Skriptni qayta ishga tushirib, yangidan ko'chirilgan APK'dan foydalaning.

Ilovaning asosiy manba kodi `src/` papkasida. `dist/` va `android/app/src/main/assets/public/` avtomatik yaratiladigan build fayllari; ularni qo'lda tahrirlamang.

### Smartfonga o'rnatish:
1. `build-apk.bat` muvaffaqiyatli tugagach, `InvestSignal.apk` faylini smartfoningizga (Telegram, USB yoki Drive orqali) o'tkazing.
2. Faylni oching va "O'rnatish" (Install) tugmasini bosing.
3. Ilova to'liq mustaqil (oflayn) rejimda ishlaydi.

---

## 🚀 Asosiy Imkoniyatlar

1. **Interaktiv Shamli Grafik (Candlestick Chart):**
   - Yashil / Qizil shamlar (Open, High, Low, Close narxlari).
   - Savdo hajmi (Volume) gistogrammasi.
   - EMA 20 (Sariq) va EMA 50 (Moviy) trend chiziqlari.
   - Bollinger Bands (20, 2) diapazoni.
   - Zoom (+ / -) va Drag (surish) funksiyalari.
   - Kursor yoki sensor bilan sham ustiga bosganda batafsil OHLCV ma'lumotlari.

2. **AI & Texnik Tahlil Signallari (Predictive Signals):**
   - **Signal turlari:** `STRONG BUY` (Kuchli xarid), `BUY` (Xarid), `NEUTRAL` (Kutish), `SELL` (Sotish), `STRONG SELL` (Kuchli sotish).
   - **Ishonchlilik foizi (Confidence %):** 50% dan 95% gacha.
   - **Trade parametrlari:** 
     - Kirish narxi (Entry Price)
     - Stop Loss (SL) — ATR orqali xavfsiz hisoblangan
     - Take Profit (TP1, TP2, TP3)
     - Risk / Reward nisbati (1:2.5)
   - **O'zbek tilidagi batafsil izoh:** Har bir signal nima uchun berilganligi (RSI darajasi, MACD krossoveri, Bollinger holati, trend).

3. **Sham Naqshlarini Aniqlash (Candlestick Patterns):**
   - Bolg'a (Hammer)
   - Teskari Bolg'a (Inverted Hammer)
   - Otilgan Yulduz (Shooting Star)
   - Qamrab Oluvchi O'sish (Bullish Engulfing)
   - Qamrab Oluvchi Pasayish (Bearish Engulfing)
   - Tong Yulduzi (Morning Star)
   - Shom Yulduzi (Evening Star)
   - Doji (Ikkilanish shami)

4. **Istalgan Statistik Ma'lumotlarni Tahlil Qilish (CSV / Qo'lda kiritish):**
   - **CSV Yuklash:** O'zingizning xohlagan aksiyangiz, kripto yoki kompaniya statistik ma'lumotlaringizni CSV orqali yuklang.
   - **Qo'lda Sham Qo'shish (+ Sham):** Yangi narx kiritib, bashorat qanday o'zgarishini bir zumda ko'ring (What-If tahlil).
   - **Tayyor aktivlar:** Bitcoin (BTC/USDT), Ethereum (ETH/USDT), Oltin (XAU/USD), Apple Inc. (AAPL), Toshkent fond birjasi (O'zmetkombinat).

5. **Tarixiy Strategiya Sinovi (Backtest):**
   - Strategiyaning yutuq foizi (Win Rate %).
   - Jami daromadlik (Total Profit %).
   - Oxirgi bitimlar tarixi jadvali.

6. **Jonli Bozor Rejimi (Live Mode):**
   - Haqiqiy bozor harakatlarini real vaqtda simulyatsiya qilish.

---

## 💻 Kompyuterda Ishga Tushirish (Veb Rejim)

Loyiha papkasida buyruq satrida:

```bash
# Paketlar vaqtinchalik tekshiruvi:
npm run dev
```

Brauzerda `http://localhost:3000` manzilida ochiladi.

