<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $apkName = $_POST['apkName'];
    $logo = $_FILES['logo'];

    // Verificar si se subió el archivo correctamente
    if ($logo['error'] === UPLOAD_ERR_OK) {
        $logoPath = 'uploads/' . basename($logo['name']);
        move_uploaded_file($logo['tmp_name'], $logoPath);

        // Comando para modificar el APK (ejemplo con APKTool)
        $apkOriginal = 'base_apk/app-debug.apk'; // APK base
        $apkModified = "generated_apks/$apkName.apk";

        // Aquí se puede usar APKTool para descompilar y personalizar
        exec("apktool d $apkOriginal -o temp_dir");
        copy($logoPath, 'temp_dir/res/drawable/logo.png'); // Reemplazar logo
        exec("apktool b temp_dir -o $apkModified");

        // Enviar el APK generado al cliente
        header('Content-Type: application/vnd.android.package-archive');
        header('Content-Disposition: attachment; filename="' . $apkName . '.apk"');
        readfile($apkModified);

        // Limpiar archivos temporales
        unlink($logoPath);
        exec("rm -rf temp_dir");
    } else {
        echo "Error al subir el logo.";
    }
} else {
    echo "Método no permitido.";
}
?>
