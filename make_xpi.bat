@echo off

for %%I in ("%~dp0.") do set "FOLDER_NAME=%%~nxI"
set "OUT_DIR=%~dp0"
set "ZIP_FILE=%OUT_DIR%\%FOLDER_NAME%.zip"
set "XPI_FILE=%OUT_DIR%\%FOLDER_NAME%.xpi"

if not exist "%OUT_DIR%" mkdir "%OUT_DIR%"

if exist "%ZIP_FILE%" del "%ZIP_FILE%"
if exist "%XPI_FILE%" del "%XPI_FILE%"

powershell -NoLogo -NoProfile -Command ^
  "Compress-Archive -Path ('%~dp0src\bootstrap.js','%~dp0src\manifest.json','%~dp0src\options.html') -DestinationPath '%ZIP_FILE%' -Force"

@REM zip 改名为 xpi
ren "%ZIP_FILE%" "%FOLDER_NAME%.xpi"

echo.
echo package finished %XPI_FILE%
@REM pause
