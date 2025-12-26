@echo off
setlocal

:: === CONFIGURATION ===
set "TARGET=C:\Users\chita\Desktop\BallylikeStore\website\assets\images\products"

:: Go to the target directory
cd /d "%TARGET%"

:: Loop through all .png files and rename to .jpg
for %%f in (*.png) do (
    ren "%%f" "%%~nf.jpg"
)

echo All .png files in "%TARGET%" renamed to .jpg
pause