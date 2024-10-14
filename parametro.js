document.getElementById("apkForm").addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevenir recarga de página

      const formData = new FormData();
      const apkName = document.getElementById("apkName").value;
      const logoFile = document.getElementById("logoInput").files[0];

      formData.append("apkName", apkName);
      formData.append("logo", logoFile);

      const response = await fetch("generate_apk.php", {
        method: "POST",
        body: formData,
      });

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // Crear enlace de descarga
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${apkName}.apk`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
