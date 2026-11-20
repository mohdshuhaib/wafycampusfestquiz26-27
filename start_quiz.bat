@echo off
title Wafy Campus Fest Quiz 2026-27 Launcher
echo ========================================================
echo   WAFY CAMPUS FEST QUIZ 2026-27 - PRESENTATION LAUNCHER
echo ========================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting local high-performance media server...
    start "Quiz Server" /min node server.js
    timeout /t 1 >nul
    echo Opening Quiz Competition in your browser...
    start "" "http://localhost:3000"
) else (
    echo Opening directly via browser file mode...
    start "" "%~dp0index.html"
)

exit
