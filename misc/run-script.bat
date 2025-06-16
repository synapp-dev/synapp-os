@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0load-env.ps1" -Command "& '%~dp0%~1'" 