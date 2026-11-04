@echo off
title InvestSignal APK Builder

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1/4] Web resurslar yigilmoqda...
call npm.cmd run build
if %errorlevel% neq 0 (
    echo Web buildda xatolik yuz berdi!
    pause
    exit /b %errorlevel%
)

echo [2/4] Android loyihasiga nusxalanmoqda...
call npx.cmd cap copy
if %errorlevel% neq 0 (
    echo Capacitor copydaxatolik!
    pause
    exit /b %errorlevel%
)

echo [3/4] Eski jarayonlar tozalanmoqda va Gradle to'xtatilmoqda...
cd android
call gradlew.bat --stop
rd /s /q app\build 2>nul
rd /s /q capacitor-cordova-android-plugins\build 2>nul
rd /s /q build 2>nul

echo [4/4] Android APK kompilatsiya qilinmoqda (JDK 17)...
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo Gradle buildda xatolik!
    cd ..
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo APK muvaffaqiyatli yaratildi!
copy /Y app\build\outputs\apk\debug\app-debug.apk ..\InvestSignal.apk
cd ..
echo Tayyor fayl: InvestSignal.apk
for %%I in (InvestSignal.apk) do echo APK hajmi: %%~zI bayt
echo ========================================================
pause

