const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configuración de multer para la carga de archivos
const upload = multer({ dest: 'uploads/' });

app.post('/generate-apk', upload.single('appLogo'), (req, res) => {
    const appName = req.body.appName;
    const appLogoPath = req.file.path;

    // Comando Cordova para cambiar el nombre de la app
    const command = `cordova create custom-app com.example.customapp "${appName}" && cd custom-app && cordova platform add android`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error ejecutando Cordova: ${stderr}`);
            res.status(500).send('Error generando el APK');
            return;
        }

        // Coloca el logo de la aplicación
        const logoDestination = path.join(__dirname, 'custom-app', 'res', 'icon', 'android', 'icon.png');
        fs.copyFile(appLogoPath, logoDestination, (err) => {
            if (err) {
                res.status(500).send('Error al colocar el logo');
                return;
            }

            // Genera el APK
            exec('cordova build android', { cwd: path.join(__dirname, 'custom-app') }, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error al compilar la app: ${stderr}`);
                    res.status(500).send('Error al compilar la APK');
                    return;
                }

                // Enviar el APK generado al usuario
                const apkPath = path.join(__dirname, 'custom-app', 'platforms', 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
                res.download(apkPath, 'custom-app.apk');
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
